import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import TagPill from "@/components/tag-pill";

interface PostCardProps {
  post: PostMeta;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <Link
        href={`/${post.slug}`}
        className="text-lg font-semibold text-black hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
      >
        {post.title}
      </Link>

      <time
        dateTime={post.date}
        className="mt-1 block text-sm text-neutral-500 dark:text-neutral-400"
      >
        {formatDate(post.date)}
      </time>

      {post.summary && (
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {post.summary}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
