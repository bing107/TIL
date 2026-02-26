import { getAllPosts } from "@/lib/content";
import PostCard from "@/components/post-card";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      {posts.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
