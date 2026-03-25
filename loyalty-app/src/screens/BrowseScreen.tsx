import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { CATEGORIES } from '../data/categories';
import { ALL_BENEFITS, getBenefitsByCategory } from '../data/benefits';
import { MEMBERSHIPS } from '../data/memberships';
import { withBestDealFlags } from '../utils/dealUtils';
import { CategoryCard } from '../components/CategoryCard';
import { BenefitCard } from '../components/BenefitCard';

interface Props {
  navigation: any;
}

type View_ = 'kategorier' | 'alle' | string; // string for category id

export default function BrowseScreen({ navigation }: Props) {
  const [view, setView] = useState<View_>('kategorier');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMembership, setActiveMembership] = useState<string | null>(null);

  const filteredBenefits = useMemo(() => {
    let benefits = view === 'alle' || view === 'kategorier'
      ? ALL_BENEFITS
      : getBenefitsByCategory(view);

    if (activeMembership) {
      benefits = benefits.filter((b) => b.membershipId === activeMembership);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      benefits = benefits.filter(
        (b) =>
          b.businessName.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.discountText.toLowerCase().includes(q),
      );
    }

    return withBestDealFlags(benefits);
  }, [view, activeMembership, searchQuery]);

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((c) => [
          c.id,
          ALL_BENEFITS.filter((b) => b.category === c.id).length,
        ]),
      ),
    [],
  );

  const currentCategoryName = CATEGORIES.find((c) => c.id === view)?.name;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Søk etter fordeler..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Membership filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.membershipScroll}
        contentContainerStyle={styles.membershipScrollContent}
      >
        <TouchableOpacity
          style={[styles.membershipChip, activeMembership === null && styles.membershipChipActive]}
          onPress={() => setActiveMembership(null)}
        >
          <Text style={[styles.membershipChipText, activeMembership === null && styles.membershipChipTextActive]}>
            Alle
          </Text>
        </TouchableOpacity>
        {MEMBERSHIPS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.membershipChip,
              activeMembership === m.id && { backgroundColor: m.color },
            ]}
            onPress={() => setActiveMembership(activeMembership === m.id ? null : m.id)}
          >
            <Text
              style={[
                styles.membershipChipText,
                activeMembership === m.id && { color: m.textColor },
              ]}
            >
              {m.shortName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* View tabs */}
      <View style={styles.viewTabs}>
        <TouchableOpacity
          style={[styles.viewTab, view === 'kategorier' && styles.viewTabActive]}
          onPress={() => setView('kategorier')}
        >
          <Text style={[styles.viewTabText, view === 'kategorier' && styles.viewTabTextActive]}>
            Kategorier
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewTab, view === 'alle' && styles.viewTabActive]}
          onPress={() => setView('alle')}
        >
          <Text style={[styles.viewTabText, view === 'alle' && styles.viewTabTextActive]}>
            Alle fordeler
          </Text>
        </TouchableOpacity>
        {currentCategoryName && view !== 'kategorier' && view !== 'alle' && (
          <View style={[styles.viewTab, styles.viewTabActive]}>
            <Text style={[styles.viewTabText, styles.viewTabTextActive]}>
              {currentCategoryName}
            </Text>
            <TouchableOpacity onPress={() => setView('kategorier')} style={styles.closeTab}>
              <Text style={styles.closeTabText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Category grid */}
      {view === 'kategorier' && !searchQuery ? (
        <ScrollView contentContainerStyle={styles.categoriesGrid}>
          <View style={styles.grid}>
            {CATEGORIES.filter((c) => categoryCounts[c.id] > 0).map((c) => (
              <CategoryCard
                key={c.id}
                category={c}
                count={
                  activeMembership
                    ? ALL_BENEFITS.filter(
                        (b) => b.category === c.id && b.membershipId === activeMembership,
                      ).length
                    : categoryCounts[c.id]
                }
                onPress={() => setView(c.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        /* Benefits list */
        <FlatList
          data={filteredBenefits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BenefitCard
              benefit={item}
              onPress={() => navigation.navigate('BenefitDetail', { benefit: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Ingen fordeler funnet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A2E' },

  membershipScroll: { flexGrow: 0 },
  membershipScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
  },
  membershipChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  membershipChipActive: { backgroundColor: '#1A1A2E' },
  membershipChipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  membershipChipTextActive: { color: '#fff' },

  viewTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  viewTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    gap: 4,
  },
  viewTabActive: { backgroundColor: '#00529B' },
  viewTabText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  viewTabTextActive: { color: '#fff' },
  closeTab: { marginLeft: 4 },
  closeTabText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  categoriesGrid: { paddingHorizontal: 11, paddingBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },

  list: { paddingHorizontal: 16, paddingBottom: 20 },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#6B7280' },
});
