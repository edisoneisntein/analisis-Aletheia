import type {
  ComputedVideoMetrics,
  PhaseCheckpoint,
  PhaseId,
  PlatformType,
  PublicationClassification,
  RegionScope,
  VideoRecord,
} from '../types/aletheia';

export interface VideoFilterCriteria {
  query: string;
  region: RegionScope | 'Todas';
  platform: PlatformType | 'Todas';
  classification: PublicationClassification | 'Todas';
  verifiedOnly: boolean;
}

export interface NewVideoInput {
  creatorName: string;
  country: string;
  region: RegionScope;
  platform: PlatformType;
  url: string;
  publishedDate: string;
  followers: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  durationSeconds: string;
  legalTopic: string;
  narrativeFormat: string;
  observableQuality: string;
  selectionReason: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Pure deterministic calculation of the 4 required KPI formulas from Fase 1:
 * A. Relación de visualizaciones = Visualizaciones / Seguidores
 * B. Tasa de likes = (Likes / Visualizaciones) * 100
 * C. Tasa de comentarios = (Comentarios / Visualizaciones) * 100
 * D. Tasa de compartidos = (Compartidos / Visualizaciones) * 100
 *
 * Returns null whenever source figures are missing or zero in denominator
 * to preserve strict epistemic accuracy ("Información no disponible").
 */
export function computeVideoMetrics(
  record: Pick<VideoRecord, 'followers' | 'views' | 'likes' | 'comments' | 'shares'>
): ComputedVideoMetrics {
  const { followers, views, likes, comments, shares } = record;

  const viewToFollowerRatio =
    views !== null && followers !== null && followers > 0 && views >= 0
      ? Number((views / followers).toFixed(2))
      : null;

  const likeRatePct =
    likes !== null && views !== null && views > 0 && likes >= 0
      ? Number(((likes / views) * 100).toFixed(2))
      : null;

  const commentRatePct =
    comments !== null && views !== null && views > 0 && comments >= 0
      ? Number(((comments / views) * 100).toFixed(2))
      : null;

  const shareRatePct =
    shares !== null && views !== null && views > 0 && shares >= 0
      ? Number(((shares / views) * 100).toFixed(2))
      : null;

  return {
    viewToFollowerRatio,
    likeRatePct,
    commentRatePct,
    shareRatePct,
  };
}

/**
 * Automatically derives quantitative classifications ONLY when verified metrics exist.
 * Never fabricates conversion claims ("Alta capacidad comercial aparente" requires
 * explicit qualitative evidence and never equates views to actual client conversions).
 */
export function deriveQuantitativeClassifications(
  metrics: ComputedVideoMetrics,
  existingQualitative: PublicationClassification[] = []
): PublicationClassification[] {
  const set = new Set<PublicationClassification>(existingQualitative);

  if (metrics.viewToFollowerRatio !== null) {
    if (metrics.viewToFollowerRatio >= 5) {
      set.add('Viralidad extraordinaria');
    } else if (metrics.viewToFollowerRatio >= 1.5) {
      set.add('Alto rendimiento relativo');
    }
  }

  const totalInteractionPct =
    (metrics.likeRatePct ?? 0) +
    (metrics.commentRatePct ?? 0) +
    (metrics.shareRatePct ?? 0);

  if (
    (metrics.likeRatePct !== null && metrics.likeRatePct >= 4.5) ||
    (metrics.commentRatePct !== null && metrics.commentRatePct >= 0.35) ||
    totalInteractionPct >= 6
  ) {
    set.add('Alta interacción');
  }

  return Array.from(set);
}

export function filterVideoDatabase(
  records: VideoRecord[],
  criteria: VideoFilterCriteria
): VideoRecord[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  return records.filter((item) => {
    if (criteria.region !== 'Todas' && item.region !== criteria.region) {
      return false;
    }
    if (criteria.platform !== 'Todas' && item.platform !== criteria.platform) {
      return false;
    }
    if (
      criteria.classification !== 'Todas' &&
      !item.classifications.includes(criteria.classification)
    ) {
      return false;
    }
    if (criteria.verifiedOnly && !item.metricsVerified) {
      return false;
    }
    if (normalizedQuery) {
      const haystack = [
        item.creatorName,
        item.country,
        item.legalTopic,
        item.narrativeFormat,
        item.platform,
        item.observableQuality,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export function parseOptionalPositiveInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.replace(/[.,\s]/g, '');
  if (!/^\d+$/.test(cleaned)) return NaN;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : NaN;
}

export function validateNewVideoInput(input: NewVideoInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.creatorName.trim()) {
    errors.creatorName = 'El nombre del abogado o firma es obligatorio.';
  }
  if (!input.country.trim()) {
    errors.country = 'Indique el país de origen.';
  }
  if (!input.url.trim()) {
    errors.url = 'La URL verificable de la publicación o canal es obligatoria.';
  } else if (!/^https?:\/\/.+/i.test(input.url.trim())) {
    errors.url = 'La URL debe iniciar con http:// o https://.';
  }
  if (!input.legalTopic.trim()) {
    errors.legalTopic = 'Especifique el tema jurídico abordado.';
  }
  if (!input.narrativeFormat.trim()) {
    errors.narrativeFormat = 'Especifique el formato narrativo observable.';
  }

  const numericFields: Array<{ key: keyof NewVideoInput; label: string }> = [
    { key: 'followers', label: 'Seguidores' },
    { key: 'views', label: 'Visualizaciones' },
    { key: 'likes', label: 'Likes' },
    { key: 'comments', label: 'Comentarios' },
    { key: 'shares', label: 'Compartidos' },
    { key: 'saves', label: 'Guardados' },
    { key: 'durationSeconds', label: 'Duración (seg)' },
  ];

  for (const field of numericFields) {
    const raw = input[field.key];
    if (raw.trim() !== '') {
      const parsed = parseOptionalPositiveInt(raw);
      if (Number.isNaN(parsed)) {
        errors[field.key] = `${field.label} debe ser un número entero positivo o quedar vacío si no está disponible.`;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function evaluatePhaseGateReadiness(
  checkpoints: PhaseCheckpoint[],
  phaseId?: PhaseId
): {
  total: number;
  verified: number;
  percentage: number;
  isComplete: boolean;
} {
  const scoped = phaseId
    ? checkpoints.filter((c) => c.phaseId === phaseId)
    : checkpoints;
  const total = scoped.length;
  const verified = scoped.filter((c) => c.verified).length;
  const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;

  return {
    total,
    verified,
    percentage,
    isComplete: total > 0 && verified === total,
  };
}

export function formatMetricNumber(value: number | null): string {
  if (value === null) return 'N/D';
  return new Intl.NumberFormat('es-CO').format(value);
}

export function formatRatio(value: number | null): string {
  if (value === null) return 'N/D';
  return `${value.toFixed(2)}x`;
}

export function formatPercent(value: number | null): string {
  if (value === null) return 'N/D';
  return `${value.toFixed(2)}%`;
}

export type InteractionMetricKey =
  | 'totalInteractionPct'
  | 'likeRatePct'
  | 'commentRatePct'
  | 'shareRatePct';

export type DurationBracketKey = '≤ 30 s' | '31–60 s' | '61–90 s' | '> 90 s';

export interface CorrelationPoint {
  id: string;
  creatorName: string;
  country: string;
  platform: PlatformType;
  narrativeFormat: string;
  durationSeconds: number;
  interactionRatePct: number;
  totalInteractionPct: number | null;
  likeRatePct: number | null;
  commentRatePct: number | null;
  shareRatePct: number | null;
  viewToFollowerRatio: number | null;
  views: number | null;
  classifications: PublicationClassification[];
  isHypothetical?: boolean;
}

export interface PearsonCorrelationResult {
  r: number | null;
  slope: number | null;
  intercept: number | null;
  strengthLabel: string;
}

export interface DurationBracketSummary {
  bracket: DurationBracketKey;
  count: number;
  avgInteractionPct: number | null;
  maxInteractionPct: number | null;
}

export interface CorrelationInsights {
  sampleSize: number;
  avgDurationSec: number | null;
  avgInteractionPct: number | null;
  bestBracket: DurationBracketSummary | null;
  distinctPlatforms: number;
  pearson: PearsonCorrelationResult;
}

export function getDurationBracket(seconds: number): DurationBracketKey {
  if (seconds <= 30) return '≤ 30 s';
  if (seconds <= 60) return '31–60 s';
  if (seconds <= 90) return '61–90 s';
  return '> 90 s';
}

/**
 * Builds scatter-plot points exclusively from records that contain BOTH
 * a positive duration and a calculable interaction rate for the chosen metric.
 * Never fabricates missing numbers.
 */
export function buildDurationInteractionDataset(
  records: VideoRecord[],
  metricKey: InteractionMetricKey,
  platformFilter: PlatformType | 'Todas' = 'Todas',
  isHypothetical = false
): CorrelationPoint[] {
  const points: CorrelationPoint[] = [];

  for (const record of records) {
    if (platformFilter !== 'Todas' && record.platform !== platformFilter) {
      continue;
    }
    if (record.durationSeconds === null || record.durationSeconds <= 0) {
      continue;
    }

    const metrics = computeVideoMetrics(record);
    const hasAnyInteractionComponent =
      metrics.likeRatePct !== null ||
      metrics.commentRatePct !== null ||
      metrics.shareRatePct !== null;

    const totalInteractionPct = hasAnyInteractionComponent
      ? Number(
          (
            (metrics.likeRatePct ?? 0) +
            (metrics.commentRatePct ?? 0) +
            (metrics.shareRatePct ?? 0)
          ).toFixed(2)
        )
      : null;

    const selectedValue =
      metricKey === 'totalInteractionPct'
        ? totalInteractionPct
        : metrics[metricKey];

    if (selectedValue === null) {
      continue;
    }

    points.push({
      id: record.id,
      creatorName: record.creatorName,
      country: record.country,
      platform: record.platform,
      narrativeFormat: record.narrativeFormat,
      durationSeconds: record.durationSeconds,
      interactionRatePct: selectedValue,
      totalInteractionPct,
      likeRatePct: metrics.likeRatePct,
      commentRatePct: metrics.commentRatePct,
      shareRatePct: metrics.shareRatePct,
      viewToFollowerRatio: metrics.viewToFollowerRatio,
      views: record.views,
      classifications: record.classifications,
      isHypothetical,
    });
  }

  return points;
}

/**
 * Pure Pearson correlation coefficient (r) and linear fit between video duration (x)
 * and interaction rate (y). Requires at least 3 valid points with non-zero variance.
 */
export function computePearsonCorrelation(
  points: Array<Pick<CorrelationPoint, 'durationSeconds' | 'interactionRatePct'>>
): PearsonCorrelationResult {
  const n = points.length;
  if (n < 3) {
    return {
      r: null,
      slope: null,
      intercept: null,
      strengthLabel: 'Requiere ≥ 3 videos verificados',
    };
  }

  const meanX = points.reduce((sum, p) => sum + p.durationSeconds, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.interactionRatePct, 0) / n;

  let covXY = 0;
  let varX = 0;
  let varY = 0;

  for (const p of points) {
    const dx = p.durationSeconds - meanX;
    const dy = p.interactionRatePct - meanY;
    covXY += dx * dy;
    varX += dx * dx;
    varY += dy * dy;
  }

  if (varX === 0 || varY === 0) {
    return {
      r: null,
      slope: null,
      intercept: null,
      strengthLabel: 'Sin varianza suficiente',
    };
  }

  const r = Number((covXY / Math.sqrt(varX * varY)).toFixed(2));
  const slope = Number((covXY / varX).toFixed(4));
  const intercept = Number((meanY - slope * meanX).toFixed(4));
  const absR = Math.abs(r);

  let strengthLabel = 'Sin correlación lineal clara';
  if (absR >= 0.7) {
    strengthLabel =
      r > 0 ? 'Correlación positiva fuerte' : 'Correlación negativa fuerte';
  } else if (absR >= 0.4) {
    strengthLabel =
      r > 0 ? 'Correlación positiva moderada' : 'Correlación negativa moderada';
  } else if (absR >= 0.2) {
    strengthLabel =
      r > 0 ? 'Tendencia positiva leve' : 'Tendencia negativa leve';
  }

  return { r, slope, intercept, strengthLabel };
}

export function aggregateByDurationBracket(
  points: CorrelationPoint[]
): DurationBracketSummary[] {
  const order: DurationBracketKey[] = ['≤ 30 s', '31–60 s', '61–90 s', '> 90 s'];
  const groups = new Map<DurationBracketKey, number[]>(
    order.map((key) => [key, []])
  );

  for (const point of points) {
    const bucket = getDurationBracket(point.durationSeconds);
    groups.get(bucket)?.push(point.interactionRatePct);
  }

  return order.map((bracket) => {
    const values = groups.get(bracket) ?? [];
    if (values.length === 0) {
      return {
        bracket,
        count: 0,
        avgInteractionPct: null,
        maxInteractionPct: null,
      };
    }
    const avg = values.reduce((acc, v) => acc + v, 0) / values.length;
    const max = Math.max(...values);
    return {
      bracket,
      count: values.length,
      avgInteractionPct: Number(avg.toFixed(2)),
      maxInteractionPct: Number(max.toFixed(2)),
    };
  });
}

export function summarizeCorrelationInsights(
  points: CorrelationPoint[]
): CorrelationInsights {
  const sampleSize = points.length;
  const pearson = computePearsonCorrelation(points);
  const brackets = aggregateByDurationBracket(points);

  if (sampleSize === 0) {
    return {
      sampleSize: 0,
      avgDurationSec: null,
      avgInteractionPct: null,
      bestBracket: null,
      distinctPlatforms: 0,
      pearson,
    };
  }

  const avgDurationSec = Math.round(
    points.reduce((sum, p) => sum + p.durationSeconds, 0) / sampleSize
  );
  const avgInteractionPct = Number(
    (
      points.reduce((sum, p) => sum + p.interactionRatePct, 0) / sampleSize
    ).toFixed(2)
  );

  const populatedBrackets = brackets.filter(
    (b): b is DurationBracketSummary & { avgInteractionPct: number } =>
      b.count > 0 && b.avgInteractionPct !== null
  );
  const bestBracket =
    populatedBrackets.length > 0
      ? populatedBrackets.reduce((best, cur) =>
          cur.avgInteractionPct > best.avgInteractionPct ? cur : best
        )
      : null;

  const distinctPlatforms = new Set(points.map((p) => p.platform)).size;

  return {
    sampleSize,
    avgDurationSec,
    avgInteractionPct,
    bestBracket,
    distinctPlatforms,
    pearson,
  };
}

