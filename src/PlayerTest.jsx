import React, { useEffect, useState } from 'react';
import LZString from 'lz-string';
import { Button, Checkbox, Input, ScrollShadow } from "@nextui-org/react";
import { Star } from 'lucide-react';

const columns = [
  { label: "Name", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
  { label: "Criterios", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Max Matches", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Points", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Assists", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Rebounds", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Last Matches", justifyItems: "justify-items-center", columnSpan: "col-span-3" },
];

const PlayerTest = () => {

  const [percentageMin, setPercentageMin] = useState()
  const [percentageMax, setPercentageMax] = useState()
  const [maxGames, setMaxGames] = useState()
  const [error, setError] = useState(null);
  const [playersStats, setPlayersStats] = useState([]);
  const [finalStats, setFinalStats] = useState([])
  const [playerName, setPlayerName] = useState()
  const [pointsCheckBox, setPointsCheckBox] = useState(false)
  const [assistsCheckBox, setAssistsCheckBox] = useState(false)
  const [reboundsCheckBox, setReboundsCheckBox] = useState(false)

  const aoMexerNome = (e) => {
    setPlayerName(e.target.value)
  }
  

  const applyFilters = (pontos, assistencias, rebotes) => {
    const compressedData = localStorage.getItem('compressedGameData');
    if (!compressedData) {
      setError('Nenhum dado encontrado no Local Storage. Busque os dados primeiro.');
      return;
    }
  
    const rawData = JSON.parse(LZString.decompress(compressedData));
    if (!rawData || rawData.length === 0) {
      setError('Falha ao descomprimir ou nenhum dado encontrado.');
      return;
    }
  
    const playerStats = {};
  
    rawData.forEach((player) => {
      const playerId = player.player.id;
      const playerName = `${player.player.firstname} ${player.player.lastname}`;
      const teamName = player.team ? player.team.name : 'Unknown Team';
  
      if (!playerStats[playerId]) {
        playerStats[playerId] = {
          name: playerName,
          team: teamName,
          points: pontos,
          assists: assistencias,
          rebounds: rebotes,
          totalGames: 0,
          criteriaMet: 0,
          percentage: 0,
          maxGamesWithoutCriteria: 0,
          currentGamesWithoutCriteria: 0,
          last10Games: [], // Array para armazenar os resultados dos últimos 10 jogos
        };
      }
  
      playerStats[playerId].totalGames++;
  
      const metCriteria =
        player.points >= pontos &&
        player.assists >= assistencias &&
        player.totReb >= rebotes;
  
      if (metCriteria) {
        playerStats[playerId].criteriaMet++;
        playerStats[playerId].maxGamesWithoutCriteria = Math.max(
          playerStats[playerId].maxGamesWithoutCriteria,
          playerStats[playerId].currentGamesWithoutCriteria
        );
        playerStats[playerId].currentGamesWithoutCriteria = 0;
        playerStats[playerId].last10Games.push("V");
      } else {
        playerStats[playerId].currentGamesWithoutCriteria++;
        playerStats[playerId].last10Games.push("F");
      }
  
      // Mantém apenas os últimos 10 jogos
      playerStats[playerId].last10Games = playerStats[playerId].last10Games.slice(-10);
    });
  
    Object.values(playerStats).forEach((player) => {
      player.maxGamesWithoutCriteria = Math.max(
        player.maxGamesWithoutCriteria,
        player.currentGamesWithoutCriteria
      );
      player.percentage = ((player.criteriaMet * 100) / player.totalGames).toFixed(0)
    });



  
    const filteredPlayers = Object.values(playerStats)
    .filter((player) => {
      const matchesName = playerName
        ? player.name.toLowerCase().includes(playerName.toLowerCase())
        : true;

      return matchesName && player.criteriaMet > 0;
    })
    .sort((a, b) => {
      const percentageA = (a.criteriaMet / a.totalGames) * 100;
      const percentageB = (b.criteriaMet / b.totalGames) * 100;
      return percentageB - percentageA;
    });

    return filteredPlayers.slice(0, 20)
  };

  const adicionar = () => {
    let indice = 0;
    const filtros = [];

    let pointsValue = pointsCheckBox === true ? 30 : 1;
    let assistsValue = assistsCheckBox === true ? 20 : 1;
    let reboundsValue = reboundsCheckBox === true ? 20 : 1;

    for (let i = 1; i < 2; i++) {
      for (let j = 3; j < 30; j++) {
        for (let k = 3; k < 4; k++) {
          filtros[indice] = applyFilters(i, j, k)
          indice++
        }
      }
    }
  
    setPlayersStats((prevArrayDeArrays) => {
      const novoArray = [...filtros, ...prevArrayDeArrays.slice(10)];
      return novoArray;
    });
  };



  const MaxFilter = () => {
    const playersFiltered = []

    playersStats.map((playerArray) => {
      Object.values(playerArray).forEach((player) => {
        if (player.percentage >= percentageMin && player.percentage <= percentageMax && player.maxGamesWithoutCriteria <= maxGames) {
          playersFiltered.push(player)
        }
      })
    })

    playersFiltered.sort((a,b) => b.percentage - a.percentage)

    setFinalStats(playersFiltered)
  }

  const tudo = () => {
    adicionar()
    MaxFilter()
  }




  // Função para renderizar bolinhas verdes (Vitória) e vermelhas (Derrota)
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
    <div className='py-10 flex gap-4 z-30'>
      <div className='flex flex-col w-[20%] gap-4'>
        <div className='flex gap-2 items-center justify-center'>
          <Input label="Percentage min" labelPlacement="inside" type="number" value={percentageMin} onChange={(e) => setPercentageMin(Number(e.target.value))}/>
          <span>to</span>
          <Input label="Percentage max" labelPlacement="inside" type="number" value={percentageMax} onChange={(e) => setPercentageMax(Number(e.target.value))}/>
        </div>
          <Input label="Max games" labelPlacement="inside" type="number" value={maxGames} onChange={(e) => setMaxGames(Number(e.target.value))}/>
          <Input label="Jogador" labelPlacement="inside" type="text" onChange={aoMexerNome}  />
          <div className='flex flex-col gap-2'>
            <Checkbox isSelected={pointsCheckBox} onValueChange={() => setPointsCheckBox(!pointsCheckBox)}>Pontos</Checkbox>
            <Checkbox isSelected={assistsCheckBox} onValueChange={() => setAssistsCheckBox(!assistsCheckBox)}>Assistencias</Checkbox>
            <Checkbox isSelected={reboundsCheckBox} onValueChange={() => setReboundsCheckBox(!reboundsCheckBox)}>Rebotes</Checkbox>
          </div>
        <Button className='bg-[#FF6600]' onPress={tudo}>
          Filtrar
        </Button>
        <Button className='bg-[#FF6600]' onPress={adicionar} >
          adicionar
        </Button>
        <Button className='bg-[#FF6600]' onPress={MaxFilter} >
          MaxFilter
        </Button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>


    <ScrollShadow className="w-[80%] h-screen overflow-auto" >
      <div className="flex flex-col">
        {finalStats.length > 0 ? (
          <div>
            {finalStats.map((player, index) => (
              <div className='mb-4' key={index} style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "32px"}}>
              {/* Column Headers */}
              <div style={{ marginBottom: "20px" }} className="grid grid-cols-9">
                {columns.map((column, index) => (
                  <div
                    className={`grid ${column.columnSpan} ${column.justifyItems}`}
                    key={index}
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

              {/* Content Row */}
          <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-9">
            {/* Player Info */}
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {player.name}
              </div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500",}}>
                {player.team}
              </div>
            </div>

            {/* Stats */}
            <div className="grid justify-items-center">
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {player.criteriaMet}/{player.totalGames}
              </div>
              <div style={{color: "#868686", fontSize: "0.6875rem", fontWeight: "500",}} >
                {player.percentage}%
              </div>
            </div>

            {/* Match Count */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {player.maxGamesWithoutCriteria}
              </span>
            </div>
            
            {/* points */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {player.points}
              </span>
            </div>

            {/* assists */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {player.assists}
              </span>
            </div>

            {/* rebounds */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {player.rebounds}
              </span>
            </div>

            {/* Match Indicators */}
            <div key={index} className="col-span-2 grid justify-items-center grid-flow-col">
              {player.last10Games.map(renderGameResult)}
            </div>

            {/* Notification Icon */}
            {/* <div className="justify-items-end mr-12">
              <Star size={25} color="white" />
            </div> */}
          </div>



              
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full h-[300px] flex justify-center items-center'>
            <p className='text-4xl'>Busque por criterios.</p>
          </div>
        )}
      </div>
      </ScrollShadow>
    </div>
  );
};

export default PlayerTest;