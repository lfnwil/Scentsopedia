import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NativeModules,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FragranceList } from './components/FragranceList';
import { FragranceListSkeleton } from './components/FragranceListSkeleton';
import { colors } from './theme';
import type { Fragrance } from './types/fragrance';

type LoadFragrancesOptions = {
  refresh?: boolean;
};

type SourceCodeModule = {
  scriptURL?: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erreur inconnue';
}

function getApiBaseUrlCandidates(): string[] {
  const sourceCode = NativeModules.SourceCode as SourceCodeModule | undefined;
  const scriptURL = sourceCode?.scriptURL;
  const host = scriptURL?.match(/:\/\/([^/:]+)/)?.[1];
  const urls: string[] = [];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    urls.push(`http://${host}:3000/api/v1`);
  }

  urls.push('http://10.33.73.227:3000/api/v1');

  if (Platform.OS === 'android') {
    urls.push('http://10.0.2.2:3000/api/v1');
  }

  urls.push('http://localhost:3000/api/v1');

  return [...new Set(urls)];
}

const API_BASE_URLS = getApiBaseUrlCandidates();

export default function App() {
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const layoutOpacity = useSharedValue(0);
  const layoutOffset = useSharedValue(14);

  const sortedFragrances = useMemo(
    () => [...fragrances].sort((a, b) => a.name.localeCompare(b.name)),
    [fragrances],
  );

  const layoutAnimatedStyle = useAnimatedStyle(() => ({
    opacity: layoutOpacity.value,
    transform: [{ translateY: layoutOffset.value }],
  }));

  const loadFragrances = useCallback(async ({ refresh = false }: LoadFragrancesOptions = {}) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      let lastErrorMessage = 'Aucune URL API disponible';

      for (const apiBaseUrl of API_BASE_URLS) {
        try {
          const response = await fetch(`${apiBaseUrl}/fragrances`);

          if (!response.ok) {
            throw new Error(`Erreur API ${response.status}`);
          }

          const data = await response.json();
          setFragrances(Array.isArray(data) ? (data as Fragrance[]) : []);
          return;
        } catch (requestError) {
          lastErrorMessage = getErrorMessage(requestError);
        }
      }

      throw new Error(lastErrorMessage);
    } catch (requestError) {
      setError(`${getErrorMessage(requestError)} (${API_BASE_URLS.join(', ')})`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFragrances();
  }, [loadFragrances]);

  useEffect(() => {
    layoutOpacity.value = withTiming(1, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
    layoutOffset.value = withTiming(0, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [layoutOffset, layoutOpacity]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <Animated.View style={[styles.content, layoutAnimatedStyle]}>
          <FragranceListSkeleton />
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <Animated.View
          layout={LinearTransition.duration(250)}
          style={[styles.centerState, layoutAnimatedStyle]}
        >
          <Text style={styles.stateTitle}>
            API indisponible
          </Text>
          <Text style={styles.stateText}>
            Vérifie que le serveur tourne sur le même réseau. Détail : {error}
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadFragrances()}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <Animated.View
        layout={LinearTransition.duration(250)}
        style={[styles.content, layoutAnimatedStyle]}
      >
        <FragranceList
          fragrances={sortedFragrances}
          isRefreshing={isRefreshing}
          onRefresh={() => loadFragrances({ refresh: true })}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  content: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateTitle: {
    marginBottom: 8,
    color: colors.cream,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  stateText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
});
