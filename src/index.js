// src/index.js
import path from 'path';
import { splitGames } from './splitGames.js';
import fs from 'fs';

async function main() {
  const args = process.argv.slice(2);
  const filepath = args[0] || path.resolve('./games.log');

  if (!fs.existsSync(filepath)) {
    console.error(`Arquivo não encontrado: ${filepath}`);
    process.exit(1);
  }

  try {
    const games = await splitGames(filepath);
    console.log(`Encontrados ${games.length} jogo(s).`);
    games.forEach((g, i) => {
      console.log(`game ${i + 1}: ${g.length} linhas`);
    });

    if (games.length > 0) {
      console.log('Primeiras 10 linhas do game_1:');
      console.log(games[0].slice(0, 10).join('\n'));
    }
  } catch (err) {
    console.error('Erro:', err);
  }
}

main();
