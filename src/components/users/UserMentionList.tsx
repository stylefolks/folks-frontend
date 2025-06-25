import { useEffect, useState } from 'react';
import { searchUsers } from '@/lib/user';
import type { SimpleUser } from '@/lib/profile';

interface Props {
  query: string;
  position: { left: number; top: number } | null;
  onSelect: (user: SimpleUser) => void;
}

export default function UserMentionList({ query, position, onSelect }: Props) {
  const [users, setUsers] = useState<SimpleUser[]>([]);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }
    searchUsers({ search: query, limit: '10' })
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [query]);

  if (!position || users.length === 0) return null;

  return (
    <ul
      className="absolute z-50 max-h-60 w-40 overflow-auto rounded border bg-white shadow"
      style={{ left: position.left, top: position.top }}
    >
      {users.map((user) => (
        <li
          key={user.userId}
          className="cursor-pointer px-2 py-1 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
        >
          {user.username}
        </li>
      ))}
    </ul>
  );
}
