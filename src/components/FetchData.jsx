import { Button } from "@nextui-org/react";
import { useState } from "react";
import LZString from "lz-string";

export default function FetchAndStoreData() {
  const apiKeys = [
    import.meta.env.VITE_API_KEY_1,
    import.meta.env.VITE_API_KEY_2,
    import.meta.env.VITE_API_KEY_4,
    import.meta.env.VITE_API_KEY_5,
    import.meta.env.VITE_API_KEY_7,
    import.meta.env.VITE_API_KEY_8,
    import.meta.env.VITE_API_KEY_9,
    import.meta.env.VITE_API_KEY_10,
    import.meta.env.VITE_API_KEY_12,
    import.meta.env.VITE_API_KEY_13,
    import.meta.env.VITE_API_KEY_14,
    import.meta.env.VITE_API_KEY_15,
  ];

  const [error, setError] = useState(null);
  const [gamesFetched, setGamesFetched] = useState(0);

  let currentKeyIndex = 0;

  const getApiKey = () => apiKeys[currentKeyIndex];

  const fetchGameStats = async (gameId) => {
    const apiKey = getApiKey();
    const url = `https://api-nba-v1.p.rapidapi.com/players/statistics?game=${gameId}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error fetching game ${gameId}: ${response.status}`);
    return response.json();
  };

  const fetchAndStoreData = async () => {
    setError(null);
    setGamesFetched(0);

    try {
      // Recuperar dados armazenados no localStorage
      const compressedData = localStorage.getItem("compressedGameData");
      const rawData = compressedData ? JSON.parse(LZString.decompress(compressedData)) : [];
      const allGameData = [...rawData];

      // Encontrar o último `gameId` armazenado
      const uniqueGameIds = [...new Set(rawData.map((game) => game.game.id))];
      let nextGameId = uniqueGameIds.length > 0 ? Math.max(...uniqueGameIds) + 1 : 1; // Começar do próximo ID
      let maxFalseGames = 0

      while (true) {
        try {
          // Buscar dados do próximo jogo
          const data = await fetchGameStats(nextGameId);
          console.log(data)
          if (data.response && data.response.length > 0) {
            allGameData.push(...data.response);
            setGamesFetched((prev) => prev + 1);

            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length; // Alternar chave da API
            nextGameId++; // Incrementar para o próximo jogo
            maxFalseGames = 0
            console.log(maxFalseGames)

          // Aguardar antes da próxima solicitação
            await new Promise((resolve) => setTimeout(resolve, 250));
          } else {
            if (maxFalseGames === 1) {
              break
            }
            maxFalseGames++
            nextGameId++
            console.log(maxFalseGames)
          }

        } catch (err) {
          console.error(`Error fetching game ${nextGameId}:`, err);
          console.log("Nenhum dado encontrado, encerrando busca.");
          break; // Parar loop ao encontrar erro
        }
      }

      // Compactar e armazenar os dados atualizados no localStorage
      const compressed = LZString.compress(JSON.stringify(allGameData));
      localStorage.setItem("compressedGameData", compressed);

      alert("Dados atualizados e salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar os dados:", err);
      setError("Falha ao buscar e salvar os dados. Tente novamente.");
    }
  };

  const getLastGameId = () => {
    const compressedData = localStorage.getItem("compressedGameData");
    if (!compressedData) {
      console.log("Nenhum dado encontrado no localStorage.");
      return null;
    }

    const rawData = JSON.parse(LZString.decompress(compressedData));
    const uniqueGameIds = [...new Set(rawData.map((game) => game.game.id))];
    const lastGameId = uniqueGameIds.length > 0 ? Math.max(...uniqueGameIds) : null;

    console.log("Último game ID:", lastGameId);
    return lastGameId;
  };

  return (
    <div className="flex flex-col justify-center">
      <Button color="transparent" onPress={fetchAndStoreData}>
        Atualizar
      </Button>
      {/* <Button color="transparent" onPress={getLastGameId}>
        Ver último jogo
      </Button> */}

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}