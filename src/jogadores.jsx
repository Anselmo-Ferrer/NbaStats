import React, { useState, useEffect } from 'react';
import LZString from 'lz-string';
import { Button, Card, CardBody, Input } from "@nextui-org/react";

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

  const [points, setPoints] = useState();
  const [assists, setAssists] = useState();
  const [rebounds, setRebounds] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playersStats, setPlayersStats] = useState([]);
  const [gamesFetched, setGamesFetched] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0); // Tempo restante em segundos
  const [falhas, setFalhas] = useState([])

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
    });
  
    const filteredPlayers = Object.values(playerStats)
      .filter((player) => player.criteriaMet > 0)
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
    const color = result === "V" ? "green" : "red";
    return (
      <span 
        className='rounded-full mr-2 flex items-center justify-center'
        style={{
          backgroundColor: color, 
          width: '20px', 
          height: '20px', 
          opacity: '0.4'
        }} 
      >
      </span>
    );
  };

  return (
    <div className='py-10 flex'>
      <div className='flex flex-col w-[20%]'>
        <h2>Player Stats Filter</h2>
          <Input label="Pontos" labelPlacement="inside" type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))}/>
          <Input label="Pontos" labelPlacement="inside" type="number" value={assists} onChange={(e) => setAssists(Number(e.target.value))} />
          <Input label="Pontos" labelPlacement="inside" type="number" value={rebounds} onChange={(e) => setRebounds(Number(e.target.value))} />
        <Button color='primary' onClick={fetchAndStoreData} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch and Save Data'}
        </Button>
        <Button color='primary' onClick={applyFilters} disabled={loading}>
          Apply Filters
        </Button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {loading && (
        <div>
          <p>Progress: {gamesFetched} games fetched</p>
          <p>Estimated Time Remaining: {formatTime(timeRemaining)}</p>
        </div>
      )}

      <div className='w-[80%]'>
        <h3>Top 20 Players</h3>
        {playersStats.length > 0 ? (
          <Card className="py-10 flex flex-col">
            {playersStats.map((player, index) => (
              <CardBody
                key={index}
                className="border-none bg-background/60 dark:bg-default-100/50 mb-4 p-4 rounded-md flex flex-row gap-4"
                isBlurred
                shadow="sm"
              >
                <div className='flex flex-col items-center justify-center'>
                  <span>
                    {player.name}:
                  </span>
                  <span className='text-default-500 text-sm'>
                    ({player.team})
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <span>
                    {player.criteriaMet}/{player.totalGames}
                  </span>
                  <span className='text-default-500 text-sm'>
                    ({((player.criteriaMet * 100) / player.totalGames).toFixed(0)}%)
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <span>
                    Máximo de jogos sem critérios
                  </span>
                  <span className='text-default-500 text-sm'>
                    {player.maxGamesWithoutCriteria}
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <span>
                    Últimos 10 jogos
                  </span>
                  <span className='flex'>
                    {player.last10Games.map(renderGameResult)}
                  </span>
                </div>
              </CardBody>
            ))}
          </Card>
        ) : (
          <p>No players found.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerStatsFilter;