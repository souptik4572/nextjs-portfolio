import { portfolioData } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Intro from "@/components/sections/Intro";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import NotableOffers from "@/components/sections/NotableOffers";
import type { SectionKey } from "@/lib/data";

const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType> = {
  intro: Intro,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  achievements: Achievements,
  notable_offers: NotableOffers,
  education: Education,
  contact: Contact,
};

export default function Home() {
  const { section_order } = portfolioData.layout;

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto">
        {section_order.map((section) => {
          const Section = SECTION_COMPONENTS[section];
          return <Section key={section} />;
        })}
      </main>
      <Footer />
    </>
  );
}
