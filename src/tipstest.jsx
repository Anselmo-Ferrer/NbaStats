import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import LZString from "lz-string";

export default function TipsTest() {
  const [playersFinal, setPlayersFinal] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(1);
  const [rebounds, setRebounds] = useState(1);

  const [minPercentage, setMinPercentage] = useState(40);
  const [maxPercentage, setMaxPercentage] = useState(50);
  const [InputmaxGamesWithoutCriteria, setInputMaxGamesWithoutCriteria] = useState(3);

  // Função para gerar as combinações de critérios
  const generatePossibilities = () => {
    const combinations = [];
    for (let i = 0; i <= 0; i++) {
      for (let j = 4; j <= 15; j++) {
        for (let k = 4; k <= 15; k++) {
          combinations.push({ points: i, assists: j, rebounds: k });
        }
      }
    }

    // Itera sobre as combinações e chama `applyFilters` para cada uma
    combinations.forEach((combination) => {
      setPoints(combination.points);
      setAssists(combination.assists);
      setRebounds(combination.rebounds);
      applyFilters(combination);
    });

    setPlayersFinal(combinations); // Apenas para depuração ou outros usos
  };

  // Função para aplicar os filtros
  // Função para aplicar os filtros
// Função para aplicar os filtros
const applyFilters = (filters) => {
  const { points, assists, rebounds } = filters;
  const compressedData = localStorage.getItem("compressedGameData");
  if (!compressedData) {
    console.error("Nenhum dado encontrado no Local Storage.");
    return;
  }

  const rawData = JSON.parse(LZString.decompress(compressedData));
  if (!rawData || rawData.length === 0) {
    console.error("Falha ao descomprimir ou nenhum dado encontrado.");
    return;
  }

  const playerStats = {};

  rawData.forEach((player) => {
    const playerId = player.player.id;
    const playerName = `${player.player.firstname} ${player.player.lastname}`;
    const teamName = player.team ? player.team.name : "Unknown Team";

    if (!playerStats[playerId]) {
      playerStats[playerId] = {
        name: playerName,
        team: teamName,
        totalGames: 0,
        criteriaMet: 0,
        percentage: 0,
        maxGamesWithoutCriteria: 0,
        currentGamesWithoutCriteria: 0,
        last10Games: [],
        lastMatches: [],
        filterPoints: points,
        filterAssists: assists,
        filterRebounds: rebounds
      };
    }

    const match = {
      gameId: player.game.id,
      name: playerName,
      points: player.points,
      assists: player.assists,
      rebounds: player.totReb,
      criteria: "",
    };

    if (
      player.points >= points &&
      player.assists >= assists &&
      player.totReb >= rebounds
    ) {
      match.criteria = "V";
      playerStats[playerId].last10Games.push("V");
    } else {
      match.criteria = "F";
      playerStats[playerId].last10Games.push("F");
    }

    playerStats[playerId].lastMatches.push(match);
    playerStats[playerId].lastMatches.sort((a, b) => b.gameId - a.gameId);

    playerStats[playerId].totalGames++;

    const metCriteria =
      player.points >= points &&
      player.assists >= assists &&
      player.totReb >= rebounds;

    if (metCriteria) {
      playerStats[playerId].criteriaMet++;
      playerStats[playerId].maxGamesWithoutCriteria = Math.max(
        playerStats[playerId].maxGamesWithoutCriteria,
        playerStats[playerId].currentGamesWithoutCriteria
      );
      playerStats[playerId].currentGamesWithoutCriteria = 0;
    } else {
      playerStats[playerId].currentGamesWithoutCriteria++;
    }
  });

  Object.values(playerStats).forEach((player) => {
    player.maxGamesWithoutCriteria = Math.max(
      player.maxGamesWithoutCriteria,
      player.currentGamesWithoutCriteria
    );
    player.percentage = (
      (player.criteriaMet * 100) /
      player.totalGames
    ).toFixed(0);
  });

  // Filtra os jogadores que não atendem aos critérios
  const filteredPlayers = Object.values(playerStats).filter(
    (player) =>
      player.percentage > minPercentage &&
      player.percentage < maxPercentage &&
      player.maxGamesWithoutCriteria <= InputmaxGamesWithoutCriteria
  );

  // Atualiza o estado com os jogadores filtrados

  setAllPlayers((prevAllPlayers) => [...prevAllPlayers, filteredPlayers]);

  console.log("Resultados para filtros:", filters, filteredPlayers);
};

useEffect(() => {
  console.log(allPlayers)
}, [allPlayers])

  return (
    <div className="bg-black w-full h-full flex flex-col items-center justify-center space-y-4">
      <Button onPress={generatePossibilities}>Gerar Possibilidades</Button>
      {allPlayers.map((playerList) => (
        playerList.map((ply) => (
          <span key={ply.name}>
            {ply.name} - {ply.team} - / pontos: {ply.filterPoints} / assists: {ply.filterAssists} / rebounds: {ply.filterRebounds} / {ply.criteriaMet}/{ply.totalGames}, ({ply.percentage}%) / {ply.maxGamesWithoutCriteria}
          </span>
        ))
      ))}
    </div>
  );
}