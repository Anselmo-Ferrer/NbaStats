import PlayerStatsFilter from "./jogadores.jsx"
import Navbar from "./navbar.jsx"
import TeamsDetail from "./times.jsx"

function App() {

  return (
    <div className="bg-stone-900 h-full w-full px-10">
      <Navbar />
      < PlayerStatsFilter />
      {/* <TeamsDetail /> */}
    </div>
  )
}

export default App
