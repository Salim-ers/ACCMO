import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PrayerTimes from "@/components/PrayerTimes";
import Announcements from "@/components/Announcements";
import Services from "@/components/Services";
import Events from "@/components/Events";
import Donate from "@/components/Donate";
import VirtualTour from "@/components/VirtualTour";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="contenu">
        <Hero />
        <PrayerTimes />
        <Announcements />
        <Services />
        <Events />
        <VirtualTour />
        <Donate />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
