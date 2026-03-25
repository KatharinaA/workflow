import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { NearbyBenefit } from '../types';
import { BenefitCard } from '../components/BenefitCard';

interface Props {
  route: { params: { benefits: NearbyBenefit[] } };
  navigation: any;
}

export default function NearbyListScreen({ route, navigation }: Props) {
  const { benefits } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={benefits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BenefitCard
            benefit={item}
            showDistance
            onPress={() => navigation.navigate('BenefitDetail', { benefit: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyText}>Ingen fordeler i nærheten</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  list: { padding: 16, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#6B7280' },
});
