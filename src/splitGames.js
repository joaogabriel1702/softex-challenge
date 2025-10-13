// src/splitGames.js
import fs from 'fs/promises';

/**
 * Lê um arquivo de log e separa em blocos de jogo.
 * Cada jogo começa em uma linha com "InitGame" e termina em "ShutdownGame" (ou antes do próximo InitGame).
 *
 * @param {string} filepath - caminho para games.log
 * @returns {Promise<string[][]>} - array de jogos, cada jogo é um array de linhas (strings)
 */
export async function splitGames(filepath) {
  const raw = await fs.readFile(filepath, 'utf8');
  // Normaliza quebras de linha e separa por linhas
  const lines = raw.replace(/\r\n/g, '\n').split('\n');

  const games = [];
  let current = null;

  for (const line of lines) {
    // detecta início de partida
    if (line.includes('InitGame')) {
      // se já havia um current, empurra (caso não tenha tido ShutdownGame)
      if (current) {
        games.push(current);
      }
      current = [line];
      continue;
    }

    // detecta fim de partida
    if (line.includes('ShutdownGame')) {
      if (current) {
        current.push(line);
        games.push(current);
        current = null;
      } else {
        // linha Shutdown sem Init — ignoramos ou poderíamos logar
      }
      continue;
    }

    // se estivermos dentro de um jogo, adiciona a linha
    if (current) {
      current.push(line);
    }
  }

  // se arquivo terminou mas havia um jogo aberto, empurra
  if (current) {
    games.push(current);
  }

  return games;
}
