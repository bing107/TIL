export default function Blog({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      this is the blog page: {params.slug}
    </main>
  );
}
