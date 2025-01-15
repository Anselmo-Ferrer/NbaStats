import Background from "../background";
import NavbarComponent from "../navbar";
import PlayerStatsFilterTest from "../teste";

export default function BetPage() {
  return (
    <div className="bg-black h-full w-full px-10 pt-4">
      <Background />
      <NavbarComponent />
      <PlayerStatsFilterTest />
    </div>
  )
}

const generateCriteriaCombinations = () => {
  const combinations = [];
  for (let points = 1; points <= 50; points += 1) {
    for (let assists = 1; assists <= 30; assists += 1) {
      for (let rebounds = 1; rebounds <= 30; rebounds += 1) {
        combinations.push({ points, assists, rebounds });
      }
    }
  }
  console.log(combinations)
  return combinations;
};

const Allplayers = {
  "Nikola Jokic": [
    {team: "Denver Nuggets", totalGames: 31, criteriaMet: 20, maxGamesWithoutCriteria: 3, currentGamesWithoutCriteria: 0, last10Games: [], pontos: 30, assistencias: 10, rebotes: 10, },
    {team: "Denver Nuggets", totalGames: 31, criteriaMet: 20, maxGamesWithoutCriteria: 3, currentGamesWithoutCriteria: 0, last10Games: [], pontos: 31, assistencias: 10, rebotes: 10, },
  ],
  "Trae Young": [
    {team: "Atlanta Hawks", totalGames: 31, criteriaMet: 20, maxGamesWithoutCriteria: 3, currentGamesWithoutCriteria: 0, last10Games: [], pontos: 30, assistencias: 10, rebotes: 10, },
    {team: "Atlanta Hawks", totalGames: 31, criteriaMet: 20, maxGamesWithoutCriteria: 3, currentGamesWithoutCriteria: 0, last10Games: [], pontos: 31, assistencias: 10, rebotes: 10, },
  ],
};