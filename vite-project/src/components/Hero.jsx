import { useState } from 'react';
import { Search, ArrowRight, Sparkles, MapPin, Sun, Ticket, Compass } from 'lucide-react';

export default function Hero() {
  const [searchValue, setSearchValue] = useState('');

  const samplePrompts = [
    '7-day Japan trip under ₹90,000',
    'Quiet Bali villa with private pool',
    'Swiss Alps winter ski itinerary',
    'Amalfi coast summer flight deals',
  ];

  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Search */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Travel Intelligence Engine</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Travel Smarter. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600">
                  Explore Further.
                </span>
              </h1>
              <p className="pt-2 text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Discover tailored itineraries, price predictions, and hidden local gems effortlessly. Your personal travel intelligence concierge.
              </p>
            </div>

            {/* Large Search Bar */}
            <div className="space-y-3">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Plan a 7-day Japan trip under ₹90,000"
                  className="w-full bg-transparent px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                />
                <button 
                  onClick={() => searchValue && alert(`Searching for: "${searchValue}"`)}
                  className="px-5 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample prompt pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Try asking:</span>
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchValue(prompt)}
                    className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#destinations"
                className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#carousel"
                className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50 rounded-full font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Explore Destinations</span>
              </a>
            </div>

            {/* Trust Stats */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-8 text-xs text-slate-500">
              <div>
                <span className="block text-slate-900 font-bold text-sm">400+ Airlines</span>
                <span>Real-time price intelligence</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <span className="block text-slate-900 font-bold text-sm">120+ Countries</span>
                <span>Curated destination guides</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase Image with Floating Widgets */}
          <div className="lg:col-span-6 relative">
            
            {/* Background Accent Blur */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 via-slate-100 to-indigo-100 rounded-3xl filter blur-2xl opacity-60 -z-10"></div>

            {/* Main Premium Photography Wrapper */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-slate-200/80 bg-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                alt="Tropical travel paradise beach"
                className="w-full h-[460px] sm:h-[540px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Soft Gradient Overlay at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>

              {/* Floating Badge 1: Destination Badge (Top Left) */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md border border-white/40 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Kyoto, Japan</div>
                  <div className="text-[11px] font-medium text-slate-500">9.8 Match Score • Autumn Peak</div>
                </div>
              </div>

              {/* Floating Badge 2: Weather Badge (Top Right) */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md border border-white/40 px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-delayed">
                <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900">24°C • Sunny</div>
                  <div className="text-[10px] text-slate-500">Ideal walking conditions</div>
                </div>
              </div>

              {/* Floating Badge 3: Flight Ticket Price Card (Bottom Right) */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-xl max-w-xs animate-float">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Flight Price Drop</span>
                      <span className="block text-[10px] text-slate-500">Delhi → Tokyo (NRT)</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    -24%
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Est. Round Trip:</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹42,500</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
