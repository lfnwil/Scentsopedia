import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, LinearTransition } from 'react-native-reanimated';

import { colors } from '../theme';
import type { Fragrance } from '../types/fragrance';

const statusLabels: Record<string, string> = {
  owned: 'En collection',
  tested: 'Testé',
  to_retry: 'À retester',
};

function joinPreview(values?: string[] | null, limit = 3) {
  if (!Array.isArray(values) || values.length === 0) {
    return 'Non renseigné';
  }

  return values.slice(0, limit).join(', ');
}

type FragranceCardProps = {
  fragrance: Fragrance;
  index: number;
  onPress: (fragrance: Fragrance) => void;
};

export function FragranceCard({ fragrance, index, onPress }: FragranceCardProps) {
  const brand = fragrance.Brand?.name ?? fragrance.brandName ?? 'Maison inconnue';
  const status = fragrance.mainStatus
    ? statusLabels[fragrance.mainStatus] ?? fragrance.mainStatus
    : null;
  const entryDelay = Math.min(index * 70, 420);

  return (
    <Animated.View
      entering={FadeInUp.delay(entryDelay).duration(380)}
      layout={LinearTransition.duration(220)}
      style={styles.card}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Voir le détail de ${fragrance.name}`}
        onPress={() => onPress(fragrance)}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.brand} numberOfLines={1}>
              {brand}
            </Text>
            <Text style={styles.name} numberOfLines={2}>
              {fragrance.name}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {fragrance.concentration ? (
            <Text style={styles.meta}>
              {fragrance.concentration}
            </Text>
          ) : null}
          {fragrance.formatMl ? (
            <Text style={styles.meta}>
              {fragrance.formatMl} ml
            </Text>
          ) : null}
          {status ? (
            <Text style={styles.meta}>
              {status}
            </Text>
          ) : null}
        </View>

        <View style={styles.familyBlock}>
          <Text style={styles.familyLabel}>Familles</Text>
          <Text style={styles.familyValue}>
            {joinPreview(fragrance.olfactoryFamilies)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pressable: {
    padding: 16,
  },
  pressed: {
    opacity: 0.72,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
  },
  brand: {
    marginBottom: 4,
    color: colors.muted,
    fontSize: 13,
  },
  name: {
    color: colors.cream,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.chip,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: colors.soft,
    fontSize: 12,
  },
  familyBlock: {
    marginTop: 16,
    gap: 4,
  },
  familyLabel: {
    color: colors.subtle,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  familyValue: {
    color: colors.soft,
    fontSize: 14,
    lineHeight: 20,
  },
});
