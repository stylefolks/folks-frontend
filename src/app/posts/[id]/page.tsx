import { getPostById } from "@/lib/posts";
import { notFound } from "next/navigation";
export default async function PostPage({ params }: { params: { id: string } }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const post = await getPostById(id);

  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-xl p-4">
      <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500">
        {new Date(post.date).toDateString()}
      </p>
      <img
        src={post.image}
        alt={post.title}
        className="my-4 w-full rounded-md"
      />
      <p>{post.content}</p>
    </article>
  );
}
