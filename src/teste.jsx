import { Card, CardBody } from "@nextui-org/react";
import { Bell, Star } from "lucide-react";
import React from "react";

// Data for the matches indicators
const matchesData = Array(10).fill("success");

// Column headers data
const columns = [
  { label: "Name", width: "57px" },
  { label: "Criterios", width: "71px" },
  { label: "Max Matches", width: "127px" },
  { label: "Last Matches", width: "129px" },
];

const Box = () => {
  return (
    <div style={{ width: "1093px" }}>
      <Card
        style={{
          backgroundColor: "rgba(27, 27, 27, 0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: "12px",
        }}
      >
        <CardBody style={{ padding: "32px" }}>
          {/* Column Headers */}
          <div style={{ display: "flex", gap: "128px", marginBottom: "20px" }}>
            {columns.map((column, index) => (
              <div
                key={index}
                style={{
                  width: column.width,
                  color: "#868686",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {column.label}
              </div>
            ))}
          </div>

          {/* Content Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Player Info */}
            <div style={{ flex: 1 }}>
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                Klay Thompson
              </div>
              <div
                style={{
                  color: "#868686",
                  fontSize: "0.6875rem",
                  fontWeight: "500",
                }}
              >
                Dallas Mavericks
              </div>
            </div>

            {/* Stats */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                22/31
              </div>
              <div
                style={{
                  color: "#868686",
                  fontSize: "0.6875rem",
                  fontWeight: "500",
                }}
              >
                80%
              </div>
            </div>

            {/* Match Count */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <span style={{ color: "white", fontWeight: "600", fontSize: "1rem" }}>
                1
              </span>
            </div>

            {/* Match Indicators */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                justifyContent: "center",
                flex: 1,
              }}
            >
              {matchesData.map((status, index) => (
                <div
                  key={index}
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: "rgb(34, 197, 94)", // Green color
                  }}
                />
              ))}
            </div>

            {/* Notification Icon */}
            <div>
              <Star size={25} color="white" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Box;