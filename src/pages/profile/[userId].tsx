import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { mockPost, type Post } from "@/lib/posts";

import {
  getFollowers,
  getFollowing,
  getMyProfile,
  type SimpleUser,
} from "@/lib/profile";
import Avatar from "@/components/ui/avatar";
import { logout } from "@/lib/auth";
import { Menu } from "lucide-react";

interface CrewItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface ProfileData {
  userId: string;
  username: string;
  bio: string;
  imageUrl: string;
  tags: string[];
  posts: (Post & { category: "TALK" | "COLUMN" | "CREW" })[];
  crews: CrewItem[];
}

function generateMockProfile(userId: string): ProfileData {
  const base = parseInt(userId.replace(/\D/g, ""), 10) || 1;
  const tags = Array.from({ length: 5 }, (_, i) => `tag${base + i}`);
  const crews = Array.from({ length: 5 }, (_, i) => ({
    id: `crew${base + i}`,
    name: `Crew ${base + i}`,
    imageUrl: `https://picsum.photos/seed/crew-${base + i}/80`,
  }));
  const posts = Array.from({ length: 12 }, (_, i) => {
    const post = mockPost(base * 10 + i) as Post & {
      category: "TALK" | "COLUMN" | "CREW";
    };
    post.category = i % 3 === 0 ? "TALK" : i % 3 === 1 ? "COLUMN" : "CREW";
    return post;
  });
  return {
    userId,
    username: `User ${userId}`,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet.",
    imageUrl: `https://picsum.photos/seed/user-${userId}/100`,
    tags,
    posts,
    crews,
  };
}

export default function UserProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [followers, setFollowers] = useState<SimpleUser[]>([]);
  const [following, setFollowing] = useState<SimpleUser[]>([]);
  const [modal, setModal] = useState<"followers" | "following" | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setProfile(generateMockProfile(userId));
    Promise.all([getFollowers(userId), getFollowing(userId), getMyProfile()])
      .then(([fwr, fwg, me]) => {
        setFollowers(fwr);
        setFollowing(fwg);
        setIsMaster(me.role === "master" || me.role === "admin");
      })
      .catch(() => {
        setFollowers([]);
        setFollowing([]);
        setIsMaster(false);
      });
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile) return <p className="p-4">Loading...</p>;

  const posts = profile.posts;

  return (
    <div className="space-y-6 p-4">
      <div className="relative flex flex-col items-center">
        <Avatar src={profile.imageUrl} className="h-16 w-16" />
        <h2 className="mt-2 text-xl font-bold">{profile.username}</h2>
        <p className="text-sm text-gray-500">{profile.bio}</p>
        <p className="mt-1 text-sm">
          {followers.length} followers · {following.length} following
        </p>
        <button
          aria-label="menu"
          className="absolute right-0 top-0"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Menu />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 w-32 rounded-md border bg-white shadow">
            <div
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </div>
            <div
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => navigate("/settings")}
            >
              Settings
            </div>
            <div className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100">
              Help Center
            </div>
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Joined Crews</h3>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {profile.crews.map((c) => (
            <Avatar
              key={c.id}
              src={c.imageUrl}
              size="sm"
              className="cursor-pointer"
              onClick={() => navigate(`/crew/${c.id}`)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">My Posts</h3>
        <div className="columns-2 gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
