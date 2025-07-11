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
