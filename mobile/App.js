import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  FlatList,
  NativeModules,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function getApiBaseUrl() {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  const host = scriptURL?.match(/:\/\/([^/:]+)/)?.[1];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:3000/api/v1`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api/v1';
  }

  return 'http://localhost:3000/api/v1';
}

const API_BASE_URL = getApiBaseUrl();

const statusLabels = {
  owned: 'En collection',
  tested: 'Testé',
  to_retry: 'À retester',
};

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return `${Number(value).toFixed(0)} €`;
}

function formatPricePer100ml(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return `${Number(value).toFixed(2)} €/100ml`;
}

function joinPreview(values, limit = 3) {
  if (!Array.isArray(values) || values.length === 0) {
    return 'Non renseigné';
  }

  return values.slice(0, limit).join(', ');
}

function FragranceCard({ fragrance }) {
  const brand = fragrance.Brand?.name ?? fragrance.brandName ?? 'Maison inconnue';
  const status = statusLabels[fragrance.mainStatus] ?? fragrance.mainStatus;
  const price = formatCurrency(fragrance.price);
  const pricePer100ml = formatPricePer100ml(fragrance.pricePer100ml);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleGroup}>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.name}>{fragrance.name}</Text>
        </View>
        {fragrance.rating ? (
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>{Number(fragrance.rating).toFixed(1)}/10</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.metaRow}>
        {fragrance.concentration ? (
          <Text style={styles.meta}>{fragrance.concentration}</Text>
        ) : null}
        {fragrance.formatMl ? <Text style={styles.meta}>{fragrance.formatMl} ml</Text> : null}
        {status ? <Text style={styles.meta}>{status}</Text> : null}
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Familles</Text>
          <Text style={styles.infoValue}>{joinPreview(fragrance.olfactoryFamilies)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Notes</Text>
          <Text style={styles.infoValue}>{joinPreview(fragrance.notes, 4)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>{price ?? 'Prix non renseigné'}</Text>
        {pricePer100ml ? <Text style={styles.priceDetail}>{pricePer100ml}</Text> : null}
      </View>
    </View>
  );
}

export default function App() {
  const [fragrances, setFragrances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const sortedFragrances = useMemo(
    () => [...fragrances].sort((a, b) => a.name.localeCompare(b.name)),
    [fragrances],
  );

  const loadFragrances = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/fragrances`);

      if (!response.ok) {
        throw new Error(`Erreur API ${response.status}`);
      }

      const data = await response.json();
      setFragrances(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFragrances();
  }, [loadFragrances]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.centerState}>
          <ActivityIndicator color="#C6A15B" />
          <Text style={styles.stateText}>Chargement des parfums...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>API indisponible</Text>
          <Text style={styles.stateText}>
            Vérifie que le serveur tourne sur le même réseau. Détail : {error}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => loadFragrances()}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        data={sortedFragrances}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <FragranceCard fragrance={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor="#C6A15B"
            colors={['#C6A15B']}
            onRefresh={() => loadFragrances({ refresh: true })}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>Répertoire</Text>
            <Text style={styles.title}>Mes parfums</Text>
            <Text style={styles.subtitle}>
              {sortedFragrances.length} parfums enregistrés dans l'API
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.stateTitle}>Aucun parfum</Text>
            <Text style={styles.stateText}>Le répertoire est vide pour le moment.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F0F0E',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 18,
  },
  kicker: {
    color: '#C6A15B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F7F1E8',
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A8A197',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#1B1A18',
    borderColor: '#2E2B27',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTitleGroup: {
    flex: 1,
  },
  brand: {
    color: '#A8A197',
    fontSize: 13,
    marginBottom: 4,
  },
  name: {
    color: '#F7F1E8',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
  },
  ratingPill: {
    backgroundColor: '#2A2117',
    borderColor: '#6D5024',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  ratingText: {
    color: '#E5B568',
    fontSize: 13,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  meta: {
    backgroundColor: '#24221F',
    borderRadius: 6,
    color: '#D9D1C5',
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  infoGrid: {
    gap: 10,
    marginTop: 14,
  },
  infoItem: {
    gap: 3,
  },
  infoLabel: {
    color: '#7F786F',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#DDD6CB',
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    alignItems: 'flex-end',
    borderColor: '#2A2824',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
  },
  price: {
    color: '#F7F1E8',
    fontSize: 16,
    fontWeight: '700',
  },
  priceDetail: {
    color: '#A8A197',
    fontSize: 13,
  },
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  stateTitle: {
    color: '#F7F1E8',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateText: {
    color: '#A8A197',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#C6A15B',
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryButtonText: {
    color: '#15130F',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
});
