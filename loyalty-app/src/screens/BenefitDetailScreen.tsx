import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Benefit } from '../types';
import { getMembership } from '../data/memberships';
import { getCategoryById } from '../data/categories';
import { getBenefitsForBusiness } from '../data/benefits';
import { MembershipBadge } from '../components/MembershipBadge';
import { BestDealBanner } from '../components/BestDealBanner';

interface Props {
  route: { params: { benefit: Benefit & { isBestDeal?: boolean } } };
  navigation: any;
}

export default function BenefitDetailScreen({ route, navigation }: Props) {
  const { benefit } = route.params;
  const membership = getMembership(benefit.membershipId);
  const category = getCategoryById(benefit.category);

  // Other benefits at the same business
  const otherBenefits = getBenefitsForBusiness(benefit.businessName).filter(
    (b) => b.id !== benefit.id,
  );

  const openMaps = (lat: number, lon: number, address: string) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const url = Platform.select({
      ios: `${scheme}${encodeURIComponent(address)}`,
      android: `${scheme}${encodeURIComponent(address)}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: membership?.color ?? '#1A1A2E' }]}>
        <Text style={styles.heroEmoji}>{benefit.logoEmoji}</Text>
        <Text style={styles.heroDiscount}>{benefit.discountText}</Text>
        <Text style={styles.heroBusiness}>{benefit.businessName}</Text>
        <View style={styles.heroBadges}>
          <MembershipBadge membershipId={benefit.membershipId} />
          {benefit.isBestDeal && <BestDealBanner />}
        </View>
      </View>

      {/* Category */}
      {category && (
        <View style={styles.section}>
          <Text style={styles.categoryChip}>
            {category.icon} {category.name}
          </Text>
        </View>
      )}

      {/* Description */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Om fordelen</Text>
        <Text style={styles.description}>{benefit.description}</Text>
      </View>

      {/* Terms */}
      {benefit.terms && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Betingelser</Text>
          <Text style={styles.terms}>{benefit.terms}</Text>
        </View>
      )}

      {/* Locations */}
      {benefit.locations.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            Butikker ({benefit.locations.length})
          </Text>
          {benefit.locations.map((loc, i) => (
            <TouchableOpacity
              key={i}
              style={styles.locationRow}
              onPress={() => openMaps(loc.latitude, loc.longitude, loc.address)}
            >
              <Text style={styles.locationIcon}>📍</Text>
              <View style={styles.locationText}>
                <Text style={styles.locationAddress}>{loc.address}</Text>
                <Text style={styles.locationCity}>{loc.city}</Text>
              </View>
              <Text style={styles.locationArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Website */}
      {benefit.website && (
        <TouchableOpacity
          style={[styles.websiteButton, { backgroundColor: membership?.color ?? '#1A1A2E' }]}
          onPress={() => Linking.openURL(benefit.website!)}
        >
          <Text style={styles.websiteButtonText}>Gå til {benefit.businessName} →</Text>
        </TouchableOpacity>
      )}

      {/* Other deals at same business */}
      {otherBenefits.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Andre fordeler hos {benefit.businessName}</Text>
          {otherBenefits.map((b, i) => {
            const m = getMembership(b.membershipId);
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.otherDealRow, i < otherBenefits.length - 1 && styles.otherDealBorder]}
                onPress={() => navigation.replace('BenefitDetail', { benefit: b })}
              >
                <View style={[styles.otherDealAccent, { backgroundColor: m?.color ?? '#ccc' }]} />
                <View style={styles.otherDealText}>
                  <Text style={styles.otherDealMembership}>{m?.shortName}</Text>
                  <Text style={styles.otherDealDiscount}>{b.discountText}</Text>
                </View>
                <Text style={styles.otherDealArrow}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Fordelen er tilgjengelig via ditt {membership?.name}-medlemskap.
          {benefit.validUntil ? ` Gjelder til ${benefit.validUntil}.` : ''}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { paddingBottom: 40 },

  hero: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroDiscount: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 4 },
  heroBusiness: { fontSize: 20, fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: 14 },
  heroBadges: { flexDirection: 'row', gap: 8 },

  section: { paddingHorizontal: 16, paddingTop: 14 },
  categoryChip: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: '#374151',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  description: { fontSize: 15, color: '#374151', lineHeight: 22 },
  terms: { fontSize: 13, color: '#6B7280', lineHeight: 20 },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  locationIcon: { fontSize: 18 },
  locationText: { flex: 1 },
  locationAddress: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  locationCity: { fontSize: 12, color: '#6B7280' },
  locationArrow: { fontSize: 16, color: '#9CA3AF' },

  websiteButton: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  websiteButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  otherDealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  otherDealBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  otherDealAccent: { width: 4, height: 36, borderRadius: 2 },
  otherDealText: { flex: 1 },
  otherDealMembership: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  otherDealDiscount: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  otherDealArrow: { fontSize: 22, color: '#9CA3AF' },

  footer: { marginHorizontal: 16, marginTop: 20 },
  footerText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 18 },
});
