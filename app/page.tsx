import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Announcements from "@/components/Announcements";
import PrayerTimes from "@/components/PrayerTimes";
import VirtualTour from "@/components/VirtualTour";
import Donate from "@/components/Donate";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="contenu">
        <Hero />
        <About />
        <Announcements />
        <PrayerTimes />
        <VirtualTour />
        <Donate />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
