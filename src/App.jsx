import Background from "./background.jsx"
import PlayerStatsFilter from "./jogadores.jsx"
import Navbar from "./navbar.jsx"
import Box from "./teste.jsx"
import TeamsDetail from "./times.jsx"

function App() {

  return (
    <div className="bg-black h-screen w-full px-10">
      <Background />
      <Navbar />
      < PlayerStatsFilter />
      <Box />
      {/* <TeamsDetail /> */}
    </div>
  )
}

export default App
