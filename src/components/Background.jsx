import { Card } from "@nextui-org/react";
import React from "react";

// Dados dos gradientes
const gradientBlobs = [
  {
    position: { top: "36px", left: "0" },
    rotation: "76.66deg",
    blur: "400px",
  },
  {
    position: { top: "140px", left: "1004px" },
    wrapperRotation: "119.36deg",
    rotation: "-283.34deg",
    blur: "157.47px",
  },
];

// Componente para gradientes
const GradientBlob = ({ position, wrapperRotation = "", rotation, blur }) => (
  <div
    style={{
      position: "absolute",
      width: "598px",
      height: "473px",
      top: position.top,
      left: position.left,
      transform: `rotate(${wrapperRotation})`,
    }}
  >
    <div style={{ height: "473px" }}>
      <div
        style={{
          position: "relative",
          width: "361px",
          height: "529px",
          top: "-28px",
          left: "119px",
          borderRadius: "180.32px / 264.61px",
          transform: `rotate(${rotation})`,
          filter: `blur(${blur})`,
          background: "linear-gradient(to bottom, #2384A1, #057EFF, #5100FF)",
        }}
      />
    </div>
  </div>
);

// Componente principal
export default function Background() {
  return (
    <Card
      style={{
        zIndex: "10",
        position: "absolute",
        width: "1656px",
        height: "753px",
        border: "none",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          position: "fixed",
          width: "1656px",
          height: "753px",
          top: "0",
          left: "0",
        }}
      >
        {gradientBlobs.map((blob, index) => (
          <GradientBlob key={index} {...blob} />
        ))}
      </div>
    </Card>
  );
}