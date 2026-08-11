export interface ThinkingStep {
  id: string;
  text: string;
  status: 'pending' | 'in_progress' | 'completed';
  timestamp?: string;
}

export interface Source {
  id: string;
  name: string;
  domain: string;
  url: string;
  snippet: string;
  category?: 'flights' | 'hotels' | 'maps' | 'reviews' | 'weather';
}

export interface FlightItem {
  id: string;
  airline: string;
  flightNo: string;
  logoUrl?: string;
  from: string;
  fromCode: string;
  fromTime: string;
  to: string;
  toCode: string;
  toTime: string;
  duration: string;
  stops: string;
  price: string;
  currency: string;
  class: string;
  highlights: string[];
}

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: string;
  totalPrice: string;
  currency: string;
  image: string;
  tag: string;
  highlightQuote: string;
  amenities: string[];
}

export interface ActivityItem {
  id: string;
  timeSlot?: string;
  title: string;
  category: 'food' | 'culture' | 'sightseeing' | 'transport' | 'shopping' | 'relaxation';
  duration: string;
  cost: string;
  rating: number;
  description: string;
  location: string;
  tags: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr?: string;
  title: string;
  subtitle: string;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  estimatedDayCost: string;
  hotelRecommendation?: string;
}

export interface DestinationComparison {
  id: string;
  destination: string;
  country: string;
  flag: string;
  flightCost: string;
  hotelCost: string;
  foodCost: string;
  transportCost: string;
  totalEstCost: string;
  weather: string;
  vibe: string;
  bestFor: string;
  recommendationBadge?: string;
  pros: string[];
  cons: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  thinkingSteps?: ThinkingStep[];
  thinkingTimeSeconds?: number;
  sources?: Source[];
  flights?: FlightItem[];
  hotels?: HotelItem[];
  activities?: ActivityItem[];
  itinerary?: ItineraryDay[];
  comparison?: DestinationComparison[];
  followUpSuggestions?: string[];
  costSummary?: {
    flights: string;
    hotels: string;
    activities: string;
    transport: string;
    total: string;
    budget: string;
    withinBudget: boolean;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
}
