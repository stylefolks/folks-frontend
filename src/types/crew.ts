import { CREW_META_TYPES } from "@/constants/crew";
import { SimpleUser } from "@/lib/profile";

export interface CrewLink {
  title: string;
  url: string;
}

export interface CrewEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  commentCount?: number;
  likeCount?: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  location?: string;
  image?: string;
  commentCount?: number;
  likeCount?: number;
}

export interface CrewTopic {
  tag: string;
  count: number;
}

export interface CrewTab {
  id: number;
  crewId: number;
  title: string;
  type: CrewMetaType;
  isVisible: boolean;
  order: number;
  hashtags?: string[];
}

export interface Crew {
  id: string;
  name: string;
  profileImage?: string;
  coverImage: string;
  description: string;
  links: CrewLink[];
  ownerId: string;
  members?: SimpleUser[];
  tags?: string[];
}

export interface CrewSummary {
  id: string;
  name: string;
  coverImage: string;
  tags: string[];
  memberCount: number;
  upcomingEvent?: {
    title: string;
    date: string;
  };
}

export interface CrewMember {
  userId: string;
  nickname: string;
  role: CrewRole;
}

export enum CrewRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export type CrewMetaType = (typeof CREW_META_TYPES)[number];
