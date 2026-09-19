import { MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-3" data-testid="link-brand">
      <span className="grid size-10 place-items-center rounded-[13px] bg-secondary text-primary shadow-sm" aria-hidden="true">
        <MessageCircle className="size-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="font-display text-[1.45rem] leading-none tracking-[-.02em] text-foreground">
          quiet<span className="text-primary">note</span>
        </span>
      )}
    </Link>
  );
}

export function PrivacyPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground" data-testid="status-privacy">
      <span className="size-1.5 rounded-full bg-primary" />
      Anonymous by design
    </span>
  );
}