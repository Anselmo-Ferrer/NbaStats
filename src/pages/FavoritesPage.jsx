import Background from "../background";
import Favorites from "../favorites";
import NavbarComponent from "../navbar";

export default function FavoritesPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <Favorites />
    </div>
  )
}