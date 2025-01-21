import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import Favorites from "../favorites";

export default function FavoritesPage() {
  return (
    <div className="bg-black flex h-full w-full">
      <Background />
      <NavbarComponent />
      <Favorites />
    </div>
  )
}