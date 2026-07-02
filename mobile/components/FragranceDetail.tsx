import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { colors } from '../theme';
import type { Fragrance } from '../types/fragrance';

const statusLabels: Record<string, string> = {
  owned: 'En collection',
  tested: 'Testé',
  to_retry: 'À retester',
};

const longevityLabels: Record<string, string> = {
  faible: 'Faible',
  moyenne: 'Moyenne',
  bonne: 'Bonne',
  tres_longue: 'Très longue',
};

const sillageLabels: Record<string, string> = {
  discret: 'Discret',
  modere: 'Modéré',
  present: 'Présent',
  puissant: 'Puissant',
  tres_puissant: 'Très puissant',
};

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return `${Number(value).toFixed(0)} €`;
}

function formatPricePer100ml(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return `${Number(value).toFixed(2)} €/100ml`;
}

function joinValues(values?: string[] | null) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }

  return values.join(', ');
}

function getStatusLabel(status?: string | null) {
  if (!status) return null;
  return statusLabels[status] ?? status;
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function PillList({ values }: { values?: string[] | null }) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }

  return (
    <View style={styles.pillList}>
      {values.map((value) => (
        <Text key={value} style={styles.pill}>
          {value}
        </Text>
      ))}
    </View>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <Animated.View entering={FadeInDown.duration(360)} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Animated.View>
  );
}

type FragranceDetailProps = {
  fragrance: Fragrance;
  isRefreshing?: boolean;
  detailError?: string | null;
};

export function FragranceDetail({
  fragrance,
  isRefreshing = false,
  detailError = null,
}: FragranceDetailProps) {
  const brand = fragrance.Brand?.name ?? fragrance.brandName ?? 'Maison inconnue';
  const status = getStatusLabel(fragrance.mainStatus);
  const price = formatCurrency(fragrance.price);
  const pricePer100ml = formatPricePer100ml(fragrance.pricePer100ml);
  const families = joinValues(fragrance.olfactoryFamilies);
  const seasons = joinValues(fragrance.seasons);
  const occasions = joinValues(fragrance.occasions);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.hero}>
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.title}>{fragrance.name}</Text>
        {fragrance.description ? (
          <Text style={styles.description}>{fragrance.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          {fragrance.rating ? (
            <Text style={styles.rating}>{Number(fragrance.rating).toFixed(1)}/10</Text>
          ) : null}
          {fragrance.concentration ? (
            <Text style={styles.meta}>{fragrance.concentration}</Text>
          ) : null}
          {status ? <Text style={styles.meta}>{status}</Text> : null}
        </View>

        {isRefreshing ? <Text style={styles.loadingText}>Mise à jour de la fiche...</Text> : null}
        {detailError ? <Text style={styles.errorText}>{detailError}</Text> : null}
      </Animated.View>

      <Section title="Informations">
        <DetailRow label="Parfumeur" value={fragrance.perfumer} />
        <DetailRow label="Famille" value={families} />
        <DetailRow label="Saison" value={seasons ?? fragrance.saison} />
        <DetailRow label="Occasions" value={occasions} />
      </Section>

      <Section title="Notes">
        <DetailRow label="Tête" value={joinValues(fragrance.topNotes)} />
        <DetailRow label="Coeur" value={joinValues(fragrance.heartNotes)} />
        <DetailRow label="Fond" value={joinValues(fragrance.baseNotes)} />
        <PillList values={fragrance.notes} />
      </Section>

      <Section title="Expérience">
        <DetailRow label="Sillage" value={fragrance.sillage ? sillageLabels[fragrance.sillage] ?? fragrance.sillage : null} />
        <DetailRow label="Tenue" value={fragrance.longevity ? longevityLabels[fragrance.longevity] ?? fragrance.longevity : null} />
        <DetailRow label="Ouverture" value={fragrance.evolution?.opening} />
        <DetailRow label="Après 30 min" value={fragrance.evolution?.after30min} />
        <DetailRow label="Fond" value={fragrance.evolution?.drydown} />
      </Section>

      <Section title="Suivi">
        <DetailRow label="Prix" value={price} />
        <DetailRow label="Prix / 100ml" value={pricePer100ml} />
        <DetailRow label="Format" value={fragrance.size ?? (fragrance.formatMl ? `${fragrance.formatMl} ml` : null)} />
        <DetailRow label="Boutique" value={fragrance.shop} />
        <DetailRow label="Testé sur" value={fragrance.testedOn} />
        <DetailRow label="Découvert le" value={fragrance.discoveredAt} />
      </Section>

      {fragrance.personalNotes || fragrance.inspiration ? (
        <Section title="Notes perso">
          <DetailRow label="Ressenti" value={fragrance.personalNotes} />
          <DetailRow label="Inspiration" value={fragrance.inspiration} />
        </Section>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  hero: {
    paddingTop: 14,
    paddingBottom: 20,
  },
  brand: {
    marginBottom: 8,
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.cream,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  description: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rating: {
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: '#2A2117',
    paddingHorizontal: 9,
    paddingVertical: 5,
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  meta: {
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.chip,
    paddingHorizontal: 9,
    paddingVertical: 5,
    color: colors.soft,
    fontSize: 13,
  },
  loadingText: {
    marginTop: 12,
    color: colors.subtle,
    fontSize: 13,
  },
  errorText: {
    marginTop: 12,
    color: '#E5A1A1',
    fontSize: 13,
  },
  section: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingVertical: 10,
  },
  rowLabel: {
    marginBottom: 4,
    color: colors.subtle,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  rowValue: {
    color: colors.soft,
    fontSize: 15,
    lineHeight: 21,
  },
  pillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
  },
  pill: {
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.chip,
    paddingHorizontal: 9,
    paddingVertical: 5,
    color: colors.soft,
    fontSize: 13,
  },
});
