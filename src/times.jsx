import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TeamsDetail = () => {
  const { id: paramId, selectedTeam: paramSelectedTeam } = useParams();
  const [teams, setTeams] = useState([]);
  const [id, setId] = useState(paramId || 802); // Default to 802 if paramId is undefined
  const [selectedTeam, setSelectedTeam] = useState(paramSelectedTeam || 1); // Default to 1 if paramSelectedTeam is undefined
  const [totalWins, setTotalWins] = useState(0); // Estado para armazenar o total de vitórias

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '89e8d18db2msh750cb1be8006c38p19c402jsne47214e05847',
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
          },
        };
        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data.response); // Verificar a estrutura do dado

        if (data.response && data.response.length > 0) {
          // Ordena os times por número de vitórias, em ordem decrescente
          const sortedTeams = data.response.sort((a, b) => {
            const winsA = a.win?.total || 0;
            const winsB = b.win?.total || 0;
            return winsB - winsA;
          });

          setTeams(sortedTeams);

          // Calcula o total de vitórias
          const total = sortedTeams.reduce((sum, team) => sum + (team.win?.total || 0), 0);
          setTotalWins(total);
        } else {
          console.error('No data found');
          setTeams([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTeams();
  }, [id, selectedTeam]);

  if (!teams || teams.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Total Wins: {totalWins}</h1> {/* Exibe o total de vitórias */}
      {teams.map((team, index) => {
        const wins = team.win?.total || 'N/A';
        const losses = team.loss?.total || 'N/A';

        return (
          <div key={index} className="team-box">
            <h2>{`#${index + 1} - ${team.team?.name || 'N/A'}`}</h2>
            <p>{`Conference: ${team.conference?.name || 'N/A'}`}</p>
            <p>{`Wins: ${wins}`}</p>
            <p>{`Losses: ${losses}`}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TeamsDetail;