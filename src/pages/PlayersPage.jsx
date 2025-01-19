import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import PlayerStatsFilter from "../Players";

export default function PlayersPage() {
  return (
    <div className="bg-black flex h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <PlayerStatsFilter />
    </div>
  )
}