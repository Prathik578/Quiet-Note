import type { ReactNode } from 'react';
import { LogOut, Sparkles } from 'lucide-react';
import { useClerk } from '@clerk/react';
import { Link } from 'wouter';
import { BrandMark } from '@/components/brand';

export function AppShell({ children, email }: { children: ReactNode; email?: string }) {
  const { signOut } = useClerk();
  return (
    <div className="paper-grain min-h-[100dvh] bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <BrandMark />
        <div className="flex items-center gap-3">
          {email && <span className="hidden max-w-[190px] truncate text-xs text-muted-foreground sm:block" data-testid="text-owner-email">{email}</span>}
          <button type="button" onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL || '/' })} className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-foreground" data-testid="button-logout">
            <LogOut className="size-3.5" /> Log out
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:px-10">{children}</div>
      <footer className="mx-auto flex max-w-6xl items-center gap-2 px-5 pb-8 text-xs text-muted-foreground sm:px-8 lg:px-10">
        <Sparkles className="size-3.5 text-primary" /> A softer place for honest words.
        <Link href="/" className="ink-link ml-auto hidden sm:inline" data-testid="link-footer-home">quietnote</Link>
      </footer>
    </div>
  );
}