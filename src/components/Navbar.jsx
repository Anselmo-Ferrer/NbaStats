export default function NavbarComponent() {
  return (
    <div className="bg-stone-800 p-4 flex gap-20 justify-center" style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px"}}>
      <a href="/">Jogadores</a>
      <a href="/teams">Time</a>
      <a href="/bet">Apostas</a>
      <a href="/standings">Classificacao</a>
      <a href="/favorites">Favoritos</a>
    </div>
  )
  
}