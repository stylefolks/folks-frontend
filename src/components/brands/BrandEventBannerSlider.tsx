'use client';

import { useEffect, useState } from 'react';

interface EventBrand {
  id: number;
  name: string;
  logo: string;
  upcomingEvent: { name: string; date: string };
}

export default function BrandEventBannerSlider() {
  const [brands, setBrands] = useState<EventBrand[]>([]);

  useEffect(() => {
    fetch('/brands?hasUpcomingEvent=true')
      .then((res) => res.json())
      .then(setBrands);
  }, []);

  if (!brands.length) return null;

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {brands.map((b) => (
        <div
          key={b.id}
          className="flex min-w-[220px] items-center gap-3 rounded-lg border p-3"
        >
          <img
            src={b.logo}
            alt={b.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{b.upcomingEvent.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(b.upcomingEvent.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
