import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNearbyBenefits } from '../hooks/useNearbyBenefits';
import { NearbyBenefit } from '../types';
import { getMembership } from '../data/memberships';
import { MembershipBadge } from '../components/MembershipBadge';
import { BestDealBanner } from '../components/BestDealBanner';
import { formatDistance } from '../utils/dealUtils';

interface Props {
  navigation: any;
  alertsEnabled: boolean;
}

const RADIUS_OPTIONS = [250, 500, 1000, 2000];

export default function MapScreen({ navigation, alertsEnabled }: Props) {
  const [radius, setRadius] = useState(500);
  const [selectedBenefit, setSelectedBenefit] = useState<NearbyBenefit | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { location, nearbyBenefits, permissionStatus, loading } = useNearbyBenefits(
    alertsEnabled,
    radius,
  );

  const showCard = useCallback((benefit: NearbyBenefit) => {
    setSelectedBenefit(benefit);
    Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true }).start();
  }, [slideAnim]);

  const hideCard = useCallback(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
      setSelectedBenefit(null),
    );
  }, [slideAnim]);

  const markerColor = (benefit: NearbyBenefit) =>
    getMembership(benefit.membershipId)?.color ?? '#888';

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionEmoji}>📍</Text>
        <Text style={styles.permissionTitle}>Posisjon ikke tilatt</Text>
        <Text style={styles.permissionBody}>
          Aktiver posisjon i telefoninnstillingene for å se fordeler i nærheten.
        </Text>
      </View>
    );
  }

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : {
        latitude: 59.9139,
        longitude: 10.7522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        onPress={hideCard}
      >
        {/* Search radius circle */}
        {location && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={radius}
            strokeColor="rgba(0,82,155,0.4)"
            fillColor="rgba(0,82,155,0.07)"
          />
        )}

        {/* Benefit markers */}
        {nearbyBenefits.map((benefit) => (
          <Marker
            key={`${benefit.id}-${benefit.nearestLocation.latitude}`}
            coordinate={{
              latitude: benefit.nearestLocation.latitude,
              longitude: benefit.nearestLocation.longitude,
            }}
            onPress={() => showCard(benefit)}
          >
            <View
              style={[
                styles.markerBubble,
                { backgroundColor: markerColor(benefit) },
                benefit.isBestDeal && styles.markerBestDeal,
              ]}
            >
              <Text style={styles.markerEmoji}>{benefit.logoEmoji}</Text>
              {benefit.isBestDeal && <Text style={styles.markerStar}>★</Text>}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Radius selector */}
      <View style={styles.radiusBar}>
        {RADIUS_OPTIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.radiusButton, radius === r && styles.radiusButtonActive]}
            onPress={() => setRadius(r)}
          >
            <Text style={[styles.radiusText, radius === r && styles.radiusTextActive]}>
              {r < 1000 ? `${r} m` : `${r / 1000} km`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Count badge */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {nearbyBenefits.length} fordel{nearbyBenefits.length !== 1 ? 'er' : ''} i nærheten
        </Text>
      </View>

      {/* Selected benefit card */}
      {selectedBenefit && (
        <Animated.View
          style={[
            styles.benefitCard,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.cardClose} onPress={hideCard}>
            <Text style={styles.cardCloseText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>{selectedBenefit.logoEmoji}</Text>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardBusiness}>{selectedBenefit.businessName}</Text>
              <Text style={styles.cardAddress}>
                {selectedBenefit.nearestLocation.address},{' '}
                {selectedBenefit.nearestLocation.city}
              </Text>
            </View>
            <Text style={styles.cardDiscount}>{selectedBenefit.discountText}</Text>
          </View>

          <Text style={styles.cardDescription}>{selectedBenefit.description}</Text>

          <View style={styles.cardFooter}>
            <MembershipBadge membershipId={selectedBenefit.membershipId} />
            {selectedBenefit.isBestDeal && <BestDealBanner />}
            <Text style={styles.cardDistance}>
              {formatDistance(selectedBenefit.distanceMeters)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => {
              hideCard();
              navigation.navigate('BenefitDetail', { benefit: selectedBenefit });
            }}
          >
            <Text style={styles.detailButtonText}>Se detaljer →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Nearby list (collapsed, swipe up hint) */}
      {nearbyBenefits.length > 0 && !selectedBenefit && (
        <TouchableOpacity
          style={styles.nearbyHint}
          onPress={() => navigation.navigate('NearbyList', { benefits: nearbyBenefits })}
        >
          <Text style={styles.nearbyHintText}>
            Se alle {nearbyBenefits.length} fordeler i nærheten ↑
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
  },
  permissionEmoji: { fontSize: 56, marginBottom: 16 },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  permissionBody: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 },

  radiusBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 16,
    alignItems: 'center',
  },
  radiusButtonActive: { backgroundColor: '#00529B' },
  radiusText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  radiusTextActive: { color: '#fff' },

  countBadge: {
    position: 'absolute',
    top: 68,
    alignSelf: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  countText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  markerBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  markerBestDeal: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  markerEmoji: { fontSize: 16 },
  markerStar: { fontSize: 12, color: '#FFD700' },

  benefitCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 12,
  },
  cardClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCloseText: { fontSize: 14, color: '#6B7280' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  cardEmoji: { fontSize: 36 },
  cardHeaderText: { flex: 1 },
  cardBusiness: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  cardAddress: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  cardDiscount: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  cardDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 14 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardDistance: { fontSize: 13, color: '#6B7280', marginLeft: 'auto' },
  detailButton: {
    backgroundColor: '#00529B',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  detailButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  nearbyHint: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  nearbyHintText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
