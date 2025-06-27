import { useState } from 'react';
import Modal from '../ui/Modal';
import EditableImageUpload from '../EditableImageUpload';
import EditableLinkList from '../EditableLinkList';
import { Button } from '../ui/button';
import type { Crew, CrewLink } from '@/lib/crew';

interface CrewSettingsModalProps {
  open: boolean;
  crew: Crew;
  onClose: () => void;
  onSave: (data: Partial<Crew>) => void;
  onDelete: () => void;
}

/**
 * @description Crew settings modal for editing crew profile and links.
 */
export default function CrewSettingsModal({ open, crew, onClose, onSave, onDelete }: CrewSettingsModalProps) {
  const [profileImage, setProfileImage] = useState(crew.profileImage || '');
  const [coverImage, setCoverImage] = useState(crew.coverImage);
  const [links, setLinks] = useState<CrewLink[]>(crew.links);

  const handleSave = () => {
    onSave({ profileImage, coverImage, links });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Crew Settings</h2>
        <div className="space-y-2">
          <EditableImageUpload
            src={profileImage}
            onChange={(file) => setProfileImage(URL.createObjectURL(file))}
            isEditable
            className="h-24 w-24 rounded-full mx-auto"
          />
          <EditableImageUpload
            src={coverImage}
            onChange={(file) => setCoverImage(URL.createObjectURL(file))}
            isEditable
            className="h-32 w-full rounded"
          />
          <EditableLinkList links={links} onChange={setLinks} isEditable />
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="text-red-600"
            onClick={() => {
              if (window.confirm('Delete this crew?')) onDelete();
            }}
          >
            Delete Crew
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
