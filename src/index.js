import express from 'express';
import fs from 'fs';
import path from 'path';
import { splitGames } from './splitGames.js';
import { parseGameLines } from './gameParser.js';
import { generateReport } from './reportGenerator.js';

const app = express();
const PORT = process.env.PORT || 3000;

let parsedGames = [];
let globalRanking = [];

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

  generateReport(parsedGames);
}

async function loadData() {
  const filepath = path.resolve('./games.log');

  if (!fs.existsSync(filepath)) {
    console.error(`Arquivo não encontrado: ${filepath}`);
    process.exit(1);
  }

  const games = await splitGames(filepath);
  parsedGames = games.map((lines, i) => ({
    id: i + 1,
    name: `game_${i + 1}`,
    ...parseGameLines(lines)
  }));

  const { globalRanking: ranking } = generateReport(
    parsedGames.map((g, i) => ({ [`game_${i + 1}`]: g }))
  );

  globalRanking = ranking;
}

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Quake Log Parser API - use /games ou /ranking'
  });
});

app.get('/games', (req, res) => {
  res.json(parsedGames.map(({ id, name, total_kills, players }) => ({
    id,
    name,
    total_kills,
    players
  })));
});

app.get('/games/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const game = parsedGames.find(g => g.id === id);
  if (!game) {
    return res.status(404).json({ error: 'Jogo não encontrado' });
  }
  res.json(game);
});

app.get('/ranking', (req, res) => {
  res.json(globalRanking.map(([player, kills]) => ({
    player,
    kills
  })));
});

app.listen(PORT, async () => {
  await loadData();
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});


main();
