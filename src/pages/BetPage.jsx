import Background from "../background";
import NavbarComponent from "../navbar";
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