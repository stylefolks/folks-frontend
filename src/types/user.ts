export interface SimpleUser {
  userId: string;
  username: string;
  imageUrl?: string;
}

export enum UserTier {
  USER = "USER",
  INFLUENCER = "INFLUENCER",
  BRAND = "BRAND",
  MASTER = "MASTER",
}

export interface Profile {
  userId: string;
  email: string;
  username: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  backgroundUrl?: string;
  role?: UserTier;
}
