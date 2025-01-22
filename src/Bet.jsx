import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { Check, Edit, Plus, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Bet() {

  const infoColumns = [
    { label: "Points", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Assists", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Rebounds", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
  ];

  const betColumns = [
    { label: "Jogos", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Odd media", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
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


  const criarCard = () => {

    const card = {
      name: name,
      points: points,
      assists: assists,
      rebounds: rebounds,
      odds: [],
    }

    setCardsData((prevCardsData) => [...prevCardsData, card]);
    console.log("card criado")

  }

  useEffect(() => {
    console.log(cardsData)
  }, [cardsData])


  return (
    <div className="z-30 flex flex-col p-10 w-full gap-8">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl">Apostas</h1>
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

      {cardsData.map((card, index) => (
      <div className="w-full flex">
        <div className=' w-1/5 mb-4 py-8 rounded-l-lg' style={{backgroundColor: "#057EFF", backdropFilter: "blur(20px)"}}>

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
            {/* Player Info */}

              {/* Stats */}
              <div className="grid justify-items-center">
                <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                  {card.points}
                </span>
              </div>

              {/* Match Count */}
              <div className="grid justify-items-center">
                <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                  {card.assists}
                </span>
              </div>

              {/* Match Indicators */}
              <div className="grid justify-items-center">
                <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                  {card.rebounds}
                </span>
              </div>
            
         </div>




          
        </div>

          <div className='w-2/5 mb-4 py-8 rounded-r-lg flex flex-col justify-between ' style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)"}}>
            <div className="w-full">
              <div style={{ marginBottom: "20px" }} className="grid grid-cols-5 px-8 w-full">
                {betColumns.map((column, index) => (
                  <div className={`grid ${column.columnSpan} ${column.justifyItems}`} key={index} style={{color: "#868686", fontSize: "0.875rem", fontWeight: "500"}} >
                    {column.label}
                  </div>
                ))}
              </div>

              <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-5 px-8">
              {/* Player Info */}

                {/* Stats */}
                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    aa
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    aa
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    aa
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    aa
                  </span>
                </div>

                <div className="grid justify-items-center">
                  <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                    aa
                  </span>
                </div>  

              </div>
            </div>

            <div className="flex items-end justify-between h-full w-full gap-2 px-4">
                <button className="bg-[#057EFF] w-32 h-8 rounded-full flex items-center justify-center" onClick={() => setEditModalOpen(true)}><Edit className="w-4 h-4"/></button>
                <button className="bg-[#057EFF] w-32 h-8 rounded-full flex items-center justify-center" onClick={() => setGameEditModalOpen(true)}><Plus className="w-4 h-4"/></button>
                <button className="bg-[#18c964] w-32 h-8 rounded-full flex items-center justify-center"><Check className="w-4 h-4"/></button>
                <button className="bg-[#f31260] w-32 h-8 rounded-full flex items-center justify-center"><Trash className="w-4 h-4"/></button>
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

            <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-4 px-8">
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                1
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                3,20x
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
              R$ 30,00
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                R$ 96,00
              </span>
            </div>
          </div>
          </ScrollShadow>


      </div>
      ))}

      <Modal isOpen={editModalOpen} onOpenChange={setEditModalOpen} className="bg-[#1b1b1b]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">Editar aposta</ModalHeader>
              <ModalBody>
                <Input className="w-full md:w-1/3" label="Jogos" labelPlacement="inside" type="number" onChange={(e) => setPoints(Number(e.target.value))} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">
                  Salvar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={gameModalOpen} onOpenChange={setGameEditModalOpen} className="bg-[#1b1b1b]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">Editar aposta</ModalHeader>
              <ModalBody>
                <Input className="w-full md:w-1/3" label="Odds" labelPlacement="inside" type="number" onChange={(e) => setPoints(Number(e.target.value))} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">
                  Salvar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  )
}