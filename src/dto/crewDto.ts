export enum CrewRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export type CrewMetaType = string;

export interface CrewLinkDto {
  title: string;
  url: string;
}

export interface CrewSummaryDto {
  id: string;
  name: string;
  coverImage: string;
  tags: string[];
  memberCount: number;
  upcomingEvent?: { title: string; date: string };
}

// ...기존 CrewDto, CrewEventDto, CrewNoticeDto, CrewTopicDto, CrewTabDto, CrewMemberDto 유지...
export interface CrewDto {
  id: string;
  name: string;
  avatarUrl?: string;
  profileImage?: string;
  coverImage?: string;
  memberCount?: number;
  description?: string;
  tags?: string[];
  links?: Array<{ title: string; url: string }>;
  ownerId?: string;
  followers?: any[];
  members?: any[];
  upcomingEvent?: { title: string; date: string };
}

export interface CrewEventDto {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  likeCount: number;
  commentCount: number;
}

export interface CrewNoticeDto {
  id: string;
  title: string;
  content: string;
  date: string;
  location: string;
  image: string;
  likeCount: number;
  commentCount: number;
}

export interface CrewTopicDto {
  tag: string;
  count: number;
}

export interface CrewTabDto {
  id: number;
  crewId: number;
  title: string;
  type: string;
  isVisible: boolean;
  order: number;
  hashtags?: string[];
}

export interface CrewMemberDto {
  userId: string;
  nickname: string;
  role: string;
}
