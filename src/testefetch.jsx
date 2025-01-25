import { Button } from "@nextui-org/react";
import LZString from "lz-string";

export default function TesteFetch() {

  const fetchGameStats = async (gameId) => {
    const apiKey = "38672978a3mshb0e70ee4a14db29p110155jsnb9b1f54aa483"
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


  const localStorageGroups = () => {
    // Recuperar e descompactar os dados existentes
    const compressedData = localStorage.getItem('compressedGameData');
    const rawData = JSON.parse(LZString.decompress(compressedData));
    
    // Compactar os dados novamente para 'apiData'
    const compressed = LZString.compress(JSON.stringify(rawData));
    localStorage.setItem("PlayersGameData", compressed);
  
    console.log("Dados salvos em 'apiData' com sucesso!");
  };

  const verDados = () => {
    const compressedData = localStorage.getItem('compressedGameData');
    const rawData = JSON.parse(LZString.decompress(compressedData));

    console.log(rawData)
  };

  const verDados2 = () => {
    const apiData = localStorage.getItem('PlayersGameData');
    const rawData = JSON.parse(LZString.decompress(apiData));

    console.log(rawData)
  };

  return (
    <div>
      <Button onPress={handleButtonClick}>Testar</Button>
      <Button onPress={fetchAndStoreData}>Primeira</Button>
      <Button onPress={verDados}>Dados</Button>
      <Button onPress={verDados2}>Dados2</Button>
      <Button onPress={localStorageGroups}>Criar</Button>
      <Button onPress={verPartidaEspecifica}>Especifica</Button>
    </div>
  );
}