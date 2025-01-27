import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { Check, Edit, Plus, Trash, X, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CardTest from "./cardtest";
import LZString from "lz-string";

export default function Bet() {

  const infoColumns = [
    { label: "Points", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Assists", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Rebounds", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  ];

  const betColumns = [
    { label: "Jogos", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Odd", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Gale", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Gasto", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Retorno", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  ];

  const gamesColumns = [
    { label: "Game", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Odd", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Entrada", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Retorno", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  ];

  const [addModalOpen, setAddModalOpen] = useState(false); 
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [gameModalOpen, setGameEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [points, setPoints] = useState();
  const [assists, setAssists] = useState();
  const [rebounds, setRebounds] = useState();
  const [cardsData, setCardsData] = useState([]);
  const [gameEntry, setGameEntry] = useState()
  const [gameOdd, setGameOdd] = useState()

  const [localStorageData, setLocalStorageData] = useState([])

  const carregarDados = () => {
    const compressedData = localStorage.getItem('BetCards');
    if (compressedData) {
      const rawData = JSON.parse(LZString.decompress(compressedData));
      setLocalStorageData(rawData)
    }
  }
  
  useEffect(() => {
    carregarDados()
  }, [])

  const criarCard = () => {
    const compressedData = localStorage.getItem('BetCards');
    const rawData = compressedData
      ? JSON.parse(LZString.decompress(compressedData))
      : [];
  
    const card = {
      name: name,
      points: points,
      assists: assists,
      rebounds: rebounds,
      totalGames: 0,
      avarageOdd: 0,
      gale: 0,
      moneySpent: 0,
      moneyReturn: 0,
      games: [],
    };
  
    const dadosAtualizados = [...rawData, card];
    const comprimir = LZString.compress(JSON.stringify(dadosAtualizados));
    localStorage.setItem("BetCards", comprimir);
    setCardsData(dadosAtualizados);
    console.log("Card criado com sucesso!");
  };

  const salvarCard = () => {
    const dados = [...cardsData]
    console.log(dados)
    const compressedData = LZString.compress(JSON.stringify(dados));
    localStorage.setItem("BetCards", compressedData);
  }

  const addGame = (index) => {
    const game = {
      gameEntry: gameEntry,
      gameOdd: gameOdd,
      gameReturn: (gameEntry * gameOdd).toFixed(2),
    };
  
    const compressedData = localStorage.getItem('BetCards');
    const rawData = compressedData
      ? JSON.parse(LZString.decompress(compressedData))
      : [];
  
    const updatedCards = [...rawData];
    updatedCards[index].games.push(game);
    updatedCards[index].totalGames = updatedCards[index].games.length;
    updatedCards[index].avarageOdd =
      updatedCards[index].games.reduce((sum, game) => sum + game.gameOdd, 0) / updatedCards[index].games.length;
    updatedCards[index].moneySpent += game.gameEntry;
    updatedCards[index].moneyReturn =
      updatedCards[index].games[updatedCards[index].games.length - 1].gameReturn
  
    if (updatedCards[index].games.length > 1) {
      const currentIndex = updatedCards[index].games.length - 1;
      const currentEntry = updatedCards[index].games[currentIndex].gameEntry;
      const previousEntry = updatedCards[index].games[currentIndex - 1].gameEntry;
  
      updatedCards[index].gale = (currentEntry / previousEntry).toFixed(2);
    } else {
      updatedCards[index].gale = 0;
    }
  
    const comprimir = LZString.compress(JSON.stringify(updatedCards));
    localStorage.setItem("BetCards", comprimir);
    setCardsData(updatedCards);
    console.log("Game adicionado com sucesso ao card:", updatedCards[index]);
  };

  const deleteCard = (index) => {
    const compressedData = localStorage.getItem('BetCards');
    const rawData = compressedData
      ? JSON.parse(LZString.decompress(compressedData))
      : [];
  
    const updatedCards = rawData.filter((_, i) => i !== index);
    const comprimir = LZString.compress(JSON.stringify(updatedCards));
    localStorage.setItem("BetCards", comprimir);
    setLocalStorageData(updatedCards);
    console.log("Card excluído com sucesso!");
  };

  useEffect(() => {
    console.log(cardsData)
  }, [cardsData])

  return (
    <div className="z-30 flex flex-col p-10 w-full gap-8">
      <div className="w-full flex items-end justify-between">
        <CardTest label={"Total bets"} value={localStorageData.length}/>
        <CardTest label={"Greens"} value={0}/>
        <CardTest label={"Reds"} value={0}/>
        <CardTest label={"Acertividade"} value={0}/>
        <CardTest label={"Money Spent"} value={localStorageData.reduce((acc, card) => acc + (card.moneySpent || 0), 0)}/>
        <CardTest label={"Money earned"} value={0}/>
        <Button onPress={() => setAddModalOpen(true)} color="primary">Adicionar</Button>
      </div>
      <Modal isOpen={addModalOpen} onOpenChange={setAddModalOpen} className="bg-[#1b1b1b]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">Adicionar aposta</ModalHeader>
              <ModalBody>
                <Input className="w-full" label="Name" labelPlacement="inside" type="text" onChange={(e) => setName(e.target.value)} />
                <div className="flex gap-2">
                  <Input className="w-full md:w-1/3" label="Points" labelPlacement="inside" type="number" onChange={(e) => setPoints(Number(e.target.value))} />
                  <Input className="w-full md:w-1/3" label="Assists" labelPlacement="inside" type="number" onChange={(e) => setAssists(Number(e.target.value))} />
                  <Input className="w-full md:w-1/3" label="Rebotes" labelPlacement="inside" type="number" onChange={(e) => setRebounds(Number(e.target.value))} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={criarCard}>
                  Adicionar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {localStorageData.map((card, index) => (
      <div className="w-full flex">
        <div className=' w-[30%] mb-4 py-8 rounded-l-lg' style={{backgroundColor: "#057EFF", backdropFilter: "blur(20px)"}}>

          <div className="w-full flex flex-col items-center pb-4 gap-4">
            <span style={{color: "#000", fontSize: "0.875rem", fontWeight: "500"}} >
              Name
            </span>
            <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
              {card.name}
            </span>
          </div>

          <div style={{ marginBottom: "20px" }} className="grid grid-cols-3 px-8">
            {infoColumns.map((column, index) => (
              <div className={`grid ${column.columnSpan} ${column.justifyItems}`} key={index} style={{color: "#000", fontSize: "0.875rem", fontWeight: "500"}} >
                {column.label}
              </div>
            ))}
          </div>

          <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-3 px-8">
              <div className="grid justify-items-center">
                <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                  {card.points}
                </span>
              </div>

              <div className="grid justify-items-center">
                <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                  {card.assists}
                </span>
              </div>

              <div className="grid justify-items-center">
                <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                  {card.rebounds}
                </span>
              </div>
            
         </div>

        </div>

          <div className='w-2/5 mb-4 py-8 flex flex-col justify-between ' style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)"}}>
            <div className="w-full">
              <div style={{ marginBottom: "20px" }} className="grid grid-cols-5 px-8 w-full">
                {betColumns.map((column, index) => (
                  <div className={`grid ${column.columnSpan} ${column.justifyItems}`} key={index} style={{color: "#868686", fontSize: "0.875rem", fontWeight: "500"}} >
                    {column.label}
                  </div>
                ))}
              </div>

              <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-5 px-8">
                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    {card.totalGames}
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    {card.avarageOdd}
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    {card.gale}x
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    R$ {card.moneySpent}
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    R$ {card.moneyReturn}
                  </span>
                </div>  

              </div>
            </div>

            <div className="flex items-end justify-between h-full w-full gap-2 px-4">
                <button className="bg-[#057EFF] w-1/4 h-10 rounded-full flex items-center justify-center rounded-md" onClick={() => setGameEditModalOpen(true)}><Plus className="w-4 h-4"/></button>
                <button className="bg-[#18c964] w-1/4 h-10 rounded-full flex items-center justify-center rounded-md"><Check className="w-4 h-4"/></button>
                <button className="bg-[#f31260] w-1/4 h-10 rounded-full flex items-center justify-center rounded-md"><XIcon className="w-4 h-4"/></button>
                <button className="bg-transparent border-1 w-1/4 h-10 rounded-full flex items-center justify-center rounded-md" onClick={() => deleteCard(index)}><Trash className="w-4 h-4"/></button>
            </div>

          </div>

          <ScrollShadow className='w-2/5 h-[220px] mb-4 py-8 rounded-r-lg flex flex-col' style={{backgroundColor: "rgba(27, 27, 80, 0.6)", backdropFilter: "blur(20px)"}}>
            <div style={{ marginBottom: "20px" }} className="grid grid-cols-4 px-8">
              {gamesColumns.map((column, index) => (
                <div className={`grid ${column.columnSpan} ${column.justifyItems}`} key={index} style={{color: "#fff", fontSize: "0.875rem", fontWeight: "500"}} >
                  {column.label}
                </div>
              ))}
            </div>

            {card.games.map((game, index) => (

            <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-4 px-8">
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {index}
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {game.gameOdd}
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
               R$ {game.gameEntry}
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                R$ {game.gameReturn}
              </span>
            </div>
          </div>
          ))}
          </ScrollShadow>

          <Modal isOpen={gameModalOpen} onOpenChange={setGameEditModalOpen} className="bg-[#1b1b1b]">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-white">Add game</ModalHeader>
                  <ModalBody className="flex flex-row">
                    <Input className="w-full md:w-[48%]" label="Entry" labelPlacement="inside" type="number" onChange={(e) => setGameEntry(Number(e.target.value))} />
                    <Input className="w-full md:w-[48%]" label="Odd" labelPlacement="inside" type="number" onChange={(e) => setGameOdd(Number(e.target.value))} />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      close
                    </Button>
                    <Button color="primary" onPress={() => addGame(index)}>
                      Add
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

      </div>
      ))}

    </div>
  )
}