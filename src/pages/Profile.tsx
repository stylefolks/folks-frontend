import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { getFollowers, getFollowing, getMyProfile } from "@/lib/profile";
import Avatar from "@/components/ui/avatar";
import FollowListModal from "@/components/users/FollowListModal";
import { logout } from "@/lib/auth";
import { Menu } from "lucide-react";
import { getProfileApi } from "@/api/profileApi";
import type { ProfileDto } from "@/dto/userDto";
import { SimpleUserDto, UserTier } from "@/dto/userDto";

export default function UserProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<ProfileDto | null>(null);

  const [followers, setFollowers] = useState<SimpleUserDto[]>([]);
  const [following, setFollowing] = useState<SimpleUserDto[]>([]);
  const [modal, setModal] = useState<"followers" | "following" | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getProfileApi(userId)
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
    Promise.all([getFollowers(userId), getFollowing(userId), getMyProfile()])
      .then(([fwr, fwg, me]) => {
        setFollowers(fwr);
        setFollowing(fwg);
        setIsMaster(me.role === UserTier.MASTER);
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
    <>
      <div className="space-y-6 p-4">
        <div className="relative flex flex-col items-center">
          <Avatar src={profile.imageUrl} className="h-16 w-16" />
          <h2 className="mt-2 text-xl font-bold">{profile.username}</h2>
          <p className="text-sm text-gray-500">{profile.bio}</p>
          <p className="mt-1 text-sm">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setModal("followers")}
            >
              {followers.length} followers
            </span>{" "}
            ·{" "}
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setModal("following")}
            >
              {following.length} following
            </span>
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
            {profile?.crews?.map((c) => (
              <Avatar
                key={c.id}
                src={c.coverImage}
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
      <FollowListModal
        open={modal === "followers"}
        onClose={() => setModal(null)}
        users={followers}
        type="followers"
        isMaster={isMaster}
      />
      <FollowListModal
        open={modal === "following"}
        onClose={() => setModal(null)}
        users={following}
        type="following"
        isMaster={isMaster}
      />
    </>
  );
}
