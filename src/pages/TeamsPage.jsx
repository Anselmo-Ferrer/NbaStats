import Background from "../background";
import NavbarComponent from "../navbar";
import TeamsDetail from "../times";

export default function TeamsPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <TeamsDetail />
    </div>
  )
}