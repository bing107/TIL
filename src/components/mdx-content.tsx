interface MdxContentProps {
  html: string;
}

export default function MdxContent({ html }: MdxContentProps) {
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
