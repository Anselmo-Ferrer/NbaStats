import { Input } from "@nextui-org/input";
import { Button, Checkbox, ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import LZString from "lz-string";import { StarFilledIcon } from "@radix-ui/react-icons";
;

export default function TipsComponent() {
  const columns = [
    { label: "Name", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
    { label: "Points", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Assists", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Rebounds", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Criterios", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Max Matches", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Last Matches", justifyItems: "justify-items-center", columnSpan: "col-span-2" },
  ];

  const [playersFinal, setPlayersFinal] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(1);
  const [rebounds, setRebounds] = useState(1);

  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(0);
  const [InputmaxGamesWithoutCriteria, setInputMaxGamesWithoutCriteria] = useState(0);

  const generatePossibilities = async () => {  
    const combinations = [];
    for (let i = 5; i <= 10; i++) {
      for (let j = 0; j <= 0; j++) {
        for (let k = 4; k <= 15; k++) {
          combinations.push({ points: i, assists: j, rebounds: k });
        }
      }
    }
  
    try {
      // Use uma abordagem assíncrona para processamento
      for (const combination of combinations) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setPoints(combination.points);
            setAssists(combination.assists);
            setRebounds(combination.rebounds);
            applyFilters(combination);
            resolve();
          }, 0); // Simula um pequeno delay para evitar bloqueios
        });
      }
    } catch (error) {
      console.error("Erro durante a geração de possibilidades:", error);
    }
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

const renderGameResult = (result) => {
  const color = result === "V" ? "rgb(34, 197, 94)" : "#C62D2D";
  return (
    <span 
      className='rounded-full mr-2 flex items-center justify-center'
      style={{ width: "25px", height: "25px", borderRadius: "50%",backgroundColor: color}}
    >
    </span>
  );
};




  return (
    <div className='p-10 flex w-full flex-col gap-8 z-50'>

      {/* inputs */}
      <div className='flex flex-col md:flex-row w-full gap-4'>
        <div className='w-full flex flex-col md:flex-row gap-4'>
          <Input className='w-full md:w-1/2' label="Min" labelPlacement="inside" type="number" onChange={(e) => setMinPercentage(Number(e.target.value))}/>
          <Input className='w-full md:w-1/2' label="Max" labelPlacement="inside" type="number"  onChange={(e) => setMaxPercentage(Number(e.target.value))}/>
          <Input className='w-full md:w-1/2' label="Games" labelPlacement="inside" type="number" onChange={(e) => setInputMaxGamesWithoutCriteria(Number(e.target.value))}/>
        </div>
        <Checkbox>points</Checkbox>
        <Checkbox>Assist</Checkbox>
        <Checkbox>Rebounds</Checkbox>
          <Input className='w-full md:w-1/2' label="Jogador" labelPlacement="inside" type="text" />
        <Button className='bg-[#057EFF] h-[55px] w-full md:w-1/2' onPress={generatePossibilities}>
          Filtrar
        </Button>
      </div>


      <ScrollShadow className="h-[750px] w-full pb-10 z-30 p-10">

      {allPlayers && allPlayers.length > 0 ? (
        allPlayers.reverse().map((playerList, index) => (
          playerList.map((player, idx) => (
        <div key={idx} className="mb-4 mt-4" style={{ backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "32px" }}>
          {/* columns */}
          <div style={{ marginBottom: "20px" }} className="grid grid-cols-9">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`grid ${column.columnSpan} ${column.justifyItems}`}
                style={{
                  color: "#868686",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {column.label}
              </div>
            ))}
          </div>

          {/* rows */}
          <div style={{ alignItems: "center", justifyContent: "space-between" }} className="grid grid-cols-9">
            {/* Player Info */}
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.name}</div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500" }}>{player.team}</div>
            </div>

            {/* Points */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.filterPoints}</span>
            </div>

            {/* Assists */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.filterAssists}</span>
            </div>

            {/* Rebounds */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.filterRebounds}</span>
            </div>

            {/* Criteria */}
            <div className="grid justify-items-center">
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.criteriaMet}/{player.totalGames}</div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500" }}>{player.percentage}%</div>
            </div>

            {/* Max Match Count */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.maxGamesWithoutCriteria}</span>
            </div>

            {/* Last Matches Indicators */}
            <div className="col-span-2 grid justify-items-center grid-flow-col">{player.last10Games.map(renderGameResult).slice(-10).reverse()}</div>

            {/* Favorite Icon */}
            <div className="justify-items-end mr-12">
              <button className='flex justify-center items-center' onClick={() => removeFavorites(index)}><StarFilledIcon className='w-[25px] h-[25px]' color="white" /></button>
            </div>
          </div>
        </div>
          ))
        ))
    ) : (
        <p className="w-full h-full text-center" style={{ color: "white" }}>Nenhum favorito encontrado.</p>
    )}

    </ScrollShadow>

      

    </div>
  )
}