export interface Membership {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  textColor: string;
  description: string;
}

export interface BusinessLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

export interface Benefit {
  id: string;
  membershipId: string;
  businessName: string;
  description: string;
  discountText: string;
  discountValue: number; // 0–100, percentage equivalent, used for best-deal comparison
  category: string;
  locations: BusinessLocation[];
  validUntil?: string;
  website?: string;
  terms?: string;
  logoEmoji: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface NearbyBenefit extends Benefit {
  nearestLocation: BusinessLocation;
  distanceMeters: number;
  isBestDeal: boolean;
}
