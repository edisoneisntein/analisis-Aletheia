import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ArrowRight, BarChart3, ScatterChart as ScatterIcon } from 'lucide-react';
import type { PlatformType, VideoRecord } from '../types/aletheia';
import {
  aggregateByDurationBracket,
  buildDurationInteractionDataset,
  formatMetricNumber,
  formatPercent,
  formatRatio,
  summarizeCorrelationInsights,
  type CorrelationPoint,
  type DurationBracketSummary,
  type InteractionMetricKey,
} from '../utils/analytics';

interface DurationInteractionChartProps {
  videos: VideoRecord[];
  onNavigateToDatabase: () => void;
}

const PLATFORMS: PlatformType[] = [
  'TikTok',
  'Instagram Reels',
  'Facebook Reels',
  'YouTube Shorts',
];

const PLATFORM_COLORS: Record<PlatformType, string> = {
  TikTok: '#0A1628',
  'Instagram Reels': '#9E7E45',
  'Facebook Reels': '#475569',
  'YouTube Shorts': '#8C3B3B',
};

const METRIC_OPTIONS: Array<{
  key: InteractionMetricKey;
  shortLabel: string;
  axisLabel: string;
  formulaNote: string;
}> = [
  {
    key: 'totalInteractionPct',
    shortLabel: 'Interacción total',
    axisLabel: 'Tasa de interacción total (%)',
    formulaNote: 'Suma de fórmulas disponibles (B + C + D) sobre visualizaciones',
  },
  {
    key: 'likeRatePct',
    shortLabel: 'Likes (B)',
    axisLabel: 'Tasa de likes (%)',
    formulaNote: 'Fórmula B: (Likes / Visualizaciones) × 100',
  },
  {
    key: 'commentRatePct',
    shortLabel: 'Comentarios (C)',
    axisLabel: 'Tasa de comentarios (%)',
    formulaNote: 'Fórmula C: (Comentarios / Visualizaciones) × 100',
  },
  {
    key: 'shareRatePct',
    shortLabel: 'Compartidos (D)',
    axisLabel: 'Tasa de compartidos (%)',
    formulaNote: 'Fórmula D: (Compartidos / Visualizaciones) × 100',
  },
];

/**
 * Isolated illustrative calibration records strictly labeled as "Hipótesis"
 * for previewing the correlation engine before real metrics are verified in Doc 02.
 * Never persisted to localStorage, never mixed with verified records, and never exported as real data.
 */
