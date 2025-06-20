import Link from 'next/link';

interface CrewInfo {
  id: number;
  name: string;
  avatar: string;
}

export interface BrandCardProps {
  id: number;
  name: string;
  logo: string;
  description: string;
  crew: CrewInfo[];
}

export default function BrandCard({
  name,
  logo,
  description,
  crew,
}: BrandCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center gap-3">
        <img src={logo} alt={name} className="h-12 w-12 rounded-full object-cover" />
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      {crew.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          {crew.map((c) => (
            <Link key={c.id} href={`/crews/${c.id}`}> 
              <img
                src={c.avatar}
                alt={c.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
