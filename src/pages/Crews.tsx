import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMeta } from "@/lib/meta";
import { fetchCrews, type CrewSummary } from "@/lib/crew";
import CrewEventBannerSlider from "@/components/crews/CrewEventBannerSlider";
import CrewList from "@/components/crews/CrewList";
import TagFilter from "@/components/crews/TagFilter";
import { Button } from "@/components/ui/button";
import { TAGS } from "@/mocks/tags";

export default function CrewsPage() {
  useMeta({ title: "Crews - Stylefolks" });
  const [recommended, setRecommended] = useState<CrewSummary[]>([]);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    fetchCrews({ sort: "popular" }).then(setRecommended);
  }, []);

  const eventCrews = recommended.filter((c) => c.upcomingEvent);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">
        지금, 어떤 CREW들이 움직이고 있을까요?
      </h1>
      {/* TODO: 권한 확인 후 아래 버튼 렌더 */}
      <div className="text-right">
        <Button asChild>
          <Link to="/crews/new">크루 생성</Link>
        </Button>
      </div>
      <CrewEventBannerSlider crews={eventCrews} />
      <TagFilter tags={TAGS} selected={tag} onChange={setTag} />
      <CrewList tag={tag} />
    </div>
  );
}
