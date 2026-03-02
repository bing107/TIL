import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md dark:bg-black/60">
      <nav className="mx-auto flex max-w-3xl items-center px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-black hover:opacity-70 dark:text-white"
        >
          TIL
        </Link>
      </nav>
      <div className="border-b border-neutral-300 dark:border-neutral-700" />
    </header>
  );
}
