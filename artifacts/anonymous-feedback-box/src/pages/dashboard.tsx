import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Copy, ExternalLink, Link2, LoaderCircle, MessageSquareText, MoreHorizontal, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '@clerk/react';
import { useLocation } from 'wouter';
import {
  getGetCurrentUserQueryKey,
  getGetInboxQueryKey,
  useDeleteFeedback,
  useGetCurrentUser,
  useGetInbox,
} from '@workspace/api-client-react';
import type { Inbox } from '@workspace/api-client-react';
import { AppShell } from '@/components/app-shell';
import { EmptyInbox, QueryError, QuerySkeleton } from '@/components/feedback-states';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const currentUser = useGetCurrentUser({
    query: { enabled: Boolean(isLoaded && isSignedIn), queryKey: getGetCurrentUserQueryKey() },
  });
  const inbox = useGetInbox({
    query: { enabled: Boolean(isLoaded && isSignedIn), queryKey: getGetInboxQueryKey() },
  });
  const deleteFeedback = useDeleteFeedback();

  const feedback = useMemo(() => inbox.data?.feedback ?? [], [inbox.data?.feedback]);
  useEffect(() => {
    if (isLoaded && !isSignedIn) setLocation('/sign-in');
  }, [isLoaded, isSignedIn, setLocation]);

  if (!isLoaded) {
    return <div className="paper-grain grid min-h-[100dvh] place-items-center bg-background"><div className="animate-breathe font-mono-custom text-[11px] uppercase tracking-[.2em] text-muted-foreground" data-testid="status-auth-loading">opening your inbox</div></div>;
  }

  if (!isSignedIn) {
    return null;
  }

  const copyLink = async () => {
    if (!inbox.data?.publicUrl) return;
    try {
      await navigator.clipboard.writeText(inbox.data.publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const removeFeedback = (id: string) => {
    setDeletingId(id);
    deleteFeedback.mutate({ feedbackId: id }, {
      onSuccess: () => {
        setDeletedId(id);
        setConfirmingId(null);
        setDeletingId(null);
        queryClient.setQueryData<Inbox>(getGetInboxQueryKey(), (old) => old ? {
          ...old,
          total: Math.max(0, old.total - 1),
          feedback: old.feedback.filter((item) => item.id !== id),
        } : old);
        window.setTimeout(() => setDeletedId(null), 2200);
      },
      onError: () => setDeletingId(null),
    });
  };

  const link = inbox.data?.publicUrl ?? '';
  return (
    <AppShell email={currentUser.data?.email}>
      <main className="animate-rise-in pt-8 sm:pt-12">
        <div className="flex flex-col justify-between gap-8 border-b border-border pb-9 md:flex-row md:items-end">
          <div>
            <p className="font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary">Your private inbox</p>
            <h1 className="mt-4 font-display text-5xl leading-[.9] tracking-[-.035em] text-foreground sm:text-6xl">Make room<br /><em className="text-primary">for honesty.</em></h1>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground" data-testid="text-message-count">
            <span className="font-mono-custom text-4xl text-foreground">{inbox.data?.total ?? 0}</span>
            <span className="max-w-20 text-xs leading-4">thoughtful<br />note{(inbox.data?.total ?? 0) === 1 ? '' : 's'}</span>
          </div>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-2xl border border-primary/15 bg-primary p-6 text-primary-foreground shadow-lg sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-primary-foreground/65">Your share link</p>
                <h2 className="mt-3 font-display text-3xl leading-none sm:text-4xl">Invite a little honesty.</h2>
              </div>
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Link2 className="size-5" /></div>
            </div>
            {inbox.isLoading ? <div className="mt-8 h-12 animate-pulse rounded-xl bg-primary-foreground/10" /> : (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="min-w-0 flex-1 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-3 font-mono-custom text-xs text-primary-foreground/80" data-testid="text-public-link">{link}</div>
                <button type="button" onClick={copyLink} className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition hover:-translate-y-0.5" data-testid="button-copy-link">
                  {copied ? <ShieldCheck className="size-4" /> : <Copy className="size-4" />}
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            )}
            <p className="mt-4 flex items-center gap-2 text-xs text-primary-foreground/65"><ShieldCheck className="size-3.5" /> Send it anywhere. Senders stay anonymous.</p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between"><MessageSquareText className="size-5 text-primary" strokeWidth={1.8} /><span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-muted-foreground">the door is open</span></div>
              <h2 className="mt-12 font-display text-3xl leading-none text-foreground">What would you like to hear?</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Your link is ready when you are. A good note can start a useful conversation.</p>
            </div>
            {link && <a href={link} target="_blank" rel="noreferrer" className="focus-ring mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary" data-testid="link-preview-inbox">Preview your form <ExternalLink className="size-3.5" /></a>}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-muted-foreground">The notes</p><h2 className="mt-2 font-display text-3xl text-foreground">Recent feedback</h2></div>
            {inbox.data && <span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-muted-foreground">{inbox.data.total} total</span>}
          </div>
          {inbox.isLoading && <QuerySkeleton />}
          {inbox.isError && <QueryError onRetry={() => void inbox.refetch()} message="Your notes are taking a moment to arrive." />}
          {inbox.data && feedback.length === 0 && <EmptyInbox />}
          {deletedId && <div className="mb-4 flex items-center gap-2 rounded-xl border border-accent bg-accent/35 px-4 py-3 text-sm font-semibold text-foreground" data-testid="status-feedback-deleted"><ShieldCheck className="size-4 text-primary" /> Note deleted from your inbox.</div>}
          {inbox.data && feedback.length > 0 && (
            <div className="space-y-4" data-testid="list-feedback">
              {feedback.map((item, index) => (
                <article key={item.id} className="group relative rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(63,48,74,.07)] sm:p-7" data-testid={`card-feedback-${item.id}`}>
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-accent/60 font-display text-lg text-primary">{String.fromCharCode(65 + (index % 26))}</span><span className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-muted-foreground">anonymous note</span></div>
                    {confirmingId !== item.id && <button type="button" onClick={() => setConfirmingId(item.id)} className="focus-ring rounded-full p-2 text-muted-foreground opacity-60 transition hover:bg-muted hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100" aria-label="Delete feedback" data-testid={`button-delete-feedback-${item.id}`}><MoreHorizontal className="size-5" /></button>}
                  </div>
                  <p className="mt-6 max-w-3xl whitespace-pre-wrap text-[15px] leading-7 text-foreground" data-testid={`text-feedback-${item.id}`}>{item.message}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4"><time className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-muted-foreground" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                    {confirmingId === item.id && <div className="flex items-center gap-2 text-xs"><span className="text-muted-foreground">Delete this note?</span><button type="button" onClick={() => setConfirmingId(null)} className="focus-ring rounded-full px-2.5 py-1.5 font-semibold text-muted-foreground hover:text-foreground" data-testid={`button-cancel-delete-${item.id}`}>Keep</button><button type="button" onClick={() => removeFeedback(item.id)} disabled={deletingId === item.id} className="focus-ring inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-1.5 font-semibold text-destructive-foreground disabled:opacity-60" data-testid={`button-confirm-delete-${item.id}`}>{deletingId === item.id && <LoaderCircle className="size-3 animate-spin" />} Delete</button></div>}
                    {deletedId === item.id && <span className="text-xs font-semibold text-primary" data-testid={`status-deleted-${item.id}`}>Deleted</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
          {deleteFeedback.isError && <p className="mt-4 text-center text-sm text-destructive" data-testid="status-delete-error">That note could not be deleted. Please try again.</p>}
        </section>
      </main>
    </AppShell>
  );
}