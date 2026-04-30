import { useEffect } from "react";
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
import HelpDesk from "./pages/HelpDesk";
import Knowledge from "./pages/Knowledge";
import Myths from "./pages/Myths";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ElectionTimeline from "./pages/ElectionTimeline";
import ImportantForms from "./pages/ImportantForms";
import VoterRights from "./pages/VoterRights";
import FAQ from "./pages/FAQ";
import StatePage from "./pages/StatePage";
import Blogs from "./pages/Blogs";
import ElectionResults from "./pages/ElectionResults";
import PoliticalParties from "./pages/PoliticalParties";
import ConstitutionLaws from "./pages/ConstitutionLaws";
import JoinUs from "./pages/JoinUs";
import Constituency from "./pages/Constituency";
import CandidateDetail from "./pages/CandidateDetail";
import ConstituencyDetailPage from "./pages/ConstituencyDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import VoterQuiz from "./pages/VoterQuiz";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import UpcomingElection from "./pages/UpcomingElection";
import ViewCandidates from "./pages/ViewCandidates";
import ByeElections from "./pages/ByeElections";
import ExitPoll from "./pages/ExitPoll";
import AllExitPolls from "./pages/AllExitPolls";
import Services from "./pages/Services";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Disclaimer from "./pages/Disclaimer";
import CookiePolicy from "./pages/CookiePolicy";
import VotingAssistant from "./components/VotingAssistant";
import CookieConsent from "./components/CookieConsent";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

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
          <VotingAssistant />
          <CookieConsent />
          </AutoTranslateWrapper>
        </AuthProvider>
      </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
