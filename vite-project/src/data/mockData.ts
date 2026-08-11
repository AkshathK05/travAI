import { ChatMessage, FlightItem, HotelItem, ItineraryDay, Source, DestinationComparison } from '../types';

export const JAPAN_TRIP_SOURCES: Source[] = [
  {
    id: 'src-1',
    name: 'Google Maps & Travel Insights',
    domain: 'google.com/travel',
    url: 'https://google.com/travel',
    snippet: 'Tokyo Metropolitan Transit Pass & Shinkansen bullet train routes from Tokyo to Kyoto (2h 15m).',
    category: 'maps'
  },
  {
    id: 'src-2',
    name: 'Booking.com Japan',
    domain: 'booking.com',
    url: 'https://booking.com',
    snippet: 'Curated 4-star boutique hotels in Shinjuku & Kyoto Gion district averaging ₹7,500-₹8,500/night.',
    category: 'hotels'
  },
  {
    id: 'src-3',
    name: 'Japan National Tourism Organization',
    domain: 'japan.travel',
    url: 'https://japan.travel',
    snippet: 'Tsukiji Outer Market morning food tours, Asakusa Senso-ji temple guidelines, and Fushimi Inari shrine hours.',
    category: 'reviews'
  },
  {
    id: 'src-4',
    name: 'Skyscanner Flight Matrix',
    domain: 'skyscanner.com',
    url: 'https://skyscanner.com',
    snippet: 'Direct & 1-stop flights from India (DEL/BOM/HYD) to Tokyo Haneda/Narita starting from ₹28,500/person.',
    category: 'flights'
  },
  {
    id: 'src-5',
    name: 'Tabelog Food Guide',
    domain: 'tabelog.com',
    url: 'https://tabelog.com',
    snippet: 'Top-rated Tonkotsu Ramen alleys in Shinjuku, Matcha tea houses in Uji, and street food at Dotonbori.',
    category: 'reviews'
  }
];

export const JAPAN_FLIGHTS: FlightItem[] = [
  {
    id: 'fl-1',
    airline: 'Japan Airlines (JAL)',
    flightNo: 'JL 754',
    from: 'New Delhi',
    fromCode: 'DEL',
    fromTime: '19:05',
    to: 'Tokyo Haneda',
    toCode: 'HND',
    toTime: '06:55 (+1d)',
    duration: '7h 20m',
    stops: 'Direct',
    price: '₹34,500',
    currency: 'INR',
    class: 'Economy Standard',
    highlights: ['Complimentary authentic Japanese meal', '2x 23kg checked bags', 'Free Wi-Fi included']
  },
  {
    id: 'fl-2',
    airline: 'Singapore Airlines',
    flightNo: 'SQ 402 / SQ 638',
    from: 'Delhi / Mumbai',
    fromCode: 'DEL',
    fromTime: '21:55',
    to: 'Tokyo Narita',
    toCode: 'NRT',
    toTime: '11:40 (+1d)',
    duration: '9h 15m',
    stops: '1 Stop (SIN 1h 20m)',
    price: '₹28,800',
    currency: 'INR',
    class: 'Economy Light',
    highlights: ['Ranked #1 Airline Service', 'Changi Layover voucher included', 'Excellent inflight menu']
  }
];

export const JAPAN_HOTELS: HotelItem[] = [
  {
    id: 'ht-1',
    name: 'Hotel Gracery Shinjuku',
    location: 'Shinjuku, Tokyo',
    city: 'Tokyo',
    rating: 4.8,
    reviewsCount: 3420,
    pricePerNight: '₹8,200',
    totalPrice: '₹32,800 (4 nights)',
    currency: 'INR',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    tag: 'Top Choice for Food & Nightlife',
    highlightQuote: 'Ideal location for street food & nightlife, 3 mins walk from JR Shinjuku Station.',
    amenities: ['Free High-Speed Wi-Fi', 'Subway Access 3m', 'Breakfast Available', 'City View']
  },
  {
    id: 'ht-2',
    name: 'The Pocket Hotel Kyoto Shijo Karasuma',
    location: 'Gion / Shijo, Kyoto',
    city: 'Kyoto',
    rating: 4.7,
    reviewsCount: 1890,
    pricePerNight: '₹6,100',
    totalPrice: '₹18,300 (3 nights)',
    currency: 'INR',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tag: 'Authentic Traditional Vibe',
    highlightQuote: 'Minimalist Japanese aesthetic, right in the heart of Gion food market street.',
    amenities: ['Tatami Lounge', 'Free Matcha Station', 'Self Laundromat', 'Quiet District']
  }
];

