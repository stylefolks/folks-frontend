import Avatar from '../ui/avatar';
import Modal from '../ui/Modal';
import { Button } from '../ui/button';
import type { SimpleUser } from '@/lib/profile';

interface Props {
  open: boolean;
  onClose: () => void;
  users: SimpleUser[];
  type: 'followers' | 'following';
  isMaster?: boolean;
  onDelete: (id: string) => void;
  onBlock: (id: string) => void;
}

export default function FollowListModal({
  open,
  onClose,
  users,
  type,
  isMaster = false,
  onDelete,
  onBlock,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} className="max-h-[80vh] overflow-y-auto">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold capitalize">{type}</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.userId} className="flex items-center gap-2">
              <Avatar src={u.imageUrl} size="sm" />
              <span className="flex-1 text-sm">{u.username}</span>
              {isMaster && (
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onDelete(u.userId)}>
                    Delete
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onBlock(u.userId)}>
                    Block
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
