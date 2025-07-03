import React from "react";
import { Home, Search, PenLine, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function FloatingMenu() {
  const items = [
    { href: "/", icon: <Home size={20} />, label: "홈" },
    { href: "/search", icon: <Search size={20} />, label: "검색" },
    { href: "/write", icon: <PenLine size={20} />, label: "글쓰기" },
    { href: "/notifications", icon: <Bell size={20} />, label: "알림" },
    { href: "/profile", icon: <User size={20} />, label: "마이" },
  ];
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-10">
      <ul className="mx-auto flex h-[64px] w-[85%] items-center justify-around rounded-full bg-white/30 p-2 backdrop-blur-md shadow-md">
        {items.map((item, idx) => (
          <li key={item.href} className={idx === 2 ? 'translate-y-[-12px]' : ''}>
            <Link
              to={item.href}
              aria-label={item.label}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full"
            >
              {item.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
