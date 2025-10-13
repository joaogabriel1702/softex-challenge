import fs from 'fs/promises';

export async function splitGames(filepath) {
  const raw = await fs.readFile(filepath, 'utf8');
  const lines = raw.replace(/\r\n/g, '\n').split('\n');

  const games = [];
  let current = null;

  for (const line of lines) {
    if (line.includes('InitGame')) {
      if (current) {
        games.push(current);
      }
      current = [line];
      continue;
    }

    if (line.includes('ShutdownGame')) {
      if (current) {
        current.push(line);
        games.push(current);
        current = null;
      } else {

      }
      continue;
    }

    if (current) {
      current.push(line);
    }
  }

  if (current) {
    games.push(current);
  }

  return games;
}
