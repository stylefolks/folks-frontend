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
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-2">
      <span className="text-xl font-bold">Folks</span>
      {user ? (
        <div className="flex items-center gap-2">
          <Avatar src={user.avatarUrl} className="h-9 w-9" />
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
