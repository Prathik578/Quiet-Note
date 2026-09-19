import { AlertCircle, ArrowLeft, Inbox, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import { BrandMark } from '@/components/brand';

export function QuerySkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading" data-testid="status-loading">
      <div className="skeleton h-28 rounded-2xl" />
      <div className="skeleton h-40 rounded-2xl" />
      <div className="skeleton h-32 rounded-2xl" />
    </div>
  );
}

export function QueryError({ onRetry, message = 'We could not open this page.' }: { onRetry: () => void; message?: string }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center" data-testid="status-error">
      <div className="mx-auto mb-4 grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </div>
      <h2 className="font-display text-2xl text-foreground">A small pause.</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{message}</p>
      <button type="button" onClick={onRetry} className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/40" data-testid="button-retry">
        <RefreshCw className="size-4" /> Try again
      </button>
    </div>
  );
}

export function EmptyInbox() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center" data-testid="status-empty-inbox">
      <div className="pointer-events-none absolute -right-4 -top-7 font-display text-[11rem] leading-none text-secondary/25">“</div>
      <div className="relative">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-accent/50 text-primary">
          <Inbox className="size-6" strokeWidth={1.8} />
        </div>
        <h2 className="font-display text-3xl text-foreground">The first note is on its way.</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Share your private link with someone whose perspective you trust. Their words will land here, quietly.</p>
      </div>
    </div>
  );
}

export function InvalidLink() {
  return (
    <main className="paper-grain min-h-[100dvh] bg-background px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col items-center justify-center text-center">
        <BrandMark />
        <div className="mt-16 grid size-16 place-items-center rounded-full bg-secondary/60 text-primary">
          <AlertCircle className="size-7" />
        </div>
        <p className="mt-8 font-mono-custom text-[11px] uppercase tracking-[.2em] text-muted-foreground">Link unavailable</p>
        <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-.03em] text-foreground sm:text-6xl">This note has gone quiet.</h1>
        <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">This private link is no longer active, or it may have been copied incorrectly. Ask the owner for a fresh one.</p>
        <Link href="/" className="focus-ring mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90" data-testid="link-back-home">
          <ArrowLeft className="size-4" /> Back to Anonymous Feedback Box
        </Link>
      </div>
    </main>
  );
}