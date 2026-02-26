export default function Footer() {
  return (
    <footer className="border-t border-neutral-300 dark:border-neutral-700">
      <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>© {new Date().getFullYear()} Hassan Syed · Today I Learned</p>
      </div>
    </footer>
  );
}
