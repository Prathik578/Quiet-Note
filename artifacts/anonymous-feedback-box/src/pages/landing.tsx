import { ArrowRight, Check, Link2, LockKeyhole, PenLine } from 'lucide-react';
import { Link } from 'wouter';
import { BrandMark, PrivacyPill } from '@/components/brand';

export function LandingPage() {
  return (
    <main className="paper-grain min-h-[100dvh] overflow-hidden bg-background">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <BrandMark />
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="focus-ring hidden text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:inline" data-testid="link-sign-in">Sign in</Link>
          <Link href="/sign-up" className="focus-ring rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90" data-testid="link-get-started">Get started</Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-20 lg:px-10 lg:pb-32 lg:pt-24">
        <div className="relative z-10 animate-rise-in">
          <p className="font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary" data-testid="text-app-title">Anonymous Feedback Box</p>
          <PrivacyPill />
          <h1 className="mt-7 max-w-3xl font-display text-[4.5rem] leading-[.86] tracking-[-.045em] text-foreground sm:text-[6.7rem] lg:text-[7.7rem]">
            Say what<br /><em className="text-primary">matters.</em>
          </h1>
          <p className="mt-8 max-w-lg text-[17px] leading-8 text-muted-foreground sm:text-lg">A private inbox for the honest things people mean to tell you. No names, no noise — just a little more room for the truth.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/sign-up" className="focus-ring group inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-1 hover:shadow-lg" data-testid="link-create-inbox">
              Create your inbox <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-xs text-muted-foreground">Free to start · always private</span>
          </div>
        </div>

        <div className="relative mx-auto h-[390px] w-full max-w-[430px] animate-rise-in sm:h-[460px] lg:h-[510px]">
          <div className="absolute left-2 top-8 h-72 w-60 rotate-[-9deg] rounded-[2rem] border border-primary/10 bg-accent/45 p-6 shadow-[0_20px_50px_rgba(63,48,74,.08)] sm:left-4 sm:h-80 sm:w-64" aria-hidden="true">
            <div className="h-full rounded-[1.4rem] border border-primary/10 bg-background/40" />
          </div>
          <div className="absolute right-0 top-0 w-[calc(100%-2rem)] rotate-[4deg] rounded-[2rem] border border-border bg-card p-7 shadow-lg sm:w-[350px] sm:p-9">
            <div className="flex items-center justify-between">
              <span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-muted-foreground">private inbox</span>
              <span className="size-2 rounded-full bg-secondary" />
            </div>
            <div className="mt-11 font-display text-4xl leading-[.9] text-foreground sm:text-5xl">A little<br /><em className="text-primary">note</em> to you.</div>
            <div className="mt-12 space-y-5">
              <div className="h-2 w-[78%] rounded-full bg-muted" />
              <div className="h-2 w-[91%] rounded-full bg-muted" />
              <div className="h-2 w-[58%] rounded-full bg-secondary/70" />
            </div>
            <div className="mt-12 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5 text-primary" /> no name attached</div>
          </div>
          <div className="absolute bottom-4 left-4 flex rotate-[-5deg] items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_12px_25px_rgba(63,48,74,.1)] sm:bottom-10 sm:left-0" data-testid="status-anonymous">
            <span className="grid size-8 place-items-center rounded-full bg-secondary/60 text-primary"><Check className="size-4" /></span>
            <div><p className="text-sm font-semibold">No identity trail</p><p className="text-[11px] text-muted-foreground">just their words</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/80 bg-card/35">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-20">
          <div>
            <p className="font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary">How it works</p>
            <h2 className="mt-4 max-w-sm font-display text-5xl leading-[.92] tracking-[-.03em] text-foreground">A small ritual for better conversations.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Link2, number: '01', title: 'Make a link', copy: 'Create one private address for your inbox.' },
              { icon: PenLine, number: '02', title: 'Share it softly', copy: 'Send it to the people whose words matter.' },
              { icon: LockKeyhole, number: '03', title: 'Read what lands', copy: 'Receive honest feedback without a name attached.' },
            ].map(({ icon: Icon, number, title, copy }) => (
              <div key={number} className="rounded-2xl border border-border bg-background/55 p-5 transition hover:-translate-y-1 hover:bg-card" data-testid={`card-step-${number}`}>
                <div className="flex items-center justify-between"><Icon className="size-5 text-primary" strokeWidth={1.8} /><span className="font-mono-custom text-[10px] text-muted-foreground">{number}</span></div>
                <h3 className="mt-10 font-display text-2xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:px-10 lg:py-28">
        <div>
          <p className="font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary">Built for trust</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[.9] tracking-[-.03em] text-foreground sm:text-6xl">Good feedback needs a little privacy.</h2>
        </div>
        <div className="max-w-sm border-l border-primary/30 pl-5 text-sm leading-7 text-muted-foreground">Anonymous Feedback Box never asks a sender to create an account. We keep the path simple so the message can stay sincere.</div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-border px-5 py-7 text-xs text-muted-foreground sm:px-8 lg:px-10">
        <span>© Anonymous Feedback Box</span><span className="font-mono-custom">private words, held carefully</span>
      </footer>
    </main>
  );
}