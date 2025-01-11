import React, { useState, useEffect } from 'react';
import LZString from 'lz-string';
import {Card, CardBody} from "@nextui-org/react";

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

  const [points, setPoints] = useState(10);
  const [assists, setAssists] = useState(5);
  const [rebounds, setRebounds] = useState(3);
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

    const totalMatchs = 546
    const gamesEndId = 14084; // 50 partidas
    const gamesStartId = gamesEndId + totalMatchs;
    const totalGames = gamesStartId - gamesEndId + 1; // Número total de partidas
    setTimeRemaining(totalGames * 0.2); // Tempo total estimado em segundos

    const allGameData = [];

    try {
      for (let gameId = gamesStartId; gameId >= gamesEndId; gameId--) {
        try {
          const data = await fetchGameStats(gameId);

          if (data.response && data.response.length > 0) {
            allGameData.push(...data.response); // Adiciona os dados brutos
          }

          // Incrementa o contador de partidas buscadas
          setGamesFetched((prev) => prev + 1);

          // Reduz o tempo restante
          setTimeRemaining((prev) => prev - 1.5);

          // Alterna a chave da API
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

          // Aguarda 1.5 segundos antes de continuar
          await new Promise((resolve) => setTimeout(resolve, 200));
          console.log(`Jogo ${gameId} salvo na API ${currentKeyIndex}`)
        } catch (err) {
          console.error(`API ${currentKeyIndex}: Erro ao buscar dados do jogo ${gameId}:`, err);
          setFalhas((prevFalhas) => [...prevFalhas, gameId]);
          for (let j = 0; j < falhas.length; j++) {
            console.log(falhas[j])
          }
        }
      }

      const compressedData = LZString.compress(JSON.stringify(allGameData));
      localStorage.setItem('compressedGameData', compressedData);

      // Salva os dados brutos no localStorage
      alert('Dados comprimidos e salvos no Local Storage com sucesso!');
    } catch (err) {
      console.error('Erro ao buscar os dados:', err);
      setError('Falha ao buscar os dados. Por favor, tente novamente.');
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
          maxGamesWithoutCriteria: 0, // Armazena o máximo de jogos consecutivos sem bater critérios
          currentGamesWithoutCriteria: 0, // Contador temporário de jogos consecutivos
        };
      }
  
      playerStats[playerId].totalGames++;
  
      if (
        player.points >= points &&
        player.assists >= assists &&
        player.totReb >= rebounds
      ) {
        playerStats[playerId].criteriaMet++;
  
        // Reseta o contador de jogos consecutivos sem atender aos critérios
        playerStats[playerId].maxGamesWithoutCriteria = Math.max(
          playerStats[playerId].maxGamesWithoutCriteria,
          playerStats[playerId].currentGamesWithoutCriteria
        );
        playerStats[playerId].currentGamesWithoutCriteria = 0;
      } else {
        // Incrementa o contador de jogos consecutivos sem atender aos critérios
        playerStats[playerId].currentGamesWithoutCriteria++;
      }
    });
  
    // Atualiza o valor máximo após processar todos os jogos
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

  return (
    <div className='py-10 flex'>
      <div className='flex flex-col w-[20%]'>
        <h2>Player Stats Filter</h2>
        <label>
          Points:
          <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
        </label>
        <label>
          Assists:
          <input type="number" value={assists} onChange={(e) => setAssists(Number(e.target.value))} />
        </label>
        <label>
          Rebounds:
          <input type="number" value={rebounds} onChange={(e) => setRebounds(Number(e.target.value))} />
        </label>
        <button onClick={fetchAndStoreData} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch and Save Data'}
        </button>
        <button onClick={applyFilters} disabled={loading}>
          Apply Filters
        </button>
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
              className="border-none bg-background/60 dark:bg-default-100/50 mb-4 p-4 rounded-md"
              isBlurred
              shadow="sm"
            >
              {player.name} ({player.team}): {player.criteriaMet}/{player.totalGames} - 
              {((player.criteriaMet * 100) / player.totalGames).toFixed(0)}% 
              <br />
              Máximo de jogos sem critérios: {player.maxGamesWithoutCriteria}
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