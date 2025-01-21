import { Button } from "@nextui-org/react";
import { Star } from "lucide-react";
import React, { useEffect, useState } from 'react';
import LZString from 'lz-string';
import { StarFilledIcon } from '@radix-ui/react-icons';

export default function Favorites() {
  const columns = [
    { label: "Name", justifyItems: "justify-items-start", columnSpan: "col-span-1" },
    { label: "Points", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Assists", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Rebounds", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Criterios", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Max Matches", justifyItems: "justify-items-center", columnSpan: "col-span-1" },
    { label: "Last Matches", justifyItems: "justify-items-center", columnSpan: "col-span-2" },
  ];

  const [favorites, setfavorites] = useState([])

  const carregarDados = () => {
    const compressedData = localStorage.getItem('FavoritesData');
    const rawData = JSON.parse(LZString.decompress(compressedData));

    setfavorites(rawData)
  }
  
  useEffect(() => {
    carregarDados()
  }, [])

  const removeFavorites = (index) => {
    const updatedFavorites = [...favorites]; // Cria uma cópia do estado atual
    updatedFavorites.splice(index, 1); // Remove o jogador na posição especificada
  
    setfavorites(updatedFavorites); // Atualiza o estado
  
    // // Atualiza os dados no localStorage
    const compressedData = LZString.compress(JSON.stringify(updatedFavorites));
    localStorage.setItem("FavoritesData", compressedData);
  };

  const renderGameResult = (result) => {
    const color = result === "V" ? "rgb(34, 197, 94)" : "#C62D2D";
    return (
      <span 
        className='rounded-full mr-2 flex items-center justify-center'
        style={{ width: "25px", height: "25px", borderRadius: "50%",backgroundColor: color}}
      >
      </span>
    );
  };

  const carregar = () => {
    const compressedData = localStorage.getItem('FavoritesData');
    const rawData = JSON.parse(LZString.decompress(compressedData));

    console.log(rawData)
  }


  return (
    <div className="h-full w-full pb-10 z-30 p-10">

      {favorites && favorites.length > 0 ? (
        favorites.map((player, index) => (
        <div key={index} className="mb-4 mt-4" style={{ backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px", padding: "32px" }}>
          {/* columns */}
          <div style={{ marginBottom: "20px" }} className="grid grid-cols-9">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`grid ${column.columnSpan} ${column.justifyItems}`}
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

          {/* rows */}
          <div style={{ alignItems: "center", justifyContent: "space-between" }} className="grid grid-cols-9">
            {/* Player Info */}
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.name}</div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500" }}>{player.team}</div>
            </div>

            {/* Points */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.filterPoints}</span>
            </div>

            {/* Assists */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.filterAssists}</span>
            </div>

            {/* Rebounds */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.filterRebounds}</span>
            </div>

            {/* Criteria */}
            <div className="grid justify-items-center">
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.criteriaMet}/{player.totalGames}</div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500" }}>{player.percentage}%</div>
            </div>

            {/* Max Match Count */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>{player.maxGamesWithoutCriteria}</span>
            </div>

            {/* Last Matches Indicators */}
            <div className="col-span-2 grid justify-items-center grid-flow-col">{player.last10Games.map(renderGameResult).slice(-10).reverse()}</div>

            {/* Favorite Icon */}
            <div className="justify-items-end mr-12">
              <button className='flex justify-center items-center' onClick={() => removeFavorites(index)}><StarFilledIcon className='w-[25px] h-[25px]' color="white" /></button>
            </div>
          </div>
        </div>
      ))
    ) : (
        <p style={{ color: "white" }}>Nenhum favorito encontrado.</p>
    )}

    </div>
  );
}