import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts: PostMeta[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(CONTENT_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      posts.push({
        slug,
        title: data.title ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        summary: data.summary ?? "",
      });
    } catch (err) {
      console.warn(`Skipping malformed file: ${file}`, err);
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }

  const { data, content: markdown } = matter(raw);

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypePrismPlus)
    .use(rehypeStringify)
    .process(markdown);

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    summary: data.summary ?? "",
    content: String(result),
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
