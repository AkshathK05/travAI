import { useState, useRef } from 'react';
import { Star, Heart, Calendar, DollarSign, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

export default function DestinationCarousel() {
  const [favorites, setFavorites] = useState({});
  const scrollContainerRef = useRef(null);

  const destinations = [
    {
      id: 'santorini',
      name: 'Santorini',
      country: 'Greece',
      budget: '₹1,20,000',
      season: 'May – Oct',
      rating: '4.92',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      tag: 'Iconic Coastline',
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      country: 'Japan',
      budget: '₹95,000',
      season: 'Sep – Nov',
      rating: '4.96',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      tag: 'Cultural Heritage',
    },
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      budget: '₹55,000',
      season: 'Apr – Oct',
      rating: '4.88',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      tag: 'Tropical Haven',
    },
    {
      id: 'swiss-alps',
      name: 'Swiss Alps',
      country: 'Switzerland',
      budget: '₹1,80,000',
      season: 'Dec – Mar',
      rating: '4.95',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      tag: 'Alpine Luxury',
    },
    {
      id: 'iceland',
      name: 'Iceland',
      country: 'Nordic',
      budget: '₹1,45,000',
      season: 'Sep – Apr',
      rating: '4.90',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
      tag: 'Aurora & Glaciers',
    },
    {
      id: 'dubai',
      name: 'Dubai',
      country: 'UAE',
      budget: '₹85,000',
      season: 'Nov – Mar',
      rating: '4.85',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      tag: 'Modern Wonder',
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      budget: '₹1,35,000',
      season: 'Apr – Jun',
      rating: '4.89',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      tag: 'Romance & Art',
    },
    {
      id: 'maldives',
      name: 'Maldives',
      country: 'South Asia',
      budget: '₹1,60,000',
      season: 'Nov – Apr',
      rating: '4.98',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      tag: 'Overwater Sanctuary',
    },
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="destinations" className="py-20 bg-slate-50/60 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Curated Travel Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Explore Top Destinations
            </h2>
            <p className="mt-2 text-slate-600 text-base max-w-xl">
              Hand-picked locations calculated for optimal weather, value, and memorable experiences.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline-block mr-2">
              Hover to pause auto-scroll
            </span>
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all active:scale-95"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all active:scale-95"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Continuous Auto-Scrolling Carousel with manual fallback */}
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 scroll-smooth"
          >
            {destinations.concat(destinations).map((dest, index) => (
              <div
                key={`${dest.id}-${index}`}
                className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group/card cursor-pointer flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-800 shadow-sm">
                    {dest.tag}
                  </div>

                  {/* Heart / Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(`${dest.id}-${index}`);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 flex items-center justify-center shadow-sm transition-transform active:scale-90"
                    aria-label="Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        favorites[`${dest.id}-${index}`]
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{dest.rating}</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-xs font-medium text-slate-500">{dest.country}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Est. Budget</span>
                        <span className="font-extrabold text-slate-900 text-sm">{dest.budget}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Best Season</span>
                        <span className="font-semibold text-slate-700">{dest.season}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action link */}
                  <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover/card:text-blue-600 transition-colors">
                    <span>Explore Itinerary</span>
                    <span className="text-slate-400 group-hover/card:translate-x-1 group-hover/card:text-blue-600 transition-all">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
