import { Fragment } from "react";
import { getPortfolioData } from "@/lib/getPortfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImpactStrip from "@/components/ImpactStrip";
import Intro from "@/components/sections/Intro";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import NotableOffers from "@/components/sections/NotableOffers";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollSpy from "@/components/ScrollSpy";
import { type SectionKey, getEnabledSections, isImpactEnabled } from "@/lib/data";

export interface SectionProps {
  sectionIndex?: number;
}

const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType<SectionProps>> = {
  intro: Intro,
  experience: Experience,
  skills: Skills,
  projects: Projects,
  achievements: Achievements,
  notable_offers: NotableOffers,
  education: Education,
  contact: Contact,
};

export default async function Home() {
  const data = await getPortfolioData();
  const enabledSections = getEnabledSections(data.layout.section_order);
  const impactEnabled = isImpactEnabled(data.layout.section_order);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto">
        {enabledSections.map((section, index) => {
          const Section = SECTION_COMPONENTS[section];
          const isAlt = index % 2 === 1;
          return (
            <Fragment key={section}>
              <div className={isAlt ? "section-alt" : "section-base"}>
                <Section sectionIndex={index + 1} />
              </div>
              {/* Selected-impact counters sit directly under the hero.
                  Toggle its visibility from Admin → Layout Manager. */}
              {section === "intro" && impactEnabled && <ImpactStrip />}
            </Fragment>
          );
        })}
      </main>
      <Footer />
      <ScrollToTop />
      <ScrollSpy sectionIds={enabledSections} />
    </>
  );
}
