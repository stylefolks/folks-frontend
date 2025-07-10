import { BRAND_META_TYPES } from "@/constants/brand";

export type BrandMetaType = (typeof BRAND_META_TYPES)[number];

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  links: { title: string; url: string }[];
}

export interface BrandSummary {
  id: string;
  name: string;
  logo: string;
  description: string;
  tags?: string[];
  crews?: { id: string; name: string; image: string }[];
  upcomingEvent?: { title: string; date: string };
}
