import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../theme';

const skeletonItems = ['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4', 'skeleton-5'];

function SkeletonBlock({ style }: { style?: object }) {
  const opacity = useSharedValue(0.42);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.72, { duration: 700 }),
        withTiming(0.42, { duration: 700 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.block, style, animatedStyle]} />;
}

function FragranceCardSkeleton({ index }: { index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 60, 300)).duration(320)}
      style={styles.card}
    >
      <SkeletonBlock style={styles.brandLine} />
      <SkeletonBlock style={styles.nameLine} />

      <View style={styles.metaRow}>
        <SkeletonBlock style={styles.metaShort} />
        <SkeletonBlock style={styles.metaTiny} />
        <SkeletonBlock style={styles.metaMedium} />
      </View>

      <View style={styles.familyBlock}>
        <SkeletonBlock style={styles.labelLine} />
        <SkeletonBlock style={styles.familyLine} />
      </View>
    </Animated.View>
  );
}

export function FragranceListSkeleton() {
  return (
    <FlatList
      data={skeletonItems}
      keyExtractor={(item) => item}
      renderItem={({ index }) => <FragranceCardSkeleton index={index} />}
      contentContainerStyle={styles.listContent}
      scrollEnabled={false}
      ListHeaderComponent={
        <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
          <Text style={styles.kicker}>Répertoire</Text>
          <Text style={styles.title}>Mes parfums</Text>
          <Text style={styles.subtitle}>Chargement des parfums...</Text>
        </Animated.View>
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
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 16,
  },
  block: {
    borderRadius: 6,
    backgroundColor: colors.chip,
  },
  brandLine: {
    width: '42%',
    height: 13,
    marginBottom: 8,
  },
  nameLine: {
    width: '68%',
    height: 22,
  },
  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  metaShort: {
    width: 110,
    height: 22,
  },
  metaTiny: {
    width: 52,
    height: 22,
  },
  metaMedium: {
    width: 82,
    height: 22,
  },
  familyBlock: {
    marginTop: 16,
    gap: 8,
  },
  labelLine: {
    width: 70,
    height: 12,
  },
  familyLine: {
    width: '76%',
    height: 16,
  },
});
