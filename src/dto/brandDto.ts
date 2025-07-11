export type BrandMetaType = string;
export interface BrandDto {
  id: string;
  name: string;
  logo: string;
  description: string;
  tags: string[];
  crews: Array<{ id: string; name: string; image: string }>;
  upcomingEvent?: { title: string; date: string };
  links?: Array<{ title: string; url: string }>;
}
