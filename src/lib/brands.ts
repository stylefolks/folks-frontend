export interface CrewInfo {
  id: number;
  name: string;
  avatar: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  tags: string[];
  crew: CrewInfo[];
  upcomingEvent?: {
    name: string;
    date: string;
  };
}

// Sample brand data used for mocking APIs
export const brands: Brand[] = [
  {
    id: 1,
    name: "CLUB MIST",
    logo: "https://picsum.photos/seed/brand1/100/100",
    description: "Seoul based streetwear collective.",
    tags: ["스트릿", "서울팝업"],
    crew: [
      {
        id: 1,
        name: "BTBF",
        avatar: "https://picsum.photos/seed/crew1/40/40",
      },
    ],
    upcomingEvent: {
      name: "CLUB MIST X BTBF 팝업 @성수",
      date: "2025-07-19",
    },
  },
  {
    id: 2,
    name: "Hidden Gem",
    logo: "https://picsum.photos/seed/brand2/100/100",
    description: "Curated designer archive store.",
    tags: ["디자이너", "빈티지"],
    crew: [],
  },
  {
    id: 3,
    name: "Vintage Mood",
    logo: "https://picsum.photos/seed/brand3/100/100",
    description: "80-90s vintage specialist.",
    tags: ["빈티지"],
    crew: [
      {
        id: 2,
        name: "Retro Crew",
        avatar: "https://picsum.photos/seed/crew2/40/40",
      },
    ],
    upcomingEvent: {
      name: "Vintage Market @을지로",
      date: "2025-07-21",
    },
  },
  {
    id: 4,
    name: "Seoul Popup",
    logo: "https://picsum.photos/seed/brand4/100/100",
    description: "Pop-up event agency.",
    tags: ["서울팝업"],
    crew: [],
  },
  {
    id: 5,
    name: "Street Kings",
    logo: "https://picsum.photos/seed/brand5/100/100",
    description: "Bold street fashion label.",
    tags: ["스트릿"],
    crew: [
      {
        id: 3,
        name: "Sk8 Crew",
        avatar: "https://picsum.photos/seed/crew3/40/40",
      },
    ],
  },
];

export interface BrandPost {
  id: number;
  title: string;
  image: string;
  date: string;
}

export const brandPosts: BrandPost[] = Array.from({ length: 8 }, (_, i) => ({
  id: 100 + i,
  title: `Brand Post ${i + 1}`,
  image: `https://picsum.photos/seed/brandpost${i}/400/300`,
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));
