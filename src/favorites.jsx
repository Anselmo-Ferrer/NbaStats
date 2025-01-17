import { Star } from "lucide-react";

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

  return (
    <div className="h-full pb-10">

      {Array.from({ length: 6 }).map((_, index) => (
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
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>teste</div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500" }}>teste</div>
            </div>

            {/* Points */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>20</span>
            </div>

            {/* Assists */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>10</span>
            </div>

            {/* Rebounds */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>5</span>
            </div>

            {/* Criteria */}
            <div className="grid justify-items-center">
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>19/30</div>
              <div style={{ color: "#868686", fontSize: "0.6875rem", fontWeight: "500" }}>63%</div>
            </div>

            {/* Max Match Count */}
            <div className="grid justify-items-center">
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>3</span>
            </div>

            {/* Last Matches Indicators */}
            <div className="col-span-2 grid justify-items-center grid-flow-col">teste</div>

            {/* Favorite Icon */}
            <div className="justify-items-end mr-12">
              <Star size={25} color="white" />
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}