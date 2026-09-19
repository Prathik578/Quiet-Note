import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';
import { BrandMark } from '@/components/brand';

export default function NotFound() {
  return (
    <main className="paper-grain min-h-[100dvh] bg-background px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col items-center justify-center text-center">
        <BrandMark />
        <div className="mt-16 grid size-16 place-items-center rounded-full bg-secondary/60 text-primary"><Compass className="size-7" /></div>
        <p className="mt-8 font-mono-custom text-[11px] uppercase tracking-[.2em] text-muted-foreground">404 · page not found</p>
        <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-.03em] text-foreground sm:text-6xl">This page took<br /><em className="text-primary">a different turn.</em></h1>
        <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">The address may be old or the note may have moved. Let’s take you somewhere quieter.</p>
        <Link href="/" className="focus-ring mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90" data-testid="link-not-found-home"><ArrowLeft className="size-4" /> Return home</Link>
      </div>
    </main>
  );
}