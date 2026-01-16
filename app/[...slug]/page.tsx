import { notFound, redirect } from 'next/navigation';

const KNOWN_SECTIONS = new Set([
  'home',
  'partners',
  'projects',
  'services',
  'testimonials',
  'contact',
]);

export default function CatchAllRoute({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params.slug?.join('/') ?? '';

  if (KNOWN_SECTIONS.has(slug)) {
    redirect(`/#${slug}`);
  }

  notFound();
}
