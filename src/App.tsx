import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import AutoTranslateWrapper from "@/components/AutoTranslateWrapper";
import { loadGlobalFont } from "@/components/FontSelector";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VotingAssistant from "./components/VotingAssistant";
import CookieConsent from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";

// Lazy-load all non-critical routes for smaller initial bundle
const HelpDesk = lazy(() => import("./pages/HelpDesk"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Myths = lazy(() => import("./pages/Myths"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ElectionTimeline = lazy(() => import("./pages/ElectionTimeline"));
const ImportantForms = lazy(() => import("./pages/ImportantForms"));
const VoterRights = lazy(() => import("./pages/VoterRights"));
const FAQ = lazy(() => import("./pages/FAQ"));
const StatePage = lazy(() => import("./pages/StatePage"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const ElectionResults = lazy(() => import("./pages/ElectionResults"));
const PoliticalParties = lazy(() => import("./pages/PoliticalParties"));
const ConstitutionLaws = lazy(() => import("./pages/ConstitutionLaws"));
const JoinUs = lazy(() => import("./pages/JoinUs"));
const Constituency = lazy(() => import("./pages/Constituency"));
const CandidateDetail = lazy(() => import("./pages/CandidateDetail"));
const ConstituencyDetailPage = lazy(() => import("./pages/ConstituencyDetail"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Admin = lazy(() => import("./pages/Admin"));
const VoterQuiz = lazy(() => import("./pages/VoterQuiz"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UpcomingElection = lazy(() => import("./pages/UpcomingElection"));
const ViewCandidates = lazy(() => import("./pages/ViewCandidates"));
const ByeElections = lazy(() => import("./pages/ByeElections"));
const ExitPoll = lazy(() => import("./pages/ExitPoll"));
const AllExitPolls = lazy(() => import("./pages/AllExitPolls"));
const Services = lazy(() => import("./pages/Services"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Smarter defaults: avoid refetch storms on tab focus / re-mount
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — most of our data (CMS, polls, blogs) doesn't change often
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
  </div>
);

const App = () => {
  useEffect(() => { loadGlobalFont(); }, []);
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <AutoTranslateWrapper>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/help-desk" element={<HelpDesk />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/myths" element={<Myths />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/election-timeline" element={<ElectionTimeline />} />
            <Route path="/important-forms" element={<ImportantForms />} />
            <Route path="/voter-rights" element={<VoterRights />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/state/:stateId" element={<StatePage />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/election-results" element={<ElectionResults />} />
            <Route path="/political-parties" element={<PoliticalParties />} />
            <Route path="/constitution-laws" element={<ConstitutionLaws />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/constituency" element={<Constituency />} />
            <Route path="/constituency/:stateId/:name" element={<ConstituencyDetailPage />} />
            <Route path="/candidate" element={<CandidateDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/voter-quiz" element={<VoterQuiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/upcoming-election/:stateSlug" element={<UpcomingElection />} />
            <Route path="/upcoming-election/:stateSlug/candidates" element={<ViewCandidates />} />
            <Route path="/upcoming-election/:stateSlug/exit-poll" element={<ExitPoll />} />
            <Route path="/exit-polls" element={<AllExitPolls />} />
            <Route path="/bye-elections-2026" element={<ByeElections />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <VotingAssistant />
          <CookieConsent />
          <Analytics />
          </AutoTranslateWrapper>
        </AuthProvider>
      </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
