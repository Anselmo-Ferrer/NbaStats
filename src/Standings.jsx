import { ScrollShadow } from '@nextui-org/react';
import { Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Standings() {
  const { id: paramId, selectedTeam: paramSelectedTeam } = useParams();
  const [teams, setTeams] = useState([]);
  const [id, setId] = useState(paramId || 802); // Default to 802 if paramId is undefined
  const [selectedTeam, setSelectedTeam] = useState(paramSelectedTeam || 1); // Default to 1 if paramSelectedTeam is undefined

  const columns = [
    { label: "Position", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
    { label: "Teams", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Conference", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Wins", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Loses", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Last Matches", justifyItems: "justify-items-center", columnSpan: "col-span-2" },
  ];

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_API_KEY_14,
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
    <ScrollShadow className="w-[100%] h-screen overflow-auto p-10 z-30  " >
      <div className="flex flex-col" style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "32px"}}>
        {teams.length > 0 ? (
          <div>

            <div style={{ marginBottom: "20px" }} className="grid grid-cols-7">
              {columns.map((column, index) => (
                <div
                  className={`grid ${column.columnSpan} ${column.justifyItems}`}
                  key={index}
                  style={{
                    color: "#868686",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {column.label}
                </div>
              ))}
            </div>


          {teams.map((team, index) => (
            <div className='mb-4' key={index}>
            {/* Column Headers */}


          {/* Content Row */}
          <div style={{ alignItems: "center", justifyContent: "space-between",}} className="grid grid-cols-7">
            {/* Player Info */}
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {index + 1}
              </div>
            </div>

            {/* Stats */}
            <div className="grid justify-items-start grid-flow-col" style={{ color: "white", fontWeight: "600", fontSize: "0.7rem" }}>
              <img src={team.team?.logo} className='w-[25px] h-[25px]'/>
              <span>{team.team?.name}</span>
            </div>

            {/* Match Count */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {team.conference?.name}
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                {team.win?.total}
              </span>
            </div>

            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
              {team.loss?.total}
              </span>
            </div>

            {/* Match Indicators */}
            <div className="col-span-2 grid justify-items-center grid-flow-col">
              abcdef
            </div>

          </div>



              
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full h-[300px] flex justify-center items-center'>
            <p className='text-4xl'>Busque por criterios.</p>
          </div>
        )}
      </div>
      </ScrollShadow>
  );
};
