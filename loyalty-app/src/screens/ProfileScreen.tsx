import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { MEMBERSHIPS } from '../data/memberships';
import { getBenefitsByMembership } from '../data/benefits';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { ALL_BENEFITS } from '../data/benefits';

interface Props {
  alertsEnabled: boolean;
  onToggleAlerts: (value: boolean) => void;
  navigation: any;
}

export default function ProfileScreen({ alertsEnabled, onToggleAlerts, navigation }: Props) {
  const [alertRadius, setAlertRadius] = useState(500);

  const totalBenefits = ALL_BENEFITS.length;
  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, ALL_BENEFITS.filter((b) => b.category === c.id).length]),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mine fordeler</Text>
        <Text style={styles.headerSubtitle}>{totalBenefits} fordeler fra {MEMBERSHIPS.length} program</Text>
      </View>

      {/* Memberships */}
      <Text style={styles.sectionTitle}>Medlemskap</Text>
      {MEMBERSHIPS.map((m) => {
        const benefits = getBenefitsByMembership(m.id);
        return (
          <View key={m.id} style={[styles.membershipCard, { borderLeftColor: m.color }]}>
            <View style={styles.membershipHeader}>
              <View style={[styles.membershipDot, { backgroundColor: m.color }]} />
              <Text style={styles.membershipName}>{m.name}</Text>
              <Text style={styles.membershipCount}>{benefits.length} fordeler</Text>
            </View>
            <Text style={styles.membershipDescription}>{m.description}</Text>

            {/* Top benefits preview */}
            <View style={styles.benefitPreview}>
              {benefits.slice(0, 3).map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={styles.benefitChip}
                  onPress={() => navigation.navigate('BenefitDetail', { benefit: b })}
                >
                  <Text style={styles.benefitChipEmoji}>{b.logoEmoji}</Text>
                  <Text style={styles.benefitChipText}>{b.businessName}</Text>
                  <Text style={[styles.benefitChipDiscount, { color: m.color }]}>
                    {b.discountText}
                  </Text>
                </TouchableOpacity>
              ))}
              {benefits.length > 3 && (
                <TouchableOpacity
                  style={styles.showAllButton}
                  onPress={() => navigation.navigate('Browse')}
                >
                  <Text style={[styles.showAllText, { color: m.color }]}>
                    Se alle {benefits.length} fordeler →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {/* Notification settings */}
      <Text style={styles.sectionTitle}>Varsler i nærheten</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Aktiver stedsvarsler</Text>
            <Text style={styles.settingDescription}>
              Få varsel når du er i nærheten av en butikk med fordeler
            </Text>
          </View>
          <Switch
            value={alertsEnabled}
            onValueChange={onToggleAlerts}
            trackColor={{ false: '#D1D5DB', true: '#00529B' }}
            thumbColor="#fff"
          />
        </View>

        {alertsEnabled && (
          <>
            <View style={styles.divider} />
            <Text style={styles.settingLabel}>Varslingsradius</Text>
            <Text style={styles.settingDescription}>
              Varsle meg når en fordel er innenfor:
            </Text>
            <View style={styles.radiusOptions}>
              {[250, 500, 1000, 2000].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.radiusOption, alertRadius === r && styles.radiusOptionActive]}
                  onPress={() => setAlertRadius(r)}
                >
                  <Text style={[styles.radiusOptionText, alertRadius === r && styles.radiusOptionTextActive]}>
                    {r < 1000 ? `${r} m` : `${r / 1000} km`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Category overview */}
      <Text style={styles.sectionTitle}>Fordeler etter kategori</Text>
      <View style={styles.categoryOverview}>
        {CATEGORIES.filter((c) => categoryCounts[c.id] > 0).map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.categoryRow}
            onPress={() => navigation.navigate('Browse', { initialCategory: c.id })}
          >
            <Text style={styles.categoryIcon}>{c.icon}</Text>
            <Text style={styles.categoryName}>{c.name}</Text>
            <View style={styles.categoryBar}>
              <View
                style={[
                  styles.categoryBarFill,
                  { width: `${(categoryCounts[c.id] / totalBenefits) * 100 * 3}%` },
                ]}
              />
            </View>
            <Text style={styles.categoryCount}>{categoryCounts[c.id]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { paddingBottom: 40 },

  header: {
    backgroundColor: '#1A1A2E',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },

  membershipCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  membershipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  membershipDot: { width: 10, height: 10, borderRadius: 5 },
  membershipName: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', flex: 1 },
  membershipCount: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  membershipDescription: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 12 },

  benefitPreview: { gap: 6 },
  benefitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  benefitChipEmoji: { fontSize: 18 },
  benefitChipText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
  benefitChipDiscount: { fontSize: 13, fontWeight: '700' },
  showAllButton: { paddingVertical: 6, paddingHorizontal: 2 },
  showAllText: { fontSize: 13, fontWeight: '700' },

  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginBottom: 2 },
  settingDescription: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },
  radiusOptions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  radiusOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  radiusOptionActive: { backgroundColor: '#00529B' },
  radiusOptionText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  radiusOptionTextActive: { color: '#fff' },

  categoryOverview: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  categoryIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  categoryName: { fontSize: 13, color: '#374151', width: 120 },
  categoryBar: { flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  categoryBarFill: { height: '100%', backgroundColor: '#00529B', borderRadius: 3, maxWidth: '100%' },
  categoryCount: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', width: 20, textAlign: 'right' },
});
