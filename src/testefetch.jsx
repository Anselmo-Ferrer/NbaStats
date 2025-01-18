import { Button } from "@nextui-org/react";
import LZString from "lz-string";

export default function TesteFetch() {

  const fetchGameStats = async (gameId) => {
    const apiKey = "89e8d18db2msh750cb1be8006c38p19c402jsne47214e05847"
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

    try {
      const allGameData = [];

      const data = await fetchGameStats(14084);
      if (data.response && data.response.length > 0) {
        allGameData.push(...data.response);
      }

      // Compactar e armazenar os dados atualizados no localStorage
      const compressed = LZString.compress(JSON.stringify(allGameData));
      localStorage.setItem("compressedGameData", compressed);

      alert("Dados atualizados e salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao buscar os dados:", err);
    }
  };

  const verPartidaEspecifica = async () => {
    let partida = parseInt(prompt())
    const data = await fetchGameStats(partida);
    console.log(data)
  }



  const handleButtonClick = async () => {
    const gameId = 14084; // Exemplo de gameId
    const data = await fetchGameStats(gameId);
    console.log(data)
    if (data.response && data.response.length > 0) {
      console.log('tem dados')
    }
    else {
      console.log("nao tem dados")
    }
  };

  const verDados = () => {
    const compressedData = localStorage.getItem('compressedGameData');
    const rawData = JSON.parse(LZString.decompress(compressedData));

    console.log(rawData)
  };

  return (
    <div>
      <Button onPress={handleButtonClick}>Testar</Button>
      <Button onPress={fetchAndStoreData}>Resetar</Button>
      <Button onPress={verDados}>Dados</Button>
      <Button onPress={verPartidaEspecifica}>Especifica</Button>
    </div>
  );
}