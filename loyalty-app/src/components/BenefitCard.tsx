import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Benefit } from '../types';
import { getMembership } from '../data/memberships';
import { MembershipBadge } from './MembershipBadge';
import { BestDealBanner } from './BestDealBanner';

interface Props {
  benefit: Benefit & { isBestDeal?: boolean; distanceMeters?: number };
  onPress: () => void;
  showDistance?: boolean;
}

export function BenefitCard({ benefit, onPress, showDistance = false }: Props) {
  const membership = getMembership(benefit.membershipId);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        benefit.isBestDeal && styles.bestDealCard,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Top row: emoji + name + distance */}
      <View style={styles.header}>
        <Text style={styles.emoji}>{benefit.logoEmoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.businessName}>{benefit.businessName}</Text>
          {showDistance && benefit.distanceMeters !== undefined && (
            <Text style={styles.distance}>
              {benefit.distanceMeters < 1000
                ? `${Math.round(benefit.distanceMeters)} m unna`
                : `${(benefit.distanceMeters / 1000).toFixed(1)} km unna`}
            </Text>
          )}
        </View>
        <Text style={styles.discount}>{benefit.discountText}</Text>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {benefit.description}
      </Text>

      {/* Bottom row: badges */}
      <View style={styles.footer}>
        <MembershipBadge membershipId={benefit.membershipId} compact />
        {benefit.isBestDeal && <BestDealBanner compact />}
      </View>

      {/* Left accent bar in membership colour */}
      <View style={[styles.accentBar, { backgroundColor: membership?.color ?? '#ccc' }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    paddingLeft: 20,
  },
  bestDealCard: {
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 10,
  },
  emoji: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  discount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'right',
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
});
