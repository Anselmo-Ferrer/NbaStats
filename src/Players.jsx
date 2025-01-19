import React, { useState } from 'react';
import LZString from 'lz-string';
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { Star } from 'lucide-react';
import FetchAndStoreData from './components/FetchData';
import { StarFilledIcon } from '@radix-ui/react-icons';

const columns = [
  { label: "Name", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
  { label: "Criterios", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Max Matches", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Last Matches", justifyItems: "justify-items-center", columnSpan: "col-span-2" },
];

const SeeMoreColumns = [
  { label: "Game", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
  { label: "Points", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Assists", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Rebounds", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
]

const PlayerStatsFilter = () => {

  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [playersStats, setPlayersStats] = useState([]);
  const [playerName, setPlayerName] = useState()
  const [isFavorite, setIsfavorite] = useState(false)
  const [seeMatchesState, setSeeMatchesState] = useState({});

  const toggleSeeMatches = (playerId) => {
    setSeeMatchesState((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };


  const favoritar = () => {

  }

  const aoMexerPontos = (e) => {
    setPoints(Number(e.target.value))
    applyFilters()
  }

  const aoMexerAssistencias = (e) => {
    setAssists(Number(e.target.value))
    applyFilters()
  }

  const aoMexerRebotes = (e) => {
    setRebounds(Number(e.target.value))
    applyFilters()
  }

  const aoMexerNome = (e) => {
    setPlayerName(e.target.value)
  }

  const applyFilters = () => {
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
          totalGames: 0,
          criteriaMet: 0,
          percentage: 0,
          maxGamesWithoutCriteria: 0,
          currentGamesWithoutCriteria: 0,
          last10Games: [], // Array para armazenar os resultados dos últimos 10 jogos
          lastMatches: []
        };
      }

      const Match = {
        gameId: player.game.id,
        name: playerName,
        points: player.points,
        assists: player.assists,
        rebounds: player.totReb,
        criteria: ""
      }

      if (player.points >= points && player.assists >= assists && player.totReb >= rebounds) {
        Match.criteria = "V"
        playerStats[playerId].last10Games.push("V")
      } else {
        Match.criteria = "F"
        playerStats[playerId].last10Games.push("F")
      }

      playerStats[playerId].lastMatches.push(Match)
      playerStats[playerId].lastMatches.sort((a,b) => b.gameId - a.gameId)
  
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
      player.percentage = ((player.criteriaMet * 100) / player.totalGames).toFixed(0)
    });
  
    const filteredPlayers = Object.values(playerStats)
    .filter((player) => {
      // Filtra pelos critérios e pelo nome, caso `playerName` esteja preenchido
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

    console.log(playerStats)
    setPlayersStats(filteredPlayers.slice(0, 20));
  };

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
    <div className='py-10 flex gap-4'>

      {/* inputs */}
      <div className='flex flex-col w-[20%] gap-4'>
          <Input label="Pontos" labelPlacement="inside" type="number" value={points} onChange={aoMexerPontos}/>
          <Input label="Assistencias" labelPlacement="inside" type="number" value={assists} onChange={aoMexerAssistencias} />
          <Input label="Rebotes" labelPlacement="inside" type="number" value={rebounds} onChange={aoMexerRebotes} />
          <Input label="Jogador" labelPlacement="inside" type="text" onChange={aoMexerNome}  />
        <Button className='bg-[#FF6600]' onPress={applyFilters}>
          Filtrar
        </Button>
        <FetchAndStoreData />
      </div>

      {/* players cards */}
      <ScrollShadow className="w-[80%] h-screen overflow-auto" >
        <div className="flex flex-col">
          {playersStats.length > 0 ? (
            <div>
              {playersStats.map((player, index) => (
                // card
                <div className='mb-4 pt-8' key={index} style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px"}}>

                {/* Column Headers */}
                <div style={{ marginBottom: "20px" }} className="grid grid-cols-6 px-8">
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
                <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-6 px-8">
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

                  {/* Match Indicators */}
                  <div key={index} className="col-span-2 grid justify-items-center grid-flow-col">
                    {player.last10Games.map(renderGameResult).slice(-10)}
                  </div>

                  {/* Notification Icon */}
                  <div className="justify-items-end mr-12">
                    <button className='flex justify-center items-center' onClick={() => setIsfavorite(!isFavorite)}>
                      <Star size={25} color="white" hidden={isFavorite} />
                      <StarFilledIcon size={25} color="white" hidden={!isFavorite} />
                    </button>
                  </div>
                </div>

                {/* see matches button */}
                <div className='grid grid-cols-1 mt-4'>
                  <Button
                    onPress={() => toggleSeeMatches(index)}
                    className="px-4 py-2 bg-blue-500 text-white rounded bg-[#FF6600]"
                  >
                    {seeMatchesState[index] ? "Hide Matches" : "See Matches"}
                  </Button>
                </div>





                {seeMatchesState[index] && (
                <ScrollShadow className="w-full h-[300px] overflow-auto py-8">
                  <div style={{ marginBottom: "20px" }} className="grid grid-cols-5 px-8 w-full">
                      {SeeMoreColumns.map((column, index) => (
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



                  {player.lastMatches.map((match, idx) => (
                  <div className='w-full py-2 px-8 grid grid-cols-5 border-[0.2px] rounded-full mb-2'>
                  



                      {/* Player Info */}
                      <div className="flex items-center gap-2">
                        <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{idx+1}</div>
                        <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500",}}>{match.gameId}</div>
                      </div>

                      {/* points */}
                      <div className="grid justify-items-center">
                        <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                        {match.points}
                        </span>
                      </div>

                      {/* assits */}
                      <div className="grid justify-items-center">
                        <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                        {match.assists}
                        </span>
                      </div>

                      {/* rebounds */}
                      <div className="grid justify-items-center">
                        <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                        {match.rebounds}
                        </span>
                      </div>

                      <div className="grid justify-items-end">
                        <span className={`w-[25px] h-full rounded-full ${match.criteria === "V" ? "bg-[#448523]" : "bg-[#C62D2D]"}`}></span>
                      </div>


                    </div>
                  ))}
                </ScrollShadow>
                )}









              </div>
              // end card
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

export default PlayerStatsFilter;