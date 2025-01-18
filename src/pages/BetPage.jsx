import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import PlayerStatsFilterTest from "../teste";

export default function BetPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <PlayerStatsFilterTest />
    </div>
  )
}