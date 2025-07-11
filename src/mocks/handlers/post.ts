import { http, HttpResponse } from "msw";
import { PostDetailCommentDto } from "@/dto/postDto";
import { CommentDto } from "@/dto/commentDto";

const postDetailCommentsMap: Record<string, PostDetailCommentDto[]> = {};
const postLikeMap: Record<string, number> = { abc123: 128 };
const commentsMap: Record<string, CommentDto[]> = {};

const mockPosts = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  title: `Mock Post ${i + 1}`,
  content: `<p>내용 ${i + 1}</p>`,
  hashtags: ["#테스트", "#스타일", `#${i % 5}`],
  author: { name: `User${i + 1}`, initials: `U${i + 1}` },
  createdAt: `2025-07-${(i % 30) + 1}`,
  crewName: i % 2 === 0 ? "Fashion Forward Crew" : "Street Crew",
  likes: 10 * (i + 1),
  comments: i,
  type: i % 2 === 0 ? "BASIC" : "COLUMN",
}));

const PUBLIC_API_URL =
  typeof window === "undefined"
    ? process.env.PUBLIC_API_URL
    : (import.meta as any).env.PUBLIC_API_URL;
const API_BASE = PUBLIC_API_URL ?? "http://localhost:3000";

export const postHandlers = [
  http.get(`${API_BASE}/posts/:id`, ({ params }) => {
    const { id } = params as { id: string };
    const likes = postLikeMap[id] ?? 128;
    const comments = postDetailCommentsMap[id]?.length ?? 0;
    postLikeMap[id] = likes;
    return HttpResponse.json({
      id: "abc123",
      title: "The Art of Effortless Chic",
      content: "<p>Hello...</p><img src='/mock/spring-outfit-1.jpg' />",
      hashtags: ["#StreetStyle", "#OOTD", "#Minimalist"],
      author: { name: "Sophia Lee", initials: "SL" },
      createdAt: "2025-06-28",
      crewName: "Fashion Forward Crew",
      likes,
      comments,
    });
  }),
  http.get(`${API_BASE}/posts`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.toLowerCase() ?? "";
    const tags = url.searchParams.getAll("tags");
    const tab = url.searchParams.get("tab") ?? "ALL";
    let filtered = mockPosts;
    if (query) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(query));
    }
    if (tags.length > 0) {
      filtered = filtered.filter((p) =>
        tags.every((tag) => p.hashtags.includes(tag))
      );
    }
    if (["BASIC", "COLUMN"].includes(tab)) {
      filtered = filtered.filter((p) => p.type === tab);
    }
    return HttpResponse.json(filtered);
  }),
  http.get(`${API_BASE}/posts/:postId/comments`, ({ params }) => {
    const { postId } = params as { postId: string };
    return HttpResponse.json(postDetailCommentsMap[postId] ?? []);
  }),
  http.post(
    `${API_BASE}/posts/:postId/comments`,
    async ({ params, request }) => {
      const { postId } = params as { postId: string };
      const { content } = (await request.json()) as { content?: string };
      const newComment: PostDetailCommentDto = {
        id: String(Date.now()),
        author: {
          username: "ME",
          userId: "user-me",
          imageUrl: "https://i.pravatar.cc/150?img=me",
        },
        createdAt: new Date().toISOString().slice(0, 10),
        content: content ?? "",
      };
      const list = postDetailCommentsMap[postId] ?? [];
      postDetailCommentsMap[postId] = [...list, newComment];
      return HttpResponse.json(newComment, { status: 201 });
    }
  ),
  http.post(`${API_BASE}/posts/:postId/like`, ({ params }) => {
    const { postId } = params as { postId: string };
    const current = postLikeMap[postId] ?? 0;
    postLikeMap[postId] = current + 1;
    return HttpResponse.json({ success: true });
  }),
  http.delete(`${API_BASE}/posts/:postId/unlike`, ({ params }) => {
    const { postId } = params as { postId: string };
    const current = postLikeMap[postId] ?? 1;
    postLikeMap[postId] = Math.max(0, current - 1);
    return HttpResponse.json({ success: true });
  }),
  http.put(`${API_BASE}/comments/:id`, async ({ params, request }) => {
    const { id } = params as { id: string };
    const { text } = (await request.json()) as { text?: string };
    for (const postId of Object.keys(commentsMap)) {
      const idx = commentsMap[postId].findIndex((c) => c.id === id);
      if (idx >= 0) {
        commentsMap[postId][idx].text = text ?? commentsMap[postId][idx].text;
        return HttpResponse.json(commentsMap[postId][idx]);
      }
    }
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.delete(`${API_BASE}/comments/:id`, ({ params }) => {
    const { id } = params as { id: string };
    for (const postId of Object.keys(commentsMap)) {
      const idx = commentsMap[postId].findIndex((c) => c.id === id);
      if (idx >= 0) {
        commentsMap[postId].splice(idx, 1);
        return new HttpResponse(null, { status: 204 });
      }
    }
    return new HttpResponse(null, { status: 404 });
  }),
];
