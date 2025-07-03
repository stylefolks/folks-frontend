import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
}

export default function TopAppBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur sticky top-0 z-10">
      <Link to="/" className="font-bold text-lg">
        Folks
      </Link>
      {user ? (
        <div className="flex items-center gap-2">
          <Avatar src={user.avatarUrl} size="sm" />
          <button aria-label="menu">
            <Menu size={20} />
          </button>
        </div>
      ) : (
        <Button asChild size="sm" variant="outline">
          <Link to="/login">로그인</Link>
        </Button>
      )}
    </header>
  );
}
