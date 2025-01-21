import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import Standings from "../Standings";

export default function StandingsPage() {
  return(
    <div className="bg-black flex h-full w-full">
      <Background />
      <NavbarComponent />
      <Standings />
    </div>
  )
}