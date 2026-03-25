import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  compact?: boolean;
}

export function BestDealBanner({ compact = false }: Props) {
  return (
    <View style={[styles.banner, compact && styles.compact]}>
      <Text style={[styles.star, compact && styles.compactStar]}>★</Text>
      <Text style={[styles.text, compact && styles.compactText]}>Beste tilbud</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  compact: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  star: {
    fontSize: 13,
    color: '#8B6914',
  },
  compactStar: {
    fontSize: 11,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A4108',
  },
  compactText: {
    fontSize: 10,
  },
});
