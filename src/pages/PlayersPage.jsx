import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import PlayerStatsFilter from "../Players";

export default function PlayersPage() {
  return (
    <div className="bg-black flex h-full w-full">
      <Background />
      <NavbarComponent />
      <PlayerStatsFilter />
    </div>
  )
}