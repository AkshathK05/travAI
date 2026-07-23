import { ArrowRight, Compass } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80"
          alt="Adventure travel mountain highway"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark Overlay with Blur */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Ready when you are</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Your next adventure <br className="hidden sm:inline" />
          starts here.
        </h2>

        {/* Paragraph */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Join over 50,000 smart travelers discovering optimal flights, boutique stays, and curated itineraries across the globe.
        </p>

        {/* CTA Button */}
        <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
          <a
            href="#explore"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white text-slate-900 hover:bg-blue-600 hover:text-white rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2.5"
          >
            <span>Start Planning</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Subtle trust notice */}
        <p className="text-xs text-slate-400 font-medium pt-4">
          No credit card required • Instant itinerary previews
        </p>
      </div>
    </section>
  );
}
