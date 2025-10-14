export function generateReport(parsedGames) {
  console.log('\n==============================');
  console.log('RELATÓRIO DE JOGOS');
  console.log('==============================\n');

  const globalRanking = {};

  parsedGames.forEach((gameObj, i) => {
    const gameName = `game_${i + 1}`;
    const game = gameObj[gameName];

    console.log(`🎮 ${gameName}`);
    console.log(`Total de kills: ${game.total_kills}`);
    console.log(`Jogadores: ${game.players.join(', ')}`);

    console.log('Kills por jogador:');
    for (const [player, kills] of Object.entries(game.kills)) {
      console.log(`   ${player}: ${kills}`);

      if (!globalRanking[player]) globalRanking[player] = 0;
      globalRanking[player] += kills;
    }

    console.log('------------------------------');
  });

  const sortedRanking = Object.entries(globalRanking)
    .sort((a, b) => b[1] - a[1]);

  console.log('==============================');
  console.log('RANKING GERAL DE KILLS');
  console.log('==============================');

  sortedRanking.forEach(([player, kills], index) => {
    const pos = String(index + 1).padStart(2, '0');
    console.log(`${pos}. ${player.padEnd(20)} ${kills} kills`);
  });

  console.log('==============================\n');

  return { globalRanking: sortedRanking };
}
