export function parseGameLines(lines) {
  const playersById = new Map(); 
  const kills = new Map();   
  let totalKills = 0;

  for (const line of lines) {
    if (line.includes('ClientUserinfoChanged:')) {
      const match = line.match(/ClientUserinfoChanged:\s+(\d+)\s+n\\([^\\]+)/);
      if (match) {
        const id = match[1];
        const name = match[2].trim();
        playersById.set(id, name);

        if (!kills.has(name)) {
          kills.set(name, 0);
        }
      }
    }

    if (line.includes('Kill:')) {
      totalKills++;

      const match = line.match(/Kill:\s+(\d+)\s+(\d+)\s+\d+:\s+([^ ]+)\s+killed\s+(.+)\s+by/);
      if (!match) continue;

      const killerId = match[1];
      const victimId = match[2];
      const killerName = match[3];
      const victimName = match[4];

      if (!kills.has(victimName) && victimName !== '<world>') {
        kills.set(victimName, 0);
      }

      if (killerName === '<world>') {
        if (kills.has(victimName)) {
          kills.set(victimName, kills.get(victimName) - 1);
        }
      } else {
        if (!kills.has(killerName)) {
          kills.set(killerName, 0);
        }
        kills.set(killerName, kills.get(killerName) + 1);
      }
    }
  }

  const players = Array.from(kills.keys());

  const killsObj = {};
  for (const [name, count] of kills.entries()) {
    killsObj[name] = count;
  }

  return {
    total_kills: totalKills,
    players,
    kills: killsObj
  };
}
