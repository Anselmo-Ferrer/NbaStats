import {
  ArrowRightLeft,
  LogOut,
  PersonStanding,
  Settings,
  Star,
  User,
  User2,
  Wallet,
} from "lucide-react";
import React from "react";

export default function Box() {
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
    <aside className="w-1/5 h-screen flex flex-col p-8 z-30">
      <div className="w-full flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <li key={index} className="list-none">
            <a
              href={item.href}
              className={`flex items-center gap-[19px] px-6 py-4 rounded-2xl transition-colors ${
                item.active
                  ? "bg-gradient-to-b from-[#F7931A] via-[#8C5717] to-[#593407] text-white"
                  : "text-grey hover:bg-accent"
              }`}
            >
              {item.icon}
              <span className="font-medium text-lg">{item.label}</span>
            </a>
          </li>
        ))}
      </div>

    </aside>
  );
}