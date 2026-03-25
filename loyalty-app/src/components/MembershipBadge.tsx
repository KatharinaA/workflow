import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMembership } from '../data/memberships';

interface Props {
  membershipId: string;
  compact?: boolean;
}

export function MembershipBadge({ membershipId, compact = false }: Props) {
  const m = getMembership(membershipId);
  if (!m) return null;

  return (
    <View style={[styles.badge, { backgroundColor: m.color }, compact && styles.compact]}>
      <Text style={[styles.text, { color: m.textColor }, compact && styles.compactText]}>
        {m.shortName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
  compactText: {
    fontSize: 11,
  },
});
