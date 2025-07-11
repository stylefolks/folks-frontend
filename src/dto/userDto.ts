import { PostDto } from "@/dto/postDto";

export interface UserDto {
  id?: string;
  userId?: string;
  email?: string;
  username?: string;
  nickname?: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  backgroundUrl?: string;
  role?: string;
  followerCount?: number;
  followingCount?: number;
  avatarUrl?: string;
}

export interface SimpleUserDto {
  userId: string;
  username: string;
  imageUrl?: string;
}

export interface ProfileDto {
  userId: string;
  username: string;
  bio: string;
  imageUrl: string;
  tags: string[];
  posts: PostDto[];
  crews: Array<{ id: string; name: string; imageUrl: string }>;
}
