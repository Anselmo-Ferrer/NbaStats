import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import PlayerStatsFilterTest from "../teste";

export default function BetPage() {
  return (
    <div className="bg-black flex h-full w-full">
      <Background />
      <NavbarComponent active="Favorites"/>
      <PlayerStatsFilterTest />
    </div>
  )
}