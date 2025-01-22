import Bet from "../Bet";
import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";

export default function BetPage() {
  return (
    <div className="bg-black flex h-full w-full">
      <Background />
      <NavbarComponent active="Favorites"/>
      <Bet />
    </div>
  )
}