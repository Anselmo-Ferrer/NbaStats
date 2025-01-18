import Background from "../components/Background";
import NavbarComponent from "../components/Navbar";
import TeamsDetail from "../Teams";

export default function TeamsPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <TeamsDetail />
    </div>
  )
}