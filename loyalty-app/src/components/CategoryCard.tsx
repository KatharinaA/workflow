import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../types';

interface Props {
  category: Category;
  count: number;
  onPress: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  mat:         '#E8F5E9',
  elektronikk: '#E3F2FD',
  bygg:        '#FFF3E0',
  sport:       '#FCE4EC',
  helse:       '#F3E5F5',
  bil:         '#E0F7FA',
  reise:       '#EDE7F6',
  forsikring:  '#E8EAF6',
  kino:        '#FBE9E7',
  mote:        '#FFF8E1',
};

const CATEGORY_ICON_COLORS: Record<string, string> = {
  mat:         '#2E7D32',
  elektronikk: '#1565C0',
  bygg:        '#E65100',
  sport:       '#AD1457',
  helse:       '#6A1B9A',
  bil:         '#00695C',
  reise:       '#4527A0',
  forsikring:  '#283593',
  kino:        '#BF360C',
  mote:        '#F57F17',
};

export function CategoryCard({ category, count, onPress }: Props) {
  const bg = CATEGORY_COLORS[category.id] ?? '#F5F5F5';
  const iconBg = CATEGORY_ICON_COLORS[category.id] ?? '#888';

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg + '22' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
      </View>
      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.count}>{count} fordel{count !== 1 ? 'er' : ''}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 26,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 2,
  },
  count: {
    fontSize: 11,
    color: '#6B7280',
  },
});
