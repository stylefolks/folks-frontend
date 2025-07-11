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
