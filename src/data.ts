import { Match, WalletContent, VenueOption, TimeSlot } from './types';

export const mockMatch: Match = {
  id: 'match_123',
  compatibilityScore: 92,
  sharedInterests: ['coffee', 'design', 'hiking', 'tech'],
  triggerDistance: 45,
  user: {
    id: 'user_456',
    displayName: 'Alex Rivers',
    bio: 'Product designer by day, amateur barista by night. Always looking for the perfect espresso.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    interests: ['coffee', 'design', 'hiking', 'tech', 'photography'],
  },
};

export const mockWalletContent: WalletContent = {
  displayName: 'Alex Rivers',
  phone: '+1 (555) 234-5678',
  proxyPhone: '+1 (555) 999-0123',
  email: 'alex.rivers@example.com',
  bio: 'Product designer by day, amateur barista by night. Always looking for the perfect espresso.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

export const mockVenues: VenueOption[] = [
  {
    id: 'venue_1',
    name: 'Ozone Coffee Roasters',
    address: '11 Leonard St, London EC2A 4AQ',
    category: 'cafe',
    rating: 4.8,
    priceLevel: 2,
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    vibe: 'cozy',
    avgDateDuration: 60,
    matchScore: 95,
    distanceMeters: 350,
    reason: 'Perfect for coffee lovers',
    openNow: true,
  },
  {
    id: 'venue_2',
    name: 'Nightjar',
    address: '129 City Rd, London EC1V 1JB',
    category: 'bar',
    rating: 4.6,
    priceLevel: 3,
    photoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
    vibe: 'romantic',
    avgDateDuration: 90,
    matchScore: 88,
    distanceMeters: 800,
    reason: 'Top rated near you',
    openNow: true,
  },
  {
    id: 'venue_3',
    name: 'Victoria Park',
    address: 'Grove Rd, London E3 5TB',
    category: 'park',
    rating: 4.9,
    priceLevel: 1,
    photoUrl: 'https://images.unsplash.com/photo-1494541314959-1e37bc903332?auto=format&fit=crop&w=600&q=80',
    vibe: 'adventurous',
    avgDateDuration: 120,
    matchScore: 82,
    distanceMeters: 1500,
    reason: 'Great for hiking fans',
    openNow: true,
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const mockTimeSlots: TimeSlot[] = [
  {
    start: new Date(today.setHours(18, 0, 0, 0)).toISOString(),
    end: new Date(today.setHours(19, 0, 0, 0)).toISOString(),
    durationMinutes: 60,
    label: 'evening',
  },
  {
    start: new Date(today.setHours(19, 30, 0, 0)).toISOString(),
    end: new Date(today.setHours(21, 0, 0, 0)).toISOString(),
    durationMinutes: 90,
    label: 'evening',
  },
  {
    start: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
    durationMinutes: 60,
    label: 'morning',
  },
];