const HYPOTHETICAL_CALIBRATION_RECORDS: VideoRecord[] = [
  {
    id: 'hyp-01',
    creatorName: 'Escenario A · Mito contractual breve',
    country: 'Colombia',
    region: 'Colombia',
    platform: 'TikTok',
    url: 'https://example.invalid/hipotesis-a',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 40000,
    views: 160000,
    likes: 9920,
    comments: 640,
    shares: 1440,
    saves: null,
    durationSeconds: 28,
    legalTopic: 'Cláusulas abusivas (supuesto ilustrativo)',
    narrativeFormat: 'Mitos y realidades jurídicas',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta interacción'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-02',
    creatorName: 'Escenario B · Error empresarial en contratos',
    country: 'Colombia',
    region: 'Colombia',
    platform: 'Instagram Reels',
    url: 'https://example.invalid/hipotesis-b',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 25000,
    views: 95000,
    likes: 6460,
    comments: 570,
    shares: 1140,
    saves: null,
    durationSeconds: 48,
    legalTopic: 'Prevención contractual S.A.S. (supuesto ilustrativo)',
    narrativeFormat: 'Errores jurídicos frecuentes (Prevención)',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta interacción', 'Alta capacidad de construcción de autoridad'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-03',
    creatorName: 'Escenario C · Recreación cinematográfica sobria',
    country: 'Colombia',
    region: 'Colombia',
    platform: 'Instagram Reels',
    url: 'https://example.invalid/hipotesis-c',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 30000,
    views: 140000,
    likes: 8820,
    comments: 700,
    shares: 1540,
    saves: null,
    durationSeconds: 55,
    legalTopic: 'Obligatoriedad del contrato (supuesto ilustrativo)',
    narrativeFormat: 'Recreaciones cinematográficas sobrias',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta interacción', 'Alta capacidad de construcción de autoridad'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-04',
    creatorName: 'Escenario D · Cápsula laboral directa',
    country: 'Colombia',
    region: 'Colombia',
    platform: 'YouTube Shorts',
    url: 'https://example.invalid/hipotesis-d',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 50000,
    views: 120000,
    likes: 5760,
    comments: 480,
    shares: 480,
    saves: null,
    durationSeconds: 42,
    legalTopic: 'Terminación laboral (supuesto ilustrativo)',
    narrativeFormat: 'Abogado hablando a cámara (Plano directo)',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta capacidad educativa'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-05',
    creatorName: 'Escenario E · Análisis normativo intermedio',
    country: 'México',
    region: 'Latinoamérica',
    platform: 'TikTok',
    url: 'https://example.invalid/hipotesis-e',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 80000,
    views: 190000,
    likes: 7790,
    comments: 570,
    shares: 760,
    saves: null,
    durationSeconds: 74,
    legalTopic: 'Reforma normativa (supuesto ilustrativo)',
    narrativeFormat: 'Análisis de noticias y coyuntura normativa',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta capacidad educativa'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-06',
    creatorName: 'Escenario F · Clip de podcast extenso',
    country: 'Colombia',
    region: 'Colombia',
    platform: 'Facebook Reels',
    url: 'https://example.invalid/hipotesis-f',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 35000,
    views: 42000,
    likes: 1260,
    comments: 126,
    shares: 168,
    saves: null,
    durationSeconds: 108,
    legalTopic: 'Gobierno corporativo (supuesto ilustrativo)',
    narrativeFormat: 'Entrevistas y micro-cápsulas de podcast',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta capacidad de construcción de autoridad'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-07',
    creatorName: 'Escenario G · Comparación Creencia vs. Ley',
    country: 'Colombia',
    region: 'Colombia',
    platform: 'TikTok',
    url: 'https://example.invalid/hipotesis-g',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 60000,
    views: 210000,
    likes: 11760,
    comments: 840,
    shares: 1470,
    saves: null,
    durationSeconds: 36,
    legalTopic: 'Derecho de petición (supuesto ilustrativo)',
    narrativeFormat: 'Comparaciones "Creencia vs. Ley"',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta interacción', 'Alto rendimiento relativo'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
  {
    id: 'hyp-08',
    creatorName: 'Escenario H · Documental institucional largo',
    country: 'España',
    region: 'Internacional',
    platform: 'YouTube Shorts',
    url: 'https://example.invalid/hipotesis-h',
    publishedDate: 'Hipótesis',
    consultedDate: 'Hipótesis',
    followers: 45000,
    views: 38000,
    likes: 1026,
    comments: 76,
    shares: 114,
    saves: null,
    durationSeconds: 118,
    legalTopic: 'Cultura de firma jurídica (supuesto ilustrativo)',
    narrativeFormat: 'Documentales corporativos breves',
    observableQuality: 'Hipótesis de calibración',
    classifications: ['Alta capacidad de construcción de autoridad'],
    metricsVerified: false,
    epistemicNote: 'Hipótesis metodológica ilustrativa.',
    selectionReason: 'Calibración visual del gráfico.',
    transcript: '',
    keyframeNotes: '',
    shotSummary: '',
    isTopTen: false,
  },
];

interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CorrelationPoint }>;
  metricLabel: string;
}

