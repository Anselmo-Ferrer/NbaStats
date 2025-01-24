import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import Tips from "../tips";

export default function SearchTipsPage() {
  return (
    <div className="bg-black flex h-full w-full">
    <Background />
    <NavbarComponent />
    <Tips />
  </div>
  )
}