export const JAPAN_ITINERARY: ItineraryDay[] = [
  {
    dayNumber: 1,
    title: 'DAY 1 — TOKYO: Neon Lights & Shinjuku Night Food Walk',
    subtitle: 'Arrival, hotel check-in & street food introduction',
    estimatedDayCost: '₹4,500 for two',
    morning: [
      {
        id: 'act-1',
        timeSlot: '07:30 AM',
        title: 'Land at Tokyo Haneda (HND) & Airport Express Train',
        category: 'transport',
        duration: '1.5 hours',
        cost: '₹750 / person',
        rating: 4.9,
        description: 'Pick up Suica travel card & pocket Wi-Fi at arrival hall. Take Tokyo Monorail into Shinjuku.',
        location: 'Haneda Airport Terminal 3',
        tags: ['#Transit', '#SuicaCard']
      }
    ],
    afternoon: [
      {
        id: 'act-2',
        timeSlot: '02:00 PM',
        title: 'Check-in at Hotel Gracery Shinjuku & Rest',
        category: 'relaxation',
        duration: '2 hours',
        cost: 'Included in Hotel',
        rating: 4.8,
        description: 'Unpack and refresh. Grab a quick iced matcha & egg sanddo from local 7-Eleven.',
        location: 'Shinjuku Kabukicho',
        tags: ['#Hotel', '#Rest']
      }
    ],
    evening: [
      {
        id: 'act-3',
        timeSlot: '06:30 PM',
        title: 'Omoide Yokocho (Memory Lane) Izakaya Crawl',
        category: 'food',
        duration: '3 hours',
        cost: '₹3,000 for two',
        rating: 4.9,
        description: 'Explore narrow lantern-lit alleys. Sample charcoal-grilled Yakitori skewers, Asahi beer, and handmade gyoza.',
        location: 'Omoide Yokocho, Shinjuku',
        tags: ['#FoodTour', '#Yakitori', '#MustVisit']
      }
    ]
  },
  {
    dayNumber: 2,
    title: 'DAY 2 — TOKYO: Tsukiji Seafood Market & Historic Asakusa',
    subtitle: 'Morning market feast & ancient temple culture',
    estimatedDayCost: '₹5,800 for two',
    morning: [
      {
        id: 'act-4',
        timeSlot: '08:30 AM',
        title: 'Tsukiji Outer Market Breakfast Tasting Tour',
        category: 'food',
        duration: '3 hours',
        cost: '₹3,500 for two',
        rating: 4.9,
        description: 'Taste fresh A5 Wagyu beef skewers, tamagoyaki (Japanese omelet), fresh sea urchin, and tuna sashimi bowls.',
        location: 'Tsukiji Outer Market',
        tags: ['#Seafood', '#Wagyu', '#Bucketlist']
      }
    ],
    afternoon: [
      {
        id: 'act-5',
        timeSlot: '01:30 PM',
        title: 'Senso-ji Temple & Nakamise Shopping Street',
        category: 'culture',
        duration: '2.5 hours',
        cost: 'Free Entry',
        rating: 4.8,
        description: 'Walk through Kaminarimon (Thunder Gate), draw an Omikuji fortune, and try freshly fried Ningyo-yaki cakes.',
        location: 'Asakusa',
        tags: ['#Culture', '#Temple', '#History']
      }
    ],
    evening: [
      {
        id: 'act-6',
        timeSlot: '06:00 PM',
        title: 'Michelin Bib Gourmand Tonkotsu Ramen at Ichiran Shinjuku',
        category: 'food',
        duration: '1.5 hours',
        cost: '₹1,400 for two',
        rating: 4.9,
        description: 'Private solo dining booth ramen experience with rich pork broth and custom firmness noodles.',
        location: 'Shinjuku East',
        tags: ['#Ramen', '#Iconic']
      }
    ]
  },
  {
    dayNumber: 3,
    title: 'DAY 3 — TOKYO → KYOTO: Shinkansen Bullet Train & Gion Geisha Evening',
    subtitle: 'High-speed travel across Mt. Fuji & traditional Kyoto',
    estimatedDayCost: '₹12,400 for two (Includes Shinkansen fare)',
    morning: [
      {
        id: 'act-7',
        timeSlot: '09:00 AM',
        title: 'Shinkansen Bullet Train to Kyoto (View of Mt. Fuji)',
        category: 'transport',
        duration: '2 hours 15 min',
        cost: '₹7,800 for two',
        rating: 5.0,
        description: 'Board the Nozomi Bullet Train at 300 km/h. Grab an Ekiben (station bento box) for lunch.',
        location: 'Tokyo Station → Kyoto Station',
        tags: ['#Shinkansen', '#MtFujiView']
      }
    ],
    afternoon: [
      {
        id: 'act-8',
        timeSlot: '02:00 PM',
        title: 'Check-in at The Pocket Hotel Gion & Matcha Ceremony',
        category: 'culture',
        duration: '2.5 hours',
        cost: '₹2,200 for two',
        rating: 4.8,
        description: 'Authentic 45-minute traditional Matcha whisking tea ceremony in a 150-year-old wooden Machiya house.',
        location: 'Gion District, Kyoto',
        tags: ['#Matcha', '#Culture']
      }
    ],
    evening: [
      {
        id: 'act-9',
        timeSlot: '06:30 PM',
        title: 'Pontocho Alley Riverside Kaiseki Dinner Walk',
        category: 'food',
        duration: '2.5 hours',
        cost: '₹2,400 for two',
        rating: 4.8,
        description: 'Stroll along the atmospheric Kamogawa river. Enjoy Kyoto-style vegetable tempura and local craft sake.',
        location: 'Pontocho Alley',
        tags: ['#Dinner', '#Atmospheric']
      }
    ]
  },
  {
    dayNumber: 4,
    title: 'DAY 4 — KYOTO: Fushimi Inari Torii Gates & Arashiyama Bamboo Grove',
    subtitle: 'Iconic red gates & serene bamboo forest',
    estimatedDayCost: '₹3,800 for two',
    morning: [
      {
        id: 'act-10',
        timeSlot: '06:30 AM',
        title: 'Early Morning Fushimi Inari Taisha (Avoid Crowds)',
        category: 'sightseeing',
        duration: '2.5 hours',
        cost: 'Free Entry',
        rating: 5.0,
        description: 'Hike through 10,000 vermilion Torii gates. Peaceful morning air with zero tourists.',
        location: 'Fushimi Ward, Kyoto',
        tags: ['#EarlyBird', '#ToriiGates']
      }
    ],
    afternoon: [
      {
        id: 'act-11',
        timeSlot: '12:00 PM',
        title: 'Arashiyama Bamboo Forest & Tenryu-ji Zen Garden',
        category: 'sightseeing',
        duration: '3 hours',
        cost: '₹600 entry',
        rating: 4.8,
        description: 'Walk through towering bamboo trunks, sip % Arabica coffee by the Togetsukyo Bridge.',
        location: 'Arashiyama',
        tags: ['#Nature', '#ZenGarden']
      }
    ],
    evening: [
      {
        id: 'act-12',
        timeSlot: '06:00 PM',
        title: 'Kyoto Nishiki Market Street Food Tasting',
        category: 'food',
        duration: '2 hours',
        cost: '₹2,600 for two',
        rating: 4.7,
        description: 'Known as "Kyoto\'s Kitchen". Sample soy milk donuts, octopus skewers, and dango rice cakes.',
        location: 'Nishiki Market',
        tags: ['#StreetFood', '#KyotoKitchen']
      }
    ]
  },
  {
    dayNumber: 5,
    title: 'DAY 5 — DAY TRIP TO OSAKA: Dotonbori Street Food Extravaganza',
    subtitle: 'Japan\'s street food capital (30 mins from Kyoto)',
    estimatedDayCost: '₹5,200 for two',
    morning: [
      {
        id: 'act-13',
        timeSlot: '09:30 AM',
        title: 'Local Express Train to Osaka & Osaka Castle Park',
        category: 'sightseeing',
        duration: '2.5 hours',
        cost: '₹600 for two',
        rating: 4.7,
        description: 'Short 30-minute train ride. Stroll around the moat and gardens of majestic Osaka Castle.',
        location: 'Osaka Castle',
        tags: ['#History', '#Osaka']
      }
    ],
    afternoon: [
      {
        id: 'act-14',
        timeSlot: '01:00 PM',
        title: 'Shinsekai Retro Alley & Kushikatsu Tasting',
        category: 'food',
        duration: '2.5 hours',
        cost: '₹2,200 for two',
        rating: 4.8,
        description: 'Try deep-fried skewers (Kushikatsu) with secret dipping sauce in Osaka\'s retro Showa-era district.',
        location: 'Shinsekai',
        tags: ['#Retro', '#Kushikatsu']
      }
    ],
    evening: [
      {
        id: 'act-15',
        timeSlot: '06:00 PM',
        title: 'Dotonbori Neon Canal & Takoyaki Night',
        category: 'food',
        duration: '3.5 hours',
        cost: '₹2,400 for two',
        rating: 5.0,
        description: 'Snap photos with the Glico Running Man sign. Eat piping hot Takoyaki (octopus balls) and Okonomiyaki pancakes.',
        location: 'Dotonbori Canal',
        tags: ['#Takoyaki', '#Okonomiyaki', '#Nightlife']
      }
    ]
  },
  {
    dayNumber: 6,
    title: 'DAY 6 — RETURN TO TOKYO: Shibuya Crossing & Akihabara Electric Town',
    subtitle: 'Modern tech, pop culture & sky-high city views',
    estimatedDayCost: '₹6,400 for two',
    morning: [
      {
        id: 'act-16',
        timeSlot: '10:00 AM',
        title: 'Return Shinkansen to Tokyo & Shibuya Scramble Crossing',
        category: 'transport',
        duration: '2.5 hours',
        cost: '₹3,900 for two',
        rating: 4.9,
        description: 'Walk across the world\'s busiest pedestrian intersection with 3,000 people crossing at once.',
        location: 'Shibuya',
        tags: ['#ShibuyaScramble', '#Tokyo']
      }
    ],
    afternoon: [
      {
        id: 'act-17',
        timeSlot: '03:00 PM',
        title: 'Shibuya Sky Observation Deck at Sunset',
        category: 'sightseeing',
        duration: '2 hours',
        cost: '₹2,500 for two',
        rating: 4.9,
        description: '360-degree open-air rooftop views over Tokyo skyline with views stretching to Mt. Fuji.',
        location: 'Shibuya Scramble Square 47F',
        tags: ['#Views', '#Sunset', '#TopRated']
      }
    ],
    evening: [
      {
        id: 'act-18',
        timeSlot: '07:00 PM',
        title: 'Ginza Gourmet Wagyu Beef Burger & Souvenir Hunt',
        category: 'food',
        duration: '2 hours',
        cost: '₹2,800 for two',
        rating: 4.8,
        description: 'Sample melt-in-your-mouth Wagyu burgers and grab Tokyo Banana cakes for gifts back home.',
        location: 'Ginza',
        tags: ['#Shopping', '#Wagyu']
      }
    ]
  },
  {
    dayNumber: 7,
    title: 'DAY 7 — TOKYO: Meiji Shrine & Departure',
    subtitle: 'Final serene walk before evening flight home',
    estimatedDayCost: '₹2,500 for two',
    morning: [
      {
        id: 'act-19',
        timeSlot: '09:00 AM',
        title: 'Meiji Jingu Shrine Forest Walk in Harajuku',
        category: 'culture',
        duration: '2 hours',
        cost: 'Free Entry',
        rating: 4.8,
        description: 'Peaceful 170-acre evergreen forest in the heart of Tokyo. Write your travel wishes on wooden Ema plaques.',
        location: 'Shibuya / Harajuku',
        tags: ['#Peaceful', '#Shrine']
      }
    ],
    afternoon: [
      {
        id: 'act-20',
        timeSlot: '01:00 PM',
        title: 'Final Matcha Parfait & Airport Express Train',
        category: 'transport',
        duration: '3 hours',
        cost: '₹1,500 for two',
        rating: 4.8,
        description: 'Take Haneda Express Train. Duty-free shopping at airport for Royce Chocolates & Japanese Whiskey.',
        location: 'Tokyo Haneda Airport',
        tags: ['#Departure', '#DutyFree']
      }
    ],
    evening: [
      {
        id: 'act-21',
        timeSlot: '07:25 PM',
        title: 'Board Flight Home to India',
        category: 'transport',
        duration: '8 hours',
        cost: 'Included in Flight Ticket',
        rating: 4.9,
        description: 'Fly back with lifetime memories of incredible Japanese food, temples, and culture.',
        location: 'Haneda Airport',
        tags: ['#Home']
      }
    ]
  }
];

export const BALI_VS_VIETNAM_COMPARISON: DestinationComparison[] = [
  {
    id: 'comp-1',
    destination: 'Bali, Indonesia',
    country: 'Indonesia',
    flag: '🇮🇩',
    flightCost: '₹34,000 for two',
    hotelCost: '₹24,000 (5 nights villa)',
    foodCost: '₹14,000',
    transportCost: '₹6,000 (Scooter/Gojek)',
    totalEstCost: '₹78,000 total',
    weather: '27°C Sunny & Tropical',
    vibe: 'Beach Clubs, Rice Terraces & Yoga',
    bestFor: 'Relaxed Beach Vibe & Luxury Private Pool Villas',
    recommendationBadge: 'Best for Private Villas & Beaches',
    pros: ['Private pool villas within ₹4k/night', 'Stunning cliffside sunsets at Uluwatu', 'Great coffee & smoothie bowl cafes'],
    cons: ['Heavy traffic in Canggu/Ubud', 'Slightly higher flight times from India (7-8h)']
  },
  {
    id: 'comp-2',
    destination: 'Da Nang & Hoi An, Vietnam',
    country: 'Vietnam',
    flag: '🇻🇳',
    flightCost: '₹28,000 for two',
    hotelCost: '₹18,000 (5 nights 4-star)',
    foodCost: '₹10,000 (Unbeatable value)',
    transportCost: '₹4,000 (Grab rides)',
    totalEstCost: '₹60,000 total',
    weather: '25°C Pleasant Breeze',
    vibe: 'Lantern Streets, Coffee & Heritage',
    bestFor: 'Culture, Incredible Street Food & Unbeatable Value',
    recommendationBadge: 'Top Budget & Food Value',
    pros: ['₹1.50 lakh easily buys luxury luxury here', 'World-class Pho & Egg Coffee for ₹150', 'Hoi An Ancient Town lantern lighting'],
    cons: ['Sea water is cooler than Bali', 'Nightlife is more low-key']
  }
];

export const INITIAL_JAPAN_RESPONSE = `I have created a complete **7-Day Food & Culture Itinerary for 2 People in Japan**, carefully structured to stay comfortably within your **₹1.5 Lakh budget**! 

### Budget Summary Breakdown:
- **Roundtrip Flights (2 pax):** ₹58,000 - ₹69,000 (via JAL / Singapore Air)
- **Boutique Hotels (6 Nights):** ₹51,100 (Shinjuku, Tokyo + Gion, Kyoto)
- **Food & Dining Allowance:** ₹22,000 (Street markets, Ramen, Izakayas)
- **Intercity Transit & Passes:** ₹12,000 (Shinkansen + Suica metro cards)
- **Activities & Entry Fees:** ₹6,900 (Shibuya Sky, Matcha ceremony, Temples)
- **ESTIMATED TOTAL:** **₹1,49,900 for 2 adults** *(100% within your ₹1.5L cap!)*

Here are your recommended flights, top-rated hotels, and day-by-day itinerary below:`;

export const CHEAPER_DAY3_RESPONSE = `Here is an optimized, cost-reduced version of **Day 3 (Tokyo to Kyoto)** that saves **₹4,200** for your trip:

1. **Transport Alternative:** Instead of the Nozomi Express Shinkansen, book the **Willer Express Overnight Bus** or advance-purchase **Kintetsu Local Express**, saving **₹3,200 for two**.
2. **Dining Adjustment:** Swap the formal Pontocho Kaiseki set dinner for **Gion Omakase Bento & Local Yakitori at Gion Sukiya**, saving **₹1,000 for two** while still enjoying authentic local flavors.

**New Day 3 Estimated Cost:** **₹8,200 for two** *(down from ₹12,400)*. This gives you extra buffer for shopping in Tokyo!`;

export const MORE_FOOD_RESPONSE = `Awesome! I have expanded the culinary footprint with 4 high-priority street food additions:

1. **Tokyo (Day 2 Evening):** Added **Omoide Yokocho Skewer Alley** hidden gem stall *Tsukada* (famous for grilled chicken skin & garlic butter oysters).
2. **Kyoto (Day 4 Lunch):** Included **Nishiki Market\'s 100-year-old Tofu Doughnut shop** and fresh grilled baby octopus stuffed with quail egg.
3. **Osaka (Day 5 Afternoon):** Added **Mizuno Okonomiyaki in Dotonbori** (Michelin-recommended Japanese savory pancake made with mountain yam).
4. **Tokyo (Day 6 Snack):** Included **Ginza Kagari\'s famous Tori Paitan (Rich Chicken Cream Ramen)**.`;

export function getMockResponseForInput(input: string): Partial<ChatMessage> {
  const lower = input.toLowerCase();

  if (lower.includes('japan') || lower.includes('1.5 lakh') || lower.includes('food')) {
    return {
      content: INITIAL_JAPAN_RESPONSE,
      sources: JAPAN_TRIP_SOURCES,
      flights: JAPAN_FLIGHTS,
      hotels: JAPAN_HOTELS,
      itinerary: JAPAN_ITINERARY,
      followUpSuggestions: [
        '⚡ Make Day 3 cheaper',
        '🍣 Add more food experiences in Osaka',
        '🏨 Swap hotel to Shibuya area',
        '⚖️ Compare Japan with Vietnam for ₹1.5L'
      ],
      costSummary: {
        flights: '₹58,000',
        hotels: '₹51,100',
        activities: '₹6,900',
        transport: '₹12,000',
        total: '₹1,49,900',
        budget: '₹1,50,000',
        withinBudget: true
      }
    };
  }

  if (lower.includes('compare') || lower.includes('bali') || lower.includes('vietnam')) {
    return {
      content: `Here is a side-by-side comparison between **Bali (Indonesia)** and **Da Nang / Hoi An (Vietnam)** for a 5-day trip under **₹80,000 for two people**. Both offer incredible value, but suit different travel styles!`,
      sources: JAPAN_TRIP_SOURCES.slice(0, 3),
      comparison: BALI_VS_VIETNAM_COMPARISON,
      followUpSuggestions: [
        '🌴 Build 5-day Vietnam itinerary under ₹80k',
        '🌺 Build 5-day Bali itinerary under ₹80k',
        '✈️ Find cheapest flights from India'
      ],
      costSummary: {
        flights: '₹28,000',
        hotels: '₹18,000',
        activities: '₹8,000',
        transport: '₹4,000',
        total: '₹58,000',
        budget: '₹80,000',
        withinBudget: true
      }
    };
  }

  // Fallback dynamic generator for any input
  return {
    content: `I have analyzed options for **"${input}"**. Based on current travel trends, weather forecasts, and flight matrix data, here is a tailored recommendation!

### Key Highlights:
- **Optimal Travel Season:** October to April (pleasant weather, low precipitation)
- **Estimated Budget Range:** ₹65,000 - ₹1,20,000 per person
- **Recommended Trip Length:** 5 to 7 Days for full immersion

Below are hand-picked flights, hotel recommendations, and a day-by-day plan crafted for your trip:`,
    sources: JAPAN_TRIP_SOURCES.slice(0, 3),
    flights: JAPAN_FLIGHTS.slice(0, 1),
    hotels: JAPAN_HOTELS.slice(0, 1),
    itinerary: JAPAN_ITINERARY.slice(0, 3),
    followUpSuggestions: [
      '💰 Make this trip cheaper',
      '🏨 Show luxury hotel options',
      '✈️ Show direct flights only',
      '🗺️ Add 2 more days to itinerary'
    ],
    costSummary: {
      flights: '₹48,000',
      hotels: '₹36,000',
      activities: '₹12,000',
      transport: '₹8,000',
      total: '₹1,04,000',
      budget: '₹1,20,000',
      withinBudget: true
    }
  };
}
