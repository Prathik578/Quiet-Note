import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from '@clerk/react';
import { shadcn } from '@clerk/themes';
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LandingPage } from '@/pages/landing';
import { DashboardPage } from '@/pages/dashboard';
import { PublicFeedbackPage } from '@/pages/public-feedback';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
function stripBase(path: string) {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#51385e',
    colorForeground: '#2e2635',
    colorMutedForeground: '#776f79',
    colorDanger: '#a94640',
    colorBackground: '#fbf8f1',
    colorInput: '#f6f0e7',
    colorInputForeground: '#2e2635',
    colorNeutral: '#ddd3c6',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fbf8f1] rounded-[1.5rem] w-[440px] max-w-full overflow-hidden border border-[#ddd3c6] shadow-[0_22px_58px_rgba(63,48,74,.12)]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#2e2635] font-semibold',
    headerSubtitle: 'text-[#776f79]',
    socialButtonsBlockButtonText: 'text-[#2e2635] font-semibold',
    formFieldLabel: 'text-[#2e2635] font-semibold',
    footerActionLink: 'text-[#51385e] font-semibold',
    footerActionText: 'text-[#776f79]',
    dividerText: 'text-[#776f79]',
    identityPreviewEditButton: 'text-[#51385e]',
    formFieldSuccessText: 'text-[#3f7665]',
    alertText: 'text-[#a94640]',
    logoBox: 'rounded-xl overflow-hidden',
    logoImage: 'rounded-xl',
    socialButtonsBlockButton: 'border-[#ddd3c6] bg-[#f6f0e7] hover:bg-[#efe7dc]',
    formButtonPrimary: 'bg-[#51385e] hover:bg-[#432e4f] text-[#fbf8f1]',
    formFieldInput: 'border-[#ddd3c6] bg-[#f6f0e7] text-[#2e2635]',
    footerAction: 'border-t border-[#ddd3c6]',
    dividerLine: 'bg-[#ddd3c6]',
    alert: 'border-[#a94640]/20 bg-[#a94640]/5',
    otpCodeFieldInput: 'border-[#ddd3c6] bg-[#f6f0e7]',
    formFieldRow: 'gap-2',
    main: 'gap-5',
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) client.clear();
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);
  return null;
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="paper-grain grid min-h-[100dvh] place-items-center bg-background"><div className="animate-breathe font-mono-custom text-[11px] uppercase tracking-[.2em] text-muted-foreground" data-testid="status-home-loading">settling in</div></div>;
  return isSignedIn ? <Redirect to="/dashboard" /> : <LandingPage />;
}

function AuthPage({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  return (
    <main className="paper-grain flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      {mode === 'sign-in' ? <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /> : <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />}
    </main>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: 'Welcome back', subtitle: 'Your private inbox is waiting.' } },
        signUp: { start: { title: 'Make room for honesty', subtitle: 'Create your private inbox in a minute.' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryClientCacheInvalidator />
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/feedback/:token" component={PublicFeedbackPage} />
          <Route path="/sign-in/*?" component={() => <AuthPage mode="sign-in" />} />
          <Route path="/sign-up/*?" component={() => <AuthPage mode="sign-up" />} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </ClerkProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
