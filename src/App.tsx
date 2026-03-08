import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import AutoTranslateWrapper from "@/components/AutoTranslateWrapper";
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import VoterQuiz from "./pages/VoterQuiz";
import NotFound from "./pages/NotFound";
import VotingAssistant from "./components/VotingAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AutoTranslateWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
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
            <Route path="/candidate" element={<CandidateDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/voter-quiz" element={<VoterQuiz />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AutoTranslateWrapper>
        </AuthProvider>
      </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
