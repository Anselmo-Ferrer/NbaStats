import Background from "../background";
import PlayerStatsFilter from "../jogadores";
import NavbarComponent from "../navbar";

export default function PlayersPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <PlayerStatsFilter />
    </div>
  )
}