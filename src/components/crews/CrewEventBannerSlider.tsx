import CrewCard from './CrewCard';
import type { CrewSummary } from '@/lib/crew';

export default function CrewEventBannerSlider({ crews }: { crews: CrewSummary[] }) {
  if (crews.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {crews.map((crew) => (
          <div key={crew.id} className="min-w-[200px] flex-shrink-0">
            <CrewCard crew={crew} />
            {crew.upcomingEvent && (
              <p className="mt-1 text-xs text-gray-500">
                {crew.upcomingEvent.title} - {crew.upcomingEvent.date}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
