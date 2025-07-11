export type PostType = string;
export type SearchPostType = string;
import { SimpleUserDto } from "./userDto";

export interface PostDto {
  id: string | number;
  title: string;
  content?: any;
  hashtags?: string[];
  author?: any;
  createdAt?: string;
  crewName?: string;
  likes?: number;
  comments?: number;
  image?: string;
  date?: string;
  views?: number;
  tags?: string[];
  crew?: any;
  brand?: any;
  likeCount?: number;
  commentCount?: number;
  type?: string;
  brandMetaType?: string;
  crewMetaType?: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface PostDetailCommentDto {
  id: string;
  author: SimpleUserDto;
  createdAt: string;
  content: string;
}

export interface CreatePostDto {
  title: string;
  type: string;
  hashtags?: string[];
  crewIds?: number[];
  brandIds?: number[];
  content?: any;
  brandMetaType?: string;
  crewMetaType?: string;
}
