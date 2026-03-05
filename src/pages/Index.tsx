import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HelpDeskSection from "@/components/HelpDeskSection";
import KnowledgeSection from "@/components/KnowledgeSection";
import MythsSection from "@/components/MythsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <StatsSection />
    <HelpDeskSection />
    <KnowledgeSection />
    <MythsSection />
    <FooterSection />
  </div>
);

export default Index;
