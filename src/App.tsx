import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
