import { useCallback, useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import {
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FragranceDetail } from './components/FragranceDetail';
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

type ExpoHostConfig = {
  debuggerHost?: string;
  hostUri?: string;
};

type ExpoManifest = {
  debuggerHost?: string;
  hostUri?: string;
  extra?: {
    expoClient?: ExpoHostConfig;
    expoGo?: ExpoHostConfig;
  };
};

const API_PORT = 3000;
const API_PATH = '/api/v1';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Erreur inconnue';
}

function getHostName(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value.includes('://') ? value : `http://${value}`);
    return url.hostname;
  } catch {
    return value.split(':')[0] || null;
  }
}

function addApiUrl(urls: string[], host?: string | null) {
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return;
  }

  urls.push(`http://${host}:${API_PORT}${API_PATH}`);
}

function getApiBaseUrlCandidates(): string[] {
  const sourceCode = NativeModules.SourceCode as SourceCodeModule | undefined;
  const scriptURL = sourceCode?.scriptURL;
  const manifest = Constants.manifest as ExpoManifest | null;
  const manifest2 = Constants.manifest2 as ExpoManifest | null;
  const urls: string[] = [];

  addApiUrl(urls, getHostName(Constants.expoConfig?.hostUri));
  addApiUrl(urls, getHostName(manifest?.hostUri));
  addApiUrl(urls, getHostName(manifest?.debuggerHost));
  addApiUrl(urls, getHostName(manifest?.extra?.expoClient?.hostUri));
  addApiUrl(urls, getHostName(manifest2?.extra?.expoClient?.hostUri));
  addApiUrl(urls, getHostName(manifest2?.extra?.expoGo?.debuggerHost));
  addApiUrl(urls, getHostName(scriptURL));

  if (Platform.OS === 'android') {
    urls.push(`http://10.0.2.2:${API_PORT}${API_PATH}`);
  }

  urls.push(`http://localhost:${API_PORT}${API_PATH}`);

  return [...new Set(urls)];
}

const API_BASE_URLS = getApiBaseUrlCandidates();

async function fetchFromApi<T>(path: string): Promise<T> {
  let lastErrorMessage = 'Aucune URL API disponible';

  for (const apiBaseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${apiBaseUrl}${path}`);

      if (!response.ok) {
        throw new Error(`Erreur API ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (requestError) {
      lastErrorMessage = getErrorMessage(requestError);
    }
  }

  throw new Error(`${lastErrorMessage} (${API_BASE_URLS.join(', ')})`);
}

function AppContent() {
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailRefreshing, setIsDetailRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
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
      const data = await fetchFromApi<Fragrance[]>('/fragrances');
      setFragrances(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const openFragranceDetail = useCallback(async (fragrance: Fragrance) => {
    setSelectedFragrance(fragrance);
    setDetailError(null);
    setIsDetailRefreshing(true);

    try {
      const detail = await fetchFromApi<Fragrance>(
        `/fragrances/${encodeURIComponent(String(fragrance.id))}`,
      );
      setSelectedFragrance(detail);
    } catch (requestError) {
      setDetailError(`Impossible de mettre à jour la fiche. ${getErrorMessage(requestError)}`);
    } finally {
      setIsDetailRefreshing(false);
    }
  }, []);

  const closeFragranceDetail = useCallback(() => {
    setSelectedFragrance(null);
    setDetailError(null);
    setIsDetailRefreshing(false);
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

  if (selectedFragrance) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <Animated.View
          entering={FadeIn.duration(220)}
          layout={LinearTransition.duration(250)}
          style={[styles.content, layoutAnimatedStyle]}
        >
          <View style={styles.detailHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour à la liste"
              onPress={closeFragranceDetail}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            >
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
          </View>
          <FragranceDetail
            fragrance={selectedFragrance}
            isRefreshing={isDetailRefreshing}
            detailError={detailError}
          />
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
          onSelectFragrance={openFragranceDetail}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
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
  detailHeader: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonPressed: {
    opacity: 0.72,
  },
  backButtonText: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: '700',
  },
});