function EditorialScatterTooltip({
  active,
  payload,
  metricLabel,
}: ScatterTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="bg-white border border-[#BFC8D6] shadow-sm p-3.5 max-w-[280px] text-xs">
      <p className="text-[11px] font-medium text-[#7D6232]">
        {point.isHypothetical ? 'Hipótesis ilustrativa' : 'Dato comprobado'} · {point.platform}
      </p>
      <p className="mt-1 font-semibold text-[#0A1628] leading-snug">{point.creatorName}</p>
      <p className="mt-0.5 text-[#5E6B7E]">{point.narrativeFormat}</p>

      <div className="mt-2.5 pt-2.5 border-t border-[#EFF2F6] grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono tabular-nums">
        <div>
          <span className="text-[#5E6B7E] font-sans block text-[11px]">Duración</span>
          <span className="text-[#0A1628] font-semibold">{point.durationSeconds} s</span>
        </div>
        <div>
          <span className="text-[#5E6B7E] font-sans block text-[11px]">{metricLabel}</span>
          <span className="text-[#0A1628] font-semibold">
            {formatPercent(point.interactionRatePct)}
          </span>
        </div>
        <div>
          <span className="text-[#5E6B7E] font-sans block text-[11px]">Likes (B)</span>
          <span className="text-[#334155]">{formatPercent(point.likeRatePct)}</span>
        </div>
        <div>
          <span className="text-[#5E6B7E] font-sans block text-[11px]">Comentarios (C)</span>
          <span className="text-[#334155]">{formatPercent(point.commentRatePct)}</span>
        </div>
        <div>
          <span className="text-[#5E6B7E] font-sans block text-[11px]">Compartidos (D)</span>
          <span className="text-[#334155]">{formatPercent(point.shareRatePct)}</span>
        </div>
        <div>
          <span className="text-[#5E6B7E] font-sans block text-[11px]">Relación (A)</span>
          <span className="text-[#334155]">{formatRatio(point.viewToFollowerRatio)}</span>
        </div>
      </div>

      {point.views !== null && (
        <p className="mt-2 pt-2 border-t border-[#EFF2F6] text-[11px] text-[#5E6B7E] font-mono tabular-nums">
          Visualizaciones: {formatMetricNumber(point.views)}
        </p>
      )}
    </div>
  );
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DurationBracketSummary }>;
  metricLabel: string;
}

function EditorialBracketTooltip({
  active,
  payload,
  metricLabel,
}: BarTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;

  return (
    <div className="bg-white border border-[#BFC8D6] shadow-sm p-3 text-xs">
      <p className="font-semibold text-[#0A1628]">Franja {row.bracket}</p>
      <div className="mt-2 space-y-1 font-mono tabular-nums text-[#334155]">
        <p>
          <span className="font-sans text-[#5E6B7E]">Muestra: </span>
          {row.count} {row.count === 1 ? 'video' : 'videos'}
        </p>
        <p>
          <span className="font-sans text-[#5E6B7E]">Promedio ({metricLabel}): </span>
          <strong className="text-[#0A1628]">{formatPercent(row.avgInteractionPct)}</strong>
        </p>
        <p>
          <span className="font-sans text-[#5E6B7E]">Máximo registrado: </span>
          {formatPercent(row.maxInteractionPct)}
        </p>
      </div>
    </div>
  );
}

