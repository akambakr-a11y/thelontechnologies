import { SiteBackground } from "@/components/ui/SiteBackground";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Services } from "@/components/site/Services";
import { Products } from "@/components/site/Products";
import { Process } from "@/components/site/Process";
import { CTABand } from "@/components/site/CTABand";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <SiteBackground />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Products />
        <Process />
        <CTABand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
