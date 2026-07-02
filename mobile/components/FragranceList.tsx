import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FragranceCard } from './FragranceCard';
import { colors } from '../theme';
import type { Fragrance } from '../types/fragrance';

type FragranceListProps = {
  fragrances: Fragrance[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelectFragrance: (fragrance: Fragrance) => void;
};

const INITIAL_ITEMS_TO_RENDER = 8;
const MAX_ITEMS_TO_RENDER_PER_BATCH = 6;
const RENDER_WINDOW_SIZE = 7;

export function FragranceList({
  fragrances,
  isRefreshing,
  onRefresh,
  onSelectFragrance,
}: FragranceListProps) {
  return (
    <FlatList<Fragrance>
      data={fragrances}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item, index }) => (
        <FragranceCard fragrance={item} index={index} onPress={onSelectFragrance} />
      )}
      initialNumToRender={INITIAL_ITEMS_TO_RENDER}
      maxToRenderPerBatch={MAX_ITEMS_TO_RENDER_PER_BATCH}
      windowSize={RENDER_WINDOW_SIZE}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          tintColor="#C6A15B"
          colors={['#C6A15B']}
          onRefresh={onRefresh}
        />
      }
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <Animated.View
          entering={FadeInDown.duration(420)}
          style={styles.header}
        >
          <Text style={styles.kicker}>
            Répertoire
          </Text>
          <Text style={styles.title}>Mes parfums</Text>
          <Text style={styles.subtitle}>
            {fragrances.length} parfums découverts
          </Text>
        </Animated.View>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            Aucun parfum
          </Text>
          <Text style={styles.emptyText}>
            Le répertoire est vide pour le moment.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  kicker: {
    marginBottom: 8,
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.cream,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    color: colors.cream,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
