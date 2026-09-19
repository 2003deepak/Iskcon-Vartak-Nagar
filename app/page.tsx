import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WelcomeSection from "@/components/WelcomeSection";
import ExperienceCards from "@/components/ExperienceCards";
import TempleSchedule from "@/components/TempleSchedule";
import VaishnavCalendar from "@/components/VaishnavCalendar";
import DevotionInAction from "@/components/DevotionInAction";
import PrabhupadaTribute from "@/components/PrabhupadaTribute";
import GallerySection from "@/components/GallerySection";
import VisitUsSection from "@/components/VisitUsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#faf7f2]">
        <div className="flex flex-col w-full">
          <Hero />
          <WelcomeSection />
          <PrabhupadaTribute />
          <ExperienceCards />
          <TempleSchedule />
          <VaishnavCalendar />
          <GallerySection />
          <VisitUsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
