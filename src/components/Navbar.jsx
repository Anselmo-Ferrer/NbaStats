import {
  User,
  User2,
  Wallet,
  PersonStanding,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

export default function Box() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      icon: <User className="w-6 h-6" />,
      label: "Players",
      active: true,
      href: "/",
    },
    { icon: <User2 className="w-6 h-6" />, label: "Teams", href: "/teams" },
    { icon: <Wallet className="w-6 h-6" />, label: "Bets", href: "/bet" },
    {
      icon: <PersonStanding className="w-6 h-6" />,
      label: "Standings",
      href: "/standings",
    },
    { icon: <Star className="w-6 h-6" />, label: "Favorites", href: "/favorites" },
  ];

  return (
    <aside
      className={`h-screen flex flex-col p-4 z-30 transition-all ${
        isOpen ? "w-1/6" : "w-[80px]"
      }`}
      style={{
        backgroundColor: "rgba(27, 27, 27, 0.6)",
        backdropFilter: "blur(20px)",
        borderRadius: "12px",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "self-end" : "self-center"} mb-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-all duration-600`}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Menu Items */}
      <div className="flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <li key={index} className="list-none">
            <a
              href={item.href}
              className={`flex items-center ${
                isOpen ? "gap-4" : "justify-center"
              } px-4 py-3 rounded-2xl transition-colors ${
                item.active
                  ? "bg-gradient-to-b from-[#2384A1] via-[#057EFF] to-[#5100FF] text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {item.icon}
              {isOpen && <span className="font-medium text-lg">{item.label}</span>}
            </a>
          </li>
        ))}
      </div>
    </aside>
  );
}