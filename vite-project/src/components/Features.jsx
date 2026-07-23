import { Plane, Hotel, Sparkles, Sun, ShieldCheck, Wallet } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Plane,
      title: 'Flight Comparison',
      description: 'Scans layovers, legroom metrics, and baggage conditions across 400+ airlines to find your sweet spot flight.',
      badge: 'Real-time Feeds',
    },
    {
      icon: Hotel,
      title: 'Hotel Comparison',
      description: 'Filters beyond plain ratings to match your vibe—from secluded boutique retreats to high-speed digital nomad stays.',
      badge: 'Vibe Matching',
    },
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Adapts to your pace and preferences, synthesizing live local trends into bespoke daily travel suggestions.',
      badge: 'Tailored Feed',
    },
    {
      icon: Sun,
      title: 'Weather Intelligence',
      description: 'Predictive climate modeling ensures your outdoor excursions coincide with peak daylight and clear skies.',
      badge: 'Hyper-local',
    },
    {
      icon: ShieldCheck,
      title: 'Visa Assistant',
      description: 'Instant passport validity checks, entry requirement updates, and automated visa application timelines.',
      badge: 'Auto Updates',
    },
    {
      icon: Wallet,
      title: 'Budget Optimizer',
      description: 'Dynamically shifts your spend to maximize luxury—reallocating flight savings directly into upgraded stays.',
      badge: 'Savings Engine',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Why Choose travAI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Intelligence that works silently. <br className="hidden sm:inline" />
            So you can focus on the journey.
          </h2>
          <p className="text-base text-slate-600 font-normal">
            No robotic gimmickry or glowing sci-fi clutter. Just clean, invisible technology designed to save you time and money.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Card Footer Indicator */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Learn more</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