export function DurationInteractionChart({
  videos,
  onNavigateToDatabase,
}: DurationInteractionChartProps) {
  const [metricKey, setMetricKey] = useState<InteractionMetricKey>('totalInteractionPct');
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'Todas'>('Todas');
  const [chartView, setChartView] = useState<'scatter' | 'brackets'>('scatter');
  const [previewHypothetical, setPreviewHypothetical] = useState(false);

  const verifiedEligibleCount = useMemo(
    () => buildDurationInteractionDataset(videos, 'totalInteractionPct', 'Todas', false).length,
    [videos]
  );

  // Automatically prefer real verified data whenever at least 1 real record has verified duration + interaction
  const isShowingHypothetical = verifiedEligibleCount === 0 && previewHypothetical;
  const activeSourceRecords = isShowingHypothetical
    ? HYPOTHETICAL_CALIBRATION_RECORDS
    : videos;

  const points = useMemo(
    () =>
      buildDurationInteractionDataset(
        activeSourceRecords,
        metricKey,
        platformFilter,
        isShowingHypothetical
      ),
    [activeSourceRecords, metricKey, platformFilter, isShowingHypothetical]
  );

  const brackets = useMemo(() => aggregateByDurationBracket(points), [points]);
  const insights = useMemo(() => summarizeCorrelationInsights(points), [points]);

  const activeMetricMeta =
    METRIC_OPTIONS.find((m) => m.key === metricKey) ?? METRIC_OPTIONS[0];

  const seriesByPlatform = useMemo(
    () =>
      PLATFORMS.map((platform) => ({
        platform,
        color: PLATFORM_COLORS[platform],
        data: points.filter((p) => p.platform === platform),
      })).filter((series) => series.data.length > 0),
    [points]
  );

  const bracketChartData = useMemo(
    () =>
      brackets.map((b) => ({
        ...b,
        chartValue: b.avgInteractionPct ?? 0,
      })),
    [brackets]
  );

  const showEmptyVerifiedState = verifiedEligibleCount === 0 && !previewHypothetical;

  return (
    <section
      aria-labelledby="doc1-correlation-heading"
      className="space-y-4"
      data-testid="duration-interaction-section"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] font-medium">
            {isShowingHypothetical
              ? 'Hipótesis metodológica · Escenario ilustrativo (no comprobado)'
              : verifiedEligibleCount > 0
                ? `Dato comprobado · ${verifiedEligibleCount} de ${videos.length} publicaciones con duración e interacción verificadas`
                : `Información no disponible · 0 de ${videos.length} publicaciones con duración e interacción verificadas`}
          </p>
          <h2
            id="doc1-correlation-heading"
            className="mt-1 font-editorial text-2xl font-semibold text-[#0A1628]"
          >
            02. Correlación Duración vs. Tasa de Interacción
          </h2>
          <p className="text-sm text-[#5E6B7E] mt-1">
            Visualización interactiva de los registros verificados del Documento 02 para identificar
            franjas de duración con mayor tasa de interacción y patrones de retención.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {verifiedEligibleCount === 0 && previewHypothetical && (
            <button
              type="button"
              onClick={() => setPreviewHypothetical(false)}
              className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Volver a datos verificados
            </button>
          )}
          <button
            type="button"
            onClick={onNavigateToDatabase}
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132540] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Verificar métricas en Doc 02</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {showEmptyVerifiedState ? (
        <div className="bg-white border border-[#DCE2EA] p-6 sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#7D6232]">
              Rigor epistémico activo · Sin cifras inventadas
            </p>
            <h3 className="mt-1.5 text-base font-semibold text-[#0A1628]">
              Aún no hay publicaciones con duración y métricas verificadas para graficar
            </h3>
            <p className="mt-2 text-sm text-[#334155] leading-relaxed">
              Las 30 referencias iniciales del Documento 02 conservan sus contadores en{' '}
              <span className="font-mono text-[#0A1628]">N/D</span> hasta que registres los valores
              observados directamente en TikTok, Instagram Reels, Facebook Reels o YouTube Shorts.
              En cuanto verifiques duración y métricas (visualizaciones y al menos likes, comentarios
              o compartidos), este gráfico trazará automáticamente los puntos comprobados y su
              correlación real.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToDatabase}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132540] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Ir a Doc 02 para verificar métricas
              </button>
              <button
                type="button"
                onClick={() => setPreviewHypothetical(true)}
                className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Previsualizar con escenario hipotético
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#DCE2EA]">
          {isShowingHypothetical && (
            <div className="px-6 py-3 bg-[#FBF9F4] border-b border-[#E7DEC8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B5327]">
              <span>
                Vista de calibración con <strong>8 puntos hipotéticos ilustrativos</strong> (no
                corresponden a publicaciones reales ni alteran el Documento 02). Se reemplazará
                automáticamente al verificar métricas reales.
              </span>
            </div>
          )}

          {/* Toolbar: Chart Type + Metric Selector + Platform Filter */}
          <div className="p-5 sm:px-6 border-b border-[#EFF2F6] flex flex-wrap items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Seleccionar métrica del eje vertical"
              className="inline-flex flex-wrap items-center p-1 bg-[#EFF2F6] border border-[#DCE2EA]"
            >
              {METRIC_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMetricKey(opt.key)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    metricKey === opt.key
                      ? 'bg-white text-[#0A1628] shadow-xs'
                      : 'text-[#5E6B7E] hover:text-[#0A1628]'
                  }`}
                >
                  {opt.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="doc1-chart-platform" className="text-xs text-[#5E6B7E] whitespace-nowrap">
                  Plataforma
                </label>
                <select
                  id="doc1-chart-platform"
                  value={platformFilter}
                  onChange={(e) =>
                    setPlatformFilter(e.target.value as PlatformType | 'Todas')
                  }
                  className="px-2.5 py-1.5 text-xs text-[#0A1628] bg-white border border-[#BFC8D6] focus:outline-none focus:border-[#0A1628]"
                >
                  <option value="Todas">Todas las plataformas</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div
                role="group"
                aria-label="Cambiar tipo de gráfico"
                className="inline-flex items-center p-1 bg-[#EFF2F6] border border-[#DCE2EA]"
              >
                <button
                  type="button"
                  onClick={() => setChartView('scatter')}
                  className={`px-2.5 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    chartView === 'scatter'
                      ? 'bg-white text-[#0A1628] shadow-xs'
                      : 'text-[#5E6B7E] hover:text-[#0A1628]'
                  }`}
                >
                  <ScatterIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dispersión</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartView('brackets')}
                  className={`px-2.5 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    chartView === 'brackets'
                      ? 'bg-white text-[#0A1628] shadow-xs'
                      : 'text-[#5E6B7E] hover:text-[#0A1628]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Por rangos</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4-column quantitative summary strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#EFF2F6] border-b border-[#EFF2F6] bg-[#FAFBFD]">
            <div className="px-5 py-4">
              <p className="text-xs text-[#5E6B7E]">Muestra graficada</p>
              <p className="mt-1 font-mono tabular-nums text-lg font-semibold text-[#0A1628]">
                {insights.sampleSize}{' '}
                <span className="font-sans text-xs font-normal text-[#5E6B7E]">
                  {insights.sampleSize === 1 ? 'video' : 'videos'}
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-[#5E6B7E]">
                {platformFilter === 'Todas' ? 'Filtro: todas las plataformas' : platformFilter}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs text-[#5E6B7E]">Correlación de Pearson (r)</p>
              <p className="mt-1 font-mono tabular-nums text-lg font-semibold text-[#0A1628]">
                {insights.pearson.r !== null ? insights.pearson.r.toFixed(2) : 'N/D'}
              </p>
              <p className="mt-0.5 text-[11px] text-[#7D6232]">
                {insights.pearson.strengthLabel}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs text-[#5E6B7E]">Duración e interacción promedio</p>
              <p className="mt-1 font-mono tabular-nums text-lg font-semibold text-[#0A1628]">
                {insights.avgDurationSec !== null ? `${insights.avgDurationSec} s` : 'N/D'}
                <span className="text-[#BFC8D6] mx-1.5">/</span>
                {formatPercent(insights.avgInteractionPct)}
              </p>
              <p className="mt-0.5 text-[11px] text-[#5E6B7E]">
                Líneas de referencia en el plano
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs text-[#5E6B7E]">Franja con mayor interacción</p>
              <p className="mt-1 font-mono tabular-nums text-lg font-semibold text-[#0A1628]">
                {insights.bestBracket ? insights.bestBracket.bracket : 'N/D'}
              </p>
              <p className="mt-0.5 text-[11px] text-[#5E6B7E] font-mono tabular-nums">
                {insights.bestBracket
                  ? `Promedio ${formatPercent(insights.bestBracket.avgInteractionPct)} (${insights.bestBracket.count} reg.)`
                  : 'Sin registros en el filtro'}
              </p>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="p-5 sm:p-6">
            {points.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-[#DCE2EA] bg-[#FAFBFD]">
                <p className="text-sm font-medium text-[#0A1628]">
                  Sin datos para la combinación seleccionada ({platformFilter} ·{' '}
                  {activeMetricMeta.shortLabel})
                </p>
                <p className="mt-1 text-xs text-[#5E6B7E]">
                  Selecciona otra plataforma o cambia la métrica para visualizar los registros
                  disponibles.
                </p>
              </div>
            ) : chartView === 'scatter' ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs text-[#5E6B7E]">
                  <span>{activeMetricMeta.formulaNote}</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {seriesByPlatform.map((s) => (
                      <span key={s.platform} className="inline-flex items-center gap-1.5 text-[#334155]">
                        <span
                          className="w-2.5 h-2.5 inline-block shrink-0"
                          style={{ backgroundColor: s.color }}
                          aria-hidden="true"
                        />
                        <span>
                          {s.platform} ({s.data.length})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[340px] min-w-0" data-testid="recharts-scatter-container">
                  <ResponsiveContainer width="100%" height={340}>
                    <ScatterChart margin={{ top: 16, right: 24, bottom: 24, left: 8 }}>
                      <CartesianGrid stroke="#E6EBF2" strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="durationSeconds"
                        name="Duración"
                        unit=" s"
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tick={{ fontSize: 11, fill: '#5E6B7E', fontFamily: 'IBM Plex Mono, monospace' }}
                        stroke="#BFC8D6"
                        label={{
                          value: 'Duración del video (segundos)',
                          position: 'insideBottom',
                          offset: -14,
                          style: { fontSize: 11, fill: '#5E6B7E' },
                        }}
                      />
                      <YAxis
                        type="number"
                        dataKey="interactionRatePct"
                        name={activeMetricMeta.shortLabel}
                        unit="%"
                        tick={{ fontSize: 11, fill: '#5E6B7E', fontFamily: 'IBM Plex Mono, monospace' }}
                        stroke="#BFC8D6"
                        width={54}
                        label={{
                          value: activeMetricMeta.axisLabel,
                          angle: -90,
                          position: 'insideLeft',
                          offset: 6,
                          style: { fontSize: 11, fill: '#5E6B7E', textAnchor: 'middle' },
                        }}
                      />
                      <ZAxis
                        type="number"
                        dataKey="viewToFollowerRatio"
                        range={[70, 220]}
                        name="Relación vistas/seguidores"
                      />
                      <Tooltip
                        cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }}
                        content={<EditorialScatterTooltip metricLabel={activeMetricMeta.shortLabel} />}
                      />
                      {insights.avgDurationSec !== null && (
                        <ReferenceLine
                          x={insights.avgDurationSec}
                          stroke="#94A3B8"
                          strokeDasharray="4 4"
                          label={{
                            value: `Prom. ${insights.avgDurationSec} s`,
                            position: 'top',
                            fill: '#5E6B7E',
                            fontSize: 10,
                          }}
                        />
                      )}
                      {insights.avgInteractionPct !== null && (
                        <ReferenceLine
                          y={insights.avgInteractionPct}
                          stroke="#9E7E45"
                          strokeDasharray="4 4"
                          label={{
                            value: `Prom. ${insights.avgInteractionPct}%`,
                            position: 'insideTopRight',
                            fill: '#7D6232',
                            fontSize: 10,
                          }}
                        />
                      )}
                      {seriesByPlatform.map((series) => (
                        <Scatter
                          key={series.platform}
                          name={series.platform}
                          data={series.data}
                          fill={series.color}
                          fillOpacity={0.86}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-xs text-[#5E6B7E]">
                  Promedio de {activeMetricMeta.axisLabel.toLowerCase()} agrupado por franja de
                  duración ({activeMetricMeta.formulaNote}).
                </p>
                <div className="w-full h-[340px] min-w-0" data-testid="recharts-bar-container">
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart
                      data={bracketChartData}
                      margin={{ top: 16, right: 24, bottom: 20, left: 8 }}
                    >
                      <CartesianGrid stroke="#E6EBF2" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="bracket"
                        tick={{ fontSize: 11, fill: '#334155', fontFamily: 'IBM Plex Mono, monospace' }}
                        stroke="#BFC8D6"
                      />
                      <YAxis
                        unit="%"
                        tick={{ fontSize: 11, fill: '#5E6B7E', fontFamily: 'IBM Plex Mono, monospace' }}
                        stroke="#BFC8D6"
                        width={54}
                      />
                      <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        content={<EditorialBracketTooltip metricLabel={activeMetricMeta.shortLabel} />}
                      />
                      <Bar dataKey="chartValue" maxBarSize={64}>
                        {bracketChartData.map((entry) => {
                          const isBest =
                            insights.bestBracket?.bracket === entry.bracket && entry.count > 0;
                          return (
                            <Cell
                              key={entry.bracket}
                              fill={
                                entry.count === 0
                                  ? '#E2E8F0'
                                  : isBest
                                    ? '#9E7E45'
                                    : '#0A1628'
                              }
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Methodological footnote & cross-platform safeguard */}
            <div className="mt-4 pt-4 border-t border-[#EFF2F6] flex flex-wrap items-start justify-between gap-3 text-xs text-[#5E6B7E]">
              <p className="max-w-3xl leading-relaxed">
                {insights.distinctPlatforms > 1 && platformFilter === 'Todas'
                  ? 'Advertencia metodológica: los puntos combinan plataformas con reglas distintas de conteo de visualizaciones (TikTok, Instagram Reels, Facebook Reels y YouTube Shorts). Filtre por una plataforma específica antes de extraer conclusiones definitivas.'
                  : 'Lectura de cuadrantes: el cuadrante superior izquierdo agrupa piezas más breves que el promedio con tasa de interacción superior a la media; recuerde priorizar autoridad jurídica sobre interacción polémica.'}
              </p>
              <span className="font-mono tabular-nums text-[#334155] shrink-0">
                {chartView === 'scatter'
                  ? 'Tamaño de punto: Relación vistas/seguidores (A)'
                  : 'Barra dorada: franja con mayor promedio'}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
