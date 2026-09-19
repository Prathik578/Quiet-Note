import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, ChevronLeft, LoaderCircle, LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { useCreatePublicFeedback, getGetPublicFeedbackTargetQueryKey, useGetPublicFeedbackTarget } from '@workspace/api-client-react';
import { InvalidLink, QueryError } from '@/components/feedback-states';
import { BrandMark, PrivacyPill } from '@/components/brand';

export function PublicFeedbackPage() {
  const { token = '' } = useParams<{ token: string }>();
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const target = useGetPublicFeedbackTarget(token, { query: { enabled: Boolean(token), queryKey: getGetPublicFeedbackTargetQueryKey(token) } });
  const createFeedback = useCreatePublicFeedback();

  if (target.isLoading) {
    return <main className="paper-grain grid min-h-[100dvh] place-items-center bg-background px-5"><div className="w-full max-w-lg space-y-5" data-testid="status-loading"><div className="skeleton mx-auto h-4 w-32 rounded-full" /><div className="skeleton h-24 rounded-2xl" /><div className="skeleton h-56 rounded-2xl" /></div></main>;
  }
  if (target.isError || !target.data?.valid) return target.isError ? <main className="paper-grain min-h-[100dvh] bg-background px-5 py-8"><div className="mx-auto max-w-lg pt-24"><BrandMark /><div className="mt-14"><QueryError onRetry={() => void target.refetch()} message="We could not verify this private link." /></div></div></main> : <InvalidLink />;
  if (submitted) {
    return <main className="paper-grain min-h-[100dvh] bg-background px-5 py-8"><div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col items-center justify-center text-center"><BrandMark /><div className="mt-16 grid size-16 place-items-center rounded-full bg-accent text-primary"><Check className="size-8" strokeWidth={2.3} /></div><p className="mt-8 font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary">Note delivered</p><h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-.03em] text-foreground sm:text-6xl">That was brave<br /><em className="text-primary">of you.</em></h1><p className="mt-6 max-w-sm text-[15px] leading-7 text-muted-foreground">Your note is safely in the inbox. No name was attached, and nothing else is needed.</p><div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Anonymous from start to finish</div></div></main>;
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) { setValidationError('A blank note cannot be sent.'); return; }
    if (trimmed.length > 2000) { setValidationError('Keep your note under 2,000 characters.'); return; }
    setValidationError('');
    createFeedback.mutate({ publicToken: token, data: { message: trimmed } }, {
      onSuccess: (result) => { if (result.accepted) setSubmitted(true); else setValidationError('This note could not be accepted.'); },
      onError: () => setValidationError('Something interrupted the delivery. Please try again.'),
    });
  };

  return (
    <main className="paper-grain min-h-[100dvh] bg-background px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between"><BrandMark /><Link href="/" className="focus-ring hidden items-center gap-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground sm:flex" data-testid="link-back-home"><ChevronLeft className="size-3.5" /> Anonymous Feedback Box</Link></header>
        <div className="mx-auto max-w-xl pb-16 pt-20 sm:pt-28">
          <div className="animate-rise-in"><PrivacyPill /><h1 className="mt-7 font-display text-6xl leading-[.86] tracking-[-.04em] text-foreground sm:text-7xl">A private place<br />to <em className="text-primary">say it.</em></h1><p className="mt-7 max-w-md text-[15px] leading-7 text-muted-foreground">Leave a thoughtful note. The person who shared this link will receive it without your name attached.</p></div>
          <form onSubmit={submit} className="animate-rise-in stagger-2 mt-10" data-testid="form-feedback">
            <label htmlFor="message" className="mb-3 flex items-center justify-between text-sm font-semibold text-foreground"><span className="flex items-center gap-2"><MessageCircle className="size-4 text-primary" /> Your note</span><span className={`font-mono-custom text-[10px] font-normal ${message.length > 1900 ? 'text-destructive' : 'text-muted-foreground'}`} data-testid="text-character-count">{message.length}/2000</span></label>
            <textarea id="message" value={message} onChange={(event) => { setMessage(event.target.value.slice(0, 2000)); setValidationError(''); }} maxLength={2000} rows={9} placeholder="Write what you have been meaning to say..." className="focus-ring w-full resize-none rounded-2xl border border-border bg-card px-5 py-5 text-[15px] leading-7 text-foreground shadow-[0_10px_30px_rgba(63,48,74,.04)] outline-none transition placeholder:text-muted-foreground/65 focus:border-primary/50 focus:shadow-[0_12px_35px_rgba(81,56,94,.1)]" data-testid="input-feedback-message" aria-describedby="feedback-helper" />
            <div id="feedback-helper" className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-primary" /> Your message is sent anonymously. Please keep it kind and useful.</div>
            {validationError && <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" data-testid="status-submit-error">{validationError}</p>}
            <button type="submit" disabled={createFeedback.isPending} className="focus-ring group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-feedback">{createFeedback.isPending ? <><LoaderCircle className="size-4 animate-spin" /> Sending quietly...</> : <>Send anonymously <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>}</button>
          </form>
          <div className="mt-16 flex items-center justify-center gap-2 border-t border-border pt-7 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> No account. No identifying details. Just your words.</div>
        </div>
      </div>
    </main>
  );
}