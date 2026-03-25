import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { NearbyBenefit } from '../types';
import { getNearbyBenefits } from '../utils/dealUtils';

const DEFAULT_RADIUS_M = 500;
const LOCATION_UPDATE_INTERVAL_MS = 30_000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNearbyBenefits(alertsEnabled: boolean, radiusMeters = DEFAULT_RADIUS_M) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyBenefits, setNearbyBenefits] = useState<NearbyBenefit[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const notifiedBenefitIds = useRef(new Set<string>());

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: LOCATION_UPDATE_INTERVAL_MS,
          distanceInterval: 50,
        },
        (loc) => setLocation(loc),
      );

      setLoading(false);
    }

    startTracking();
    return () => { subscription?.remove(); };
  }, []);

  useEffect(() => {
    if (!location) return;

    const { latitude, longitude } = location.coords;
    const nearby = getNearbyBenefits(latitude, longitude, radiusMeters);
    setNearbyBenefits(nearby);

    if (!alertsEnabled) return;

    // Notify about new nearby best deals
    for (const benefit of nearby) {
      if (!benefit.isBestDeal) continue;
      if (notifiedBenefitIds.current.has(benefit.id)) continue;

      notifiedBenefitIds.current.add(benefit.id);
      Notifications.scheduleNotificationAsync({
        content: {
          title: `Fordel i nærheten: ${benefit.businessName}`,
          body: `${benefit.discountText} — ${benefit.description.slice(0, 80)}…`,
          data: { benefitId: benefit.id },
        },
        trigger: null, // send immediately
      });
    }
  }, [location, radiusMeters, alertsEnabled]);

  return { location, nearbyBenefits, permissionStatus, loading };
}
