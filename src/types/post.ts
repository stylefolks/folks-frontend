import { SimpleUser } from "./user";
import { CrewMetaType } from "./crew";
import { BrandMetaType } from "./brand";
import { POST_TYPES, SEARCH_POST_TYPES } from "@/constants/post";

export interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  views: number;
  author: SimpleUser;
  tags?: string[];
  crew?: { id: string; name: string };
  brand?: { id: string; name: string };
  content: any; // ProseMirror JSON
  type: PostType;
  brandMetaType?: BrandMetaType;
  crewMetaType?: CrewMetaType;
  likeCount?: number; // optional like count
  commentCount?: number; // optional comment count
  isSponsored?: boolean; // optional sponsored flag
  isPromoted?: boolean; // optional promoted flag
  isDraft?: boolean; // optional draft flag
}

export type PostType = (typeof POST_TYPES)[number];
export type SearchPostType = (typeof SEARCH_POST_TYPES)[number];

export interface PostDetail {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  author: { userId: string; name: string; initials: string };
  createdAt: string;
  crewName: string;
  likes: number;
  comments: number;
}

export interface PostComment {
  id: string;
  author: { userId: string; name: string; initials: string };
  createdAt: string;
  content: string;
}

export interface PostSummary {
  id: number;
  title: string;
  imageUrl?: string;
  category: string;
}
