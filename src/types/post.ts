import { SimpleUser } from "./user";

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
  type: "BASIC" | "COLUMN"; // assuming these are the only types
  brandMetaType?: "POSTS" | "EVENT" | "NOTICE"; // optional meta type
  crewMetaType?: "TOPIC" | "OVERVIEW" | "POSTS" | "EVENT" | "NOTICE"; // optional meta type
  likeCount?: number; // optional like count
  commentCount?: number; // optional comment count
}
