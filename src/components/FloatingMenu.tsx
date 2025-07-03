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
    <nav className="fixed bottom-0 inset-x-0 z-10 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto mb-2 flex max-w-md items-center justify-around rounded-2xl bg-background/60 backdrop-blur p-2 shadow">
        {items.map((item) => (
          <li key={item.href}>
            <Link to={item.href} aria-label={item.label} className="p-2">{item.icon}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
