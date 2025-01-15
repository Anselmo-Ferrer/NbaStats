import React, { useState } from 'react';
import LZString from 'lz-string';
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { Star } from 'lucide-react';

const columns = [
  { label: "Name", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
  { label: "Criterios", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Max Matches", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  { label: "Last Matches", justifyItems: "justify-items-center", columnSpan: "col-span-2" },
];

const PlayerStatsFilter = () => {
  const apiKeys = [
    import.meta.env.VITE_API_KEY_1,
    import.meta.env.VITE_API_KEY_2,
    import.meta.env.VITE_API_KEY_3,
    import.meta.env.VITE_API_KEY_4,
    import.meta.env.VITE_API_KEY_5,
    import.meta.env.VITE_API_KEY_7,
    import.meta.env.VITE_API_KEY_8,
    import.meta.env.VITE_API_KEY_9,
    import.meta.env.VITE_API_KEY_10,
    import.meta.env.VITE_API_KEY_11,
    import.meta.env.VITE_API_KEY_12,
    import.meta.env.VITE_API_KEY_13,
    import.meta.env.VITE_API_KEY_14,
    import.meta.env.VITE_API_KEY_15,
  ];

  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playersStats, setPlayersStats] = useState([]);
  const [gamesFetched, setGamesFetched] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0); // Tempo restante em segundos
  const [playerName, setPlayerName] = useState()

  let currentKeyIndex = 0;

  const getApiKey = () => apiKeys[currentKeyIndex];

  const fetchGameStats = async (gameId) => {
    const apiKey = getApiKey();
    const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?game=${gameId}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error fetching game ${gameId}: ${response.status}`);
    return response.json();
  };

  const fetchAndStoreData = async () => {
    setLoading(true);
    setError(null);
    setGamesFetched(0);
  
    const startGameId = 14084; // ID inicial do primeiro jogo
    let lastSavedGameId = startGameId - 1; // ID do último jogo salvo (começamos antes do primeiro jogo)
    const newGameData = [];
  
    try {
      // Verifica o localStorage para encontrar o último jogo salvo
      const compressedData = localStorage.getItem("compressedGameData");
      if (compressedData) {
        const existingData = JSON.parse(LZString.decompress(compressedData));
        const gameIds = new Set(existingData.map((game) => game.game.id));
        lastSavedGameId = Math.max(...gameIds);
        console.log(`Último jogo salvo encontrado: ${lastSavedGameId}`);
      }
  
      // Buscar apenas os jogos após o último salvo
      for (let gameId = lastSavedGameId + 1; ; gameId++) {
        try {
          const data = await fetchGameStats(gameId);
  
          if (data.response && data.response.length > 0) {
            newGameData.push(...data.response);
          } else {
            console.log(`Jogo ${gameId} não encontrado, encerrando busca.`);
            break; // Sai do loop ao encontrar um jogo inexistente
          }
  
          // Atualiza o contador de jogos buscados
          setGamesFetched((prev) => prev + 1);
  
          // Alterna a chave da API
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

          // Aguarda para evitar problemas de limite de taxa
          await new Promise((resolve) => setTimeout(resolve, 200));
          console.log(`Jogo ${gameId} buscado com sucesso.`);
        } catch (err) {
          console.error(`Erro ao buscar dados do jogo ${gameId}:`, err);
          break; // Sai do loop ao encontrar erro
        }
      }
  
      // Adiciona os novos jogos aos dados existentes
      const updatedGameData = compressedData
        ? JSON.parse(LZString.decompress(compressedData)).concat(newGameData)
        : newGameData;
  
      // Comprime e salva os dados no localStorage
      const compressedUpdatedData = LZString.compress(
        JSON.stringify(updatedGameData)
      );
      localStorage.setItem("compressedGameData", compressedUpdatedData);
  
      alert("Novos jogos salvos no Local Storage com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar os dados:", err);
      setError("Falha ao buscar os dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
        };
      }
  
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

    setPlayersStats(filteredPlayers.slice(0, 20));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
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
      <div className='flex flex-col w-[20%] gap-4'>
          <Input label="Pontos" labelPlacement="inside" type="number" value={points} onChange={aoMexerPontos}/>
          <Input label="Assistencias" labelPlacement="inside" type="number" value={assists} onChange={aoMexerAssistencias} />
          <Input label="Rebotes" labelPlacement="inside" type="number" value={rebounds} onChange={aoMexerRebotes} />
          <Input label="Jogador" labelPlacement="inside" type="text" onChange={aoMexerNome}  />
        <Button className='bg-[#FF6600]' onPress={applyFilters} disabled={loading}>
          Filtrar
        </Button>
        <Button color='transparent' onPress={fetchAndStoreData} disabled={loading}>
          {loading ? 'Fetching...' : 'Atualizar'}
        </Button>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        {loading && (
          <div>
            <p>Progresso: {gamesFetched} games fetched</p>
            <p>Tempo estimado: {formatTime(timeRemaining)}</p>
          </div>
        )}
      </div>


    <ScrollShadow className="w-[80%] h-screen overflow-auto" >
      <div className="flex flex-col">
        {playersStats.length > 0 ? (
          <div>
            {playersStats.map((player, index) => (
              <div className='mb-4' key={index} style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "32px"}}>
              {/* Column Headers */}
              <div style={{ marginBottom: "20px" }} className="grid grid-cols-6">
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
          <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-6">
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
              {player.last10Games.map(renderGameResult)}
            </div>

            {/* Notification Icon */}
            <div className="justify-items-end mr-12">
              <Star size={25} color="white" />
            </div>
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

export default PlayerStatsFilter;