import { useState } from 'react';
import Modal from '../ui/Modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CrewRoleModal({ open, onClose }: Props) {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Owner', permissions: ['manage_member', 'create_notice'] },
  ]);
  const [newRoleName, setNewRoleName] = useState('');

  const addRole = () => {
    if (!newRoleName.trim()) return;
    setRoles([...roles, { id: Date.now(), name: newRoleName, permissions: [] }]);
    setNewRoleName('');
  };

  const updateRoleName = (id: number, name: string) => {
    setRoles(roles.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const removeRole = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const addPermission = (id: number, perm: string) => {
    if (!perm.trim()) return;
    setRoles(
      roles.map((r) =>
        r.id === id && !r.permissions.includes(perm)
          ? { ...r, permissions: [...r.permissions, perm] }
          : r,
      ),
    );
  };

  const removePermission = (id: number, perm: string) => {
    setRoles(
      roles.map((r) =>
        r.id === id
          ? { ...r, permissions: r.permissions.filter((p) => p !== perm) }
          : r,
      ),
    );
  };

  return (
    <Modal open={open} onClose={onClose} className="max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Manage Roles & Permissions</h2>
        {roles.map((role) => (
          <div key={role.id} className="rounded border p-2 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={role.name}
                onChange={(e) => updateRoleName(role.id, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeRole(role.id)}
              >
                Remove
              </Button>
            </div>
            <ul className="space-y-1 pl-4">
              {role.permissions.map((perm) => (
                <li key={perm} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{perm}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePermission(role.id, perm)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
            <PermissionInput onAdd={(perm) => addPermission(role.id, perm)} />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Input
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <Button variant="outline" onClick={addRole}>
            Add Role
          </Button>
        </div>
        <div className="text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

function PermissionInput({ onAdd }: { onAdd: (perm: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Add permission"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onAdd(value);
          setValue('');
        }}
      >
        Add
      </Button>
    </div>
  );
}
