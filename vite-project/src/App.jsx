import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DestinationCarousel from './components/DestinationCarousel';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <DestinationCarousel />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
