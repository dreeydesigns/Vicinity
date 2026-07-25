export interface User {
  id: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  interests: string[];
}

export interface Match {
  id: string;
  compatibilityScore: number;
  sharedInterests: string[];
  triggerDistance: number;
  user: User;
}

export interface WalletContent {
  displayName: string;
  phone: string | null;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  proxyPhone: string | null;
}

export interface VenueOption {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  priceLevel: number;
  photoUrl: string | null;
  vibe: string;
  avgDateDuration: number;
  matchScore: number;
  distanceMeters: number;
  reason: string;
  openNow: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  durationMinutes: number;
  label: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read?: boolean;
  reaction?: string;
}
