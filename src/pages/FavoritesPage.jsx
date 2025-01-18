import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import Favorites from "../favorites";

export default function FavoritesPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <Favorites />
    </div>
  )
}