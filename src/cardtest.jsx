import { Card } from "@nextui-org/card";
import { Wallet } from "lucide-react";
import React from "react";

export default function CardTest({label, value}) {
  return (
    <Card className="w-fit px-4 py-2" style={{backgroundColor: "rgba(27, 27, 27, 0.6)", backdropFilter: "blur(20px)", borderRadius: "12px"}}>
      <div className="flex items-center gap-2 p-1">
        <div className="flex items-center justify-center w-[60px] h-[60px] bg-white/10 rounded-[13.75px]">
          <Wallet className="w-8 h-8 text-white" />
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-sm text-white">
            {label}
          </span>
          <span className="font-bold text-2xl text-white">
            {value}
          </span>
        </div>
      </div>
    </Card>
  );
}
