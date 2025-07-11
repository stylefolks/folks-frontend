import { http, HttpResponse } from "msw";
import { BrandDto } from "@/dto/brandDto";
import { TAGS } from "../tags";

function randomBrand(id: number): BrandDto {
  const seed = Math.random().toString(36).slice(2, 8);
  const brandTags = [TAGS[id % TAGS.length], TAGS[(id + 1) % TAGS.length]];
  const hasEvent = id % 2 === 0;
  const event = hasEvent
    ? { title: `Event ${id}`, date: new Date().toISOString().slice(0, 10) }
    : undefined;
  const crews = Array.from({ length: 2 }, (_, i) => ({
    id: `crew${id}-${i}`,
    name: `Crew ${id}-${i}`,
    image: `https://picsum.photos/seed/crew-${seed}-${i}/40/40`,
  }));
  return {
    id: `${id}`,
    name: `Brand ${id}`,
    logo: `https://picsum.photos/seed/brand-${seed}/200/200`,
    description: `This is brand ${id}.`,
    tags: brandTags,
    crews,
    upcomingEvent: event,
  };
}

const PUBLIC_API_URL =
  typeof window === "undefined"
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
const API_BASE = PUBLIC_API_URL ?? "http://localhost:3000";

export const brandHandlers = [
  http.get(`${API_BASE}/brands`, ({ request }) => {
    const url = new URL(request.url);
    const hasEvent = url.searchParams.get("hasUpcomingEvent");
    const tag = url.searchParams.get("tag");
    const sort = url.searchParams.get("sort");
    let brands = Array.from({ length: 6 }, (_, i) => randomBrand(i + 1));
    if (hasEvent) {
      brands = brands.filter((b) => b.upcomingEvent);
    }
    if (tag) {
      brands = brands.filter((b) => b.tags.includes(tag));
    }
    if (sort === "popular") {
      brands = brands.sort((a, b) => b.crews.length - a.crews.length);
    }
    return HttpResponse.json(brands);
  }),
  http.get(`${API_BASE}/brands/:id`, ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({
      id,
      name: `Brand ${id}`,
      logo: `https://picsum.photos/seed/brand-${id}/200/200`,
      description: `This is brand ${id}.`,
      links: [{ title: "Website", url: "https://example.com" }],
    });
  }),
  http.get(`${API_BASE}/brands/:id/posts`, ({ params }) => {
    const { id } = params as { id: string };
    // randomPost 함수는 post.ts로 분리 필요
    return HttpResponse.json([]);
  }),
];
