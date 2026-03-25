import { Benefit, BusinessLocation, NearbyBenefit } from '../types';
import { ALL_BENEFITS } from '../data/benefits';

const EARTH_RADIUS_M = 6_371_000;

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Returns benefits within radiusMeters of (lat, lon), sorted by distance. */
export function getNearbyBenefits(
  lat: number,
  lon: number,
  radiusMeters: number,
): NearbyBenefit[] {
  const nearby: NearbyBenefit[] = [];

  for (const benefit of ALL_BENEFITS) {
    if (benefit.locations.length === 0) continue;

    let nearest: BusinessLocation | null = null;
    let nearestDist = Infinity;

    for (const loc of benefit.locations) {
      const d = haversineDistance(lat, lon, loc.latitude, loc.longitude);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = loc;
      }
    }

    if (nearest && nearestDist <= radiusMeters) {
      nearby.push({
        ...benefit,
        nearestLocation: nearest,
        distanceMeters: nearestDist,
        isBestDeal: false, // filled in below
      });
    }
  }

  // Mark best deal per business (highest discountValue wins)
  const bestPerBusiness = new Map<string, number>();
  for (const b of nearby) {
    const current = bestPerBusiness.get(b.businessName) ?? -1;
    if (b.discountValue > current) bestPerBusiness.set(b.businessName, b.discountValue);
  }
  for (const b of nearby) {
    b.isBestDeal = b.discountValue === bestPerBusiness.get(b.businessName);
  }

  return nearby.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/** Among all benefits, mark each benefit whether it is the best deal for its business. */
export function withBestDealFlags(benefits: Benefit[]): (Benefit & { isBestDeal: boolean })[] {
  const bestPerBusiness = new Map<string, number>();
  for (const b of benefits) {
    const current = bestPerBusiness.get(b.businessName) ?? -1;
    if (b.discountValue > current) bestPerBusiness.set(b.businessName, b.discountValue);
  }
  return benefits.map((b) => ({
    ...b,
    isBestDeal: b.discountValue === bestPerBusiness.get(b.businessName),
  }));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
