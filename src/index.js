import path from 'path';
import fs from 'fs';
import { splitGames } from './splitGames.js';
import { parseGameLines } from './gameParser.js';

async function main() {
  const args = process.argv.slice(2);
  const filepath = args[0] || path.resolve('./games.log');

  if (!fs.existsSync(filepath)) {
    console.error(`Arquivo não encontrado: ${filepath}`);
    process.exit(1);
  }

  const games = await splitGames(filepath);
  console.log(`Encontrados ${games.length} jogo(s)\n`);

  const parsedGames = games.map((lines, i) => {
    const result = parseGameLines(lines);
    return { [`game_${i + 1}`]: result };
  });

  for (const game of parsedGames) {
    console.log(JSON.stringify(game, null, 2));
  }
}

main();
