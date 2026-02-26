import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/content";
import PostCard from "@/components/post-card";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams(): { tag: string }[] {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  return {
    title: `Posts tagged "${decoded}" — TIL`,
    description: `All TIL posts tagged with "${decoded}".`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        ← All posts
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-black dark:text-white">
        Posts tagged &ldquo;{decoded}&rdquo;
      </h1>

      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      <div className="mt-6 flex flex-col gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
