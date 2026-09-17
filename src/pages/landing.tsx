import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Ticker } from "@/components/site/ticker";
import { LogoBand } from "@/components/site/logo-band";
import { Stats } from "@/components/site/stats";
import { Features } from "@/components/site/features";
import { PlatformPreview } from "@/components/site/platform-preview";
import { Process } from "@/components/site/process";
import { Cta } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <LogoBand />
        <Stats />
        <Features />
        <PlatformPreview />
        <Process />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
