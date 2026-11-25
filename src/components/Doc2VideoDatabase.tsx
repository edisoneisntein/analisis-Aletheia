import { useState } from 'react';
import { Download, ExternalLink, Plus, Search, Sparkles, X } from 'lucide-react';
import type {
  PlatformType,
  PublicationClassification,
  RegionScope,
  VideoRecord,
} from '../types/aletheia';
import {
  computeVideoMetrics,
  deriveQuantitativeClassifications,
  filterVideoDatabase,
  formatMetricNumber,
  formatPercent,
  formatRatio,
  parseOptionalPositiveInt,
  validateNewVideoInput,
  type NewVideoInput,
} from '../utils/analytics';

interface Doc2VideoDatabaseProps {
  videos: VideoRecord[];
  onAddVideo: (video: VideoRecord) => void;
  onUpdateVideoMetrics: (
    videoId: string,
    updates: Pick<
      VideoRecord,
      | 'followers'
      | 'views'
      | 'likes'
      | 'comments'
      | 'shares'
      | 'saves'
      | 'durationSeconds'
      | 'publishedDate'
      | 'consultedDate'
      | 'metricsVerified'
      | 'classifications'
      | 'epistemicNote'
    >
  ) => void;
  onExportMarkdown: () => void;
}

const PLATFORMS: Array<PlatformType | 'Todas'> = [
  'Todas',
  'TikTok',
  'Instagram Reels',
  'Facebook Reels',
  'YouTube Shorts',
];

const REGIONS: Array<RegionScope | 'Todas'> = [
  'Todas',
  'Colombia',
  'Latinoamérica',
  'Internacional',
];

const CLASSIFICATIONS: Array<PublicationClassification | 'Todas'> = [
  'Todas',
  'Viralidad extraordinaria',
  'Alto rendimiento relativo',
  'Alta interacción',
  'Alta capacidad educativa',
  'Alta capacidad de construcción de autoridad',
  'Alta capacidad comercial aparente',
];

const EMPTY_FORM: NewVideoInput = {
  creatorName: '',
  country: 'Colombia',
  region: 'Colombia',
  platform: 'TikTok',
  url: '',
  publishedDate: new Date().toISOString().slice(0, 10),
  followers: '',
  views: '',
  likes: '',
  comments: '',
  shares: '',
  saves: '',
  durationSeconds: '',
  legalTopic: '',
  narrativeFormat: '',
  observableQuality: '',
  selectionReason: '',
};

export function Doc2VideoDatabase({
  videos,
  onAddVideo,
  onUpdateVideoMetrics,
  onExportMarkdown,
}: Doc2VideoDatabaseProps) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<RegionScope | 'Todas'>('Todas');
  const [platform, setPlatform] = useState<PlatformType | 'Todas'>('Todas');
  const [classification, setClassification] = useState<
    PublicationClassification | 'Todas'
  >('Todas');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Add video modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formState, setFormState] = useState<NewVideoInput>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Verify metrics modal for an existing record
  const [editingVideo, setEditingVideo] = useState<VideoRecord | null>(null);
  const [metricDraft, setMetricDraft] = useState({
    followers: '',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    durationSeconds: '',
    publishedDate: '',
  });
  const [metricError, setMetricError] = useState('');

  // Live Google Search Grounding discovery panel
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  const [researchQuery, setResearchQuery] = useState(
    'abogados derecho comercial y laboral Colombia Reels TikTok Shorts'
  );
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState('');
  const [researchResult, setResearchResult] = useState<{
    analysis: string;
    sources: Array<{ title: string; uri: string }>;
    consultedAt: string;
  } | null>(null);

  const filtered = filterVideoDatabase(videos, {
    query,
    region,
    platform,
    classification,
    verifiedOnly,
  });

  const verifiedCount = videos.filter((v) => v.metricsVerified).length;

  function openMetricEditor(video: VideoRecord) {
    setEditingVideo(video);
    setMetricError('');
    setMetricDraft({
      followers: video.followers !== null ? String(video.followers) : '',
      views: video.views !== null ? String(video.views) : '',
      likes: video.likes !== null ? String(video.likes) : '',
      comments: video.comments !== null ? String(video.comments) : '',
      shares: video.shares !== null ? String(video.shares) : '',
      saves: video.saves !== null ? String(video.saves) : '',
      durationSeconds:
        video.durationSeconds !== null ? String(video.durationSeconds) : '',
      publishedDate:
        video.publishedDate === 'Información no disponible'
          ? ''
          : video.publishedDate,
    });
  }

  function handleSaveVerifiedMetrics(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVideo) return;

    const parsed = {
      followers: parseOptionalPositiveInt(metricDraft.followers),
      views: parseOptionalPositiveInt(metricDraft.views),
      likes: parseOptionalPositiveInt(metricDraft.likes),
      comments: parseOptionalPositiveInt(metricDraft.comments),
      shares: parseOptionalPositiveInt(metricDraft.shares),
      saves: parseOptionalPositiveInt(metricDraft.saves),
      durationSeconds: parseOptionalPositiveInt(metricDraft.durationSeconds),
    };

    if (Object.values(parsed).some((v) => Number.isNaN(v))) {
      setMetricError(
        'Todas las métricas deben ser números enteros positivos o quedar vacías si no están disponibles en la plataforma.'
      );
      return;
    }

    if (parsed.views === null && parsed.followers === null) {
      setMetricError(
        'Ingrese al menos seguidores o visualizaciones observadas para registrar la verificación.'
      );
      return;
    }

    const computed = computeVideoMetrics(parsed);
    const qualitativeBase = editingVideo.classifications.filter(
      (c) =>
        c === 'Alta capacidad educativa' ||
        c === 'Alta capacidad de construcción de autoridad' ||
        c === 'Alta capacidad comercial aparente'
    );
    const updatedClassifications = deriveQuantitativeClassifications(
      computed,
      qualitativeBase
    );
    const today = new Date().toISOString().slice(0, 10);

    onUpdateVideoMetrics(editingVideo.id, {
      ...parsed,
      publishedDate: metricDraft.publishedDate.trim() || 'Información no disponible',
      consultedDate: today,
      metricsVerified: true,
      classifications: updatedClassifications,
      epistemicNote: `Dato comprobado por inspección directa en ${editingVideo.platform} el ${today}. Las visualizaciones no representan personas únicas ni conversiones confirmadas.`,
    });

    setEditingVideo(null);
  }

  function handleCreateVideo(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateNewVideoInput(formState);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    const followers = parseOptionalPositiveInt(formState.followers);
    const views = parseOptionalPositiveInt(formState.views);
    const likes = parseOptionalPositiveInt(formState.likes);
    const comments = parseOptionalPositiveInt(formState.comments);
    const shares = parseOptionalPositiveInt(formState.shares);
    const saves = parseOptionalPositiveInt(formState.saves);
    const durationSeconds = parseOptionalPositiveInt(formState.durationSeconds);

    const computed = computeVideoMetrics({
      followers: Number.isNaN(followers) ? null : followers,
      views: Number.isNaN(views) ? null : views,
      likes: Number.isNaN(likes) ? null : likes,
      comments: Number.isNaN(comments) ? null : comments,
      shares: Number.isNaN(shares) ? null : shares,
    });

    const hasNumericVerification =
      (followers !== null && !Number.isNaN(followers)) ||
      (views !== null && !Number.isNaN(views));

    const classifications = deriveQuantitativeClassifications(computed, [
      'Alta capacidad educativa',
    ]);
    const today = new Date().toISOString().slice(0, 10);

    const record: VideoRecord = {
      id: `vid-custom-${Date.now()}`,
      creatorName: formState.creatorName.trim(),
      country: formState.country.trim(),
      region: formState.region,
      platform: formState.platform,
      url: formState.url.trim(),
      publishedDate: formState.publishedDate.trim() || 'Información no disponible',
      consultedDate: today,
      followers: Number.isNaN(followers) ? null : followers,
      views: Number.isNaN(views) ? null : views,
      likes: Number.isNaN(likes) ? null : likes,
      comments: Number.isNaN(comments) ? null : comments,
      shares: Number.isNaN(shares) ? null : shares,
      saves: Number.isNaN(saves) ? null : saves,
      durationSeconds: Number.isNaN(durationSeconds) ? null : durationSeconds,
      legalTopic: formState.legalTopic.trim(),
      narrativeFormat: formState.narrativeFormat.trim(),
      observableQuality:
        formState.observableQuality.trim() || 'Observación visual registrada por analista',
      classifications,
      metricsVerified: hasNumericVerification,
      epistemicNote: hasNumericVerification
        ? `Dato comprobado por registro directo del analista el ${today}.`
        : 'Publicación registrada; métricas cuantitativas pendientes de verificación directa.',
      selectionReason:
        formState.selectionReason.trim() ||
        'Publicación incorporada durante auditoría competitiva de ALETHEIA.',
      transcript: 'Pendiente transcripción literal en Biblioteca Persistente (Doc 10).',
      keyframeNotes: 'Pendiente registro de fotogramas clave.',
      shotSummary: formState.narrativeFormat.trim(),
      isTopTen: false,
    };

    onAddVideo(record);
    setFormState(EMPTY_FORM);
    setFormErrors({});
    setShowAddModal(false);
  }

  async function handleLiveResearch(e: React.FormEvent) {
    e.preventDefault();
    setResearchError('');
    setResearchLoading(true);
    try {
      const response = await fetch('/api/research/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: researchQuery,
          region: region === 'Todas' ? 'Colombia y Latinoamérica' : region,
          platform: platform === 'Todas' ? 'TikTok, Instagram Reels, Facebook Reels, YouTube Shorts' : platform,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setResearchError(data.error || 'No fue posible ejecutar la búsqueda fundamentada.');
      } else {
        setResearchResult(data);
      }
    } catch {
      setResearchError('Error de red al conectar con el servicio de investigación en vivo.');
    } finally {
      setResearchLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 02 · Fase 1: Selección, Registro y Cálculo de Métricas
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Base de Datos de {videos.length} Referentes Seleccionados
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Prioridad geográfica Colombia ({videos.filter((v) => v.region === 'Colombia').length}) ·
            Latinoamérica ({videos.filter((v) => v.region === 'Latinoamérica').length}) ·
            Internacional ({videos.filter((v) => v.region === 'Internacional').length}) ·{' '}
            <span className="text-[#0A1628] font-medium tabular-nums">
              {verifiedCount} con métricas verificadas
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowResearchPanel((prev) => !prev)}
            className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9E7E45]" aria-hidden="true" />
            <span>Investigación Web en Vivo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Registrar publicación verificada</span>
          </button>
          <button
            type="button"
            onClick={onExportMarkdown}
            className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exportar Doc 02 (.md)</span>
          </button>
        </div>
      </div>

      {/* Methodological Precision Disclaimer */}
      <div className="bg-white border border-[#DCE2EA] p-5 text-xs text-[#334155] leading-relaxed space-y-1.5">
        <p>
          <strong className="text-[#0A1628]">Rigor métrico y no invención de cifras:</strong>{' '}
          Todos los creadores y firmas precargados corresponden a canales públicos reales
          verificados. Las métricas por pieza individual aparecen como{' '}
          <span className="font-mono text-[#7D6232]">N/D</span> (Información no disponible) hasta
          que el analista pulse <em>“Verificar métricas”</em> e ingrese los contadores observados
          directamente en la plataforma.
        </p>
        <p>
          <strong className="text-[#0A1628]">Advertencia de comparabilidad:</strong> Las
          visualizaciones no equivalen a personas únicas, los criterios de conteo difieren entre
          TikTok, Instagram Reels, Facebook Reels y YouTube Shorts, y el alcance público nunca
          demuestra por sí mismo conversión comercial de clientes.
        </p>
      </div>

      {/* Live Grounded Google Search Panel */}
      {showResearchPanel && (
        <section
          aria-label="Investigación web fundamentada con Google Search"
          className="bg-white border border-[#0A1628] p-6 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-[#0A1628]">
                Búsqueda Web Fundamentada en Tiempo Real (Google Search Grounding)
              </h2>
              <p className="text-xs text-[#5E6B7E] mt-1">
                Descubre nuevos referentes jurídicos públicos en Colombia o Latinoamérica con citas web verificables y etiquetado epistémico automático.
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar panel de investigación web"
              onClick={() => setShowResearchPanel(false)}
              className="p-1.5 text-[#5E6B7E] hover:text-[#0A1628] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLiveResearch} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="live-research-query" className="sr-only">
              Consulta de investigación audiovisual jurídica
            </label>
            <input
              id="live-research-query"
              type="text"
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder="Ej: firmas de abogados derecho societario Colombia Reels YouTube Shorts"
              className="flex-1 px-3.5 py-2 text-sm border border-[#BFC8D6] bg-[#F7F8FA] text-[#0A1628]"
            />
            <button
              type="submit"
              disabled={researchLoading}
              className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
            >
              {researchLoading ? 'Consultando fuentes...' : 'Ejecutar búsqueda'}
            </button>
          </form>

          {researchError && (
            <p role="alert" className="text-xs text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] p-3">
              {researchError}
            </p>
          )}

          {researchResult && (
            <div className="border-t border-[#DCE2EA] pt-4 space-y-4">
              <div className="text-xs text-[#5E6B7E]">
                Consulta ejecutada: {new Date(researchResult.consultedAt).toLocaleString('es-CO')}
              </div>
              <div className="text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed max-h-[320px] overflow-y-auto pr-2">
                {researchResult.analysis}
              </div>
              {researchResult.sources.length > 0 && (
                <div className="pt-3 border-t border-[#EFF2F6]">
                  <p className="text-xs font-semibold text-[#0A1628] mb-2">
                    Fuentes web verificadas ({researchResult.sources.length}):
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    {researchResult.sources.map((src, idx) => (
                      <li key={`${src.uri}-${idx}`}>
                        <a
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1E355A] hover:underline inline-flex items-center gap-1.5"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#DCE2EA] p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="w-4 h-4 text-[#8B96A8] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="video-db-search" className="sr-only">
            Buscar por abogado, firma, país o tema jurídico
          </label>
          <input
            id="video-db-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar por firma, país, tema o formato..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#DCE2EA] bg-[#F7F8FA] text-[#0A1628]"
          />
        </div>

        <label className="sr-only" htmlFor="filter-region">
          Filtrar por región
        </label>
        <select
          id="filter-region"
          value={region}
          onChange={(e) => setRegion(e.target.value as RegionScope | 'Todas')}
          className="px-3 py-2 text-xs border border-[#DCE2EA] bg-white text-[#0A1628]"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              Región: {r}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filter-platform">
          Filtrar por plataforma
        </label>
        <select
          id="filter-platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as PlatformType | 'Todas')}
          className="px-3 py-2 text-xs border border-[#DCE2EA] bg-white text-[#0A1628]"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              Plataforma: {p}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filter-classification">
          Filtrar por clasificación
        </label>
        <select
          id="filter-classification"
          value={classification}
          onChange={(e) =>
            setClassification(e.target.value as PublicationClassification | 'Todas')
          }
          className="px-3 py-2 text-xs border border-[#DCE2EA] bg-white text-[#0A1628]"
        >
          {CLASSIFICATIONS.map((c) => (
            <option key={c} value={c}>
              Clasificación: {c}
            </option>
          ))}
        </select>

        <label className="inline-flex items-center gap-2 text-xs text-[#334155] cursor-pointer px-2">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-[#0A1628]"
          />
          <span className="whitespace-nowrap">Solo con métricas verificadas</span>
        </label>
      </div>

      {/* High-density Table */}
      <div className="bg-white border border-[#DCE2EA] overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-medium text-[#0A1628]">
              Ninguna publicación coincide con los filtros actuales.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRegion('Todas');
                setPlatform('Todas');
                setClassification('Todas');
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] hover:bg-[#EFF2F6] cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[940px]">
            <thead>
              <tr className="border-b border-[#DCE2EA] bg-[#F7F8FA] text-[11px] font-semibold text-[#5E6B7E]">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2.5">Abogado / Firma</th>
                <th className="py-3 px-2.5">Plataforma · Tema</th>
                <th className="py-3 px-2 text-right">Seg.</th>
                <th className="py-3 px-2 text-right">Vis.</th>
                <th className="py-3 px-2 text-right">V/S</th>
                <th className="py-3 px-2 text-right">Likes</th>
                <th className="py-3 px-2 text-right">Com.</th>
                <th className="py-3 px-2 text-right">Comp.</th>
                <th className="py-3 px-2.5">Clasificación</th>
                <th className="py-3 px-2.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2F6] text-xs">
              {filtered.map((video, index) => {
                const m = computeVideoMetrics(video);
                const locationLabel =
                  video.country === video.region
                    ? video.country
                    : `${video.country} · ${video.region}`;
                return (
                  <tr key={video.id} className="hover:bg-[#F7F8FA]/80 align-top">
                    <td className="py-3 px-2 font-mono text-[#8B96A8] tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-2.5 max-w-[190px]">
                      <p className="font-semibold text-[#0A1628]">{video.creatorName}</p>
                      <p className="text-[#5E6B7E] mt-0.5">
                        {locationLabel}
                        {video.isTopTen ? ' · Top 10' : ''}
                      </p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#7D6232] hover:underline"
                      >
                        <span>Referencia</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </td>
                    <td className="py-3 px-2.5 max-w-[215px]">
                      <p className="font-medium text-[#0A1628]">{video.platform}</p>
                      <p className="text-[#334155] mt-0.5">{video.legalTopic}</p>
                      <p className="text-[#5E6B7E] mt-0.5">{video.narrativeFormat}</p>
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-[#0A1628] whitespace-nowrap">
                      {formatMetricNumber(video.followers)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-[#0A1628] whitespace-nowrap">
                      {formatMetricNumber(video.views)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums font-medium text-[#0A1628] whitespace-nowrap">
                      {formatRatio(m.viewToFollowerRatio)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-[#334155] whitespace-nowrap">
                      {formatPercent(m.likeRatePct)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-[#334155] whitespace-nowrap">
                      {formatPercent(m.commentRatePct)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-[#334155] whitespace-nowrap">
                      {formatPercent(m.shareRatePct)}
                    </td>
                    <td className="py-3 px-2.5 max-w-[155px] text-[#334155]">
                      <p>{video.classifications.join(' · ')}</p>
                      <p className="text-[11px] text-[#7D6232] mt-1">
                        {video.metricsVerified
                          ? `Verificado (${video.consultedDate})`
                          : 'Métricas: N/D'}
                      </p>
                    </td>
                    <td className="py-3 px-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => openMetricEditor(video)}
                        aria-label={`Verificar métricas de ${video.creatorName}`}
                        className="px-2.5 py-1.5 text-[11px] font-medium text-[#0A1628] border border-[#BFC8D6] hover:bg-[#EFF2F6] whitespace-nowrap cursor-pointer"
                      >
                        {video.metricsVerified ? 'Editar' : 'Verificar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Verify Metrics for Existing Record */}
      {editingVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="verify-metrics-title"
          className="fixed inset-0 z-50 bg-[#060E1B]/60 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#DCE2EA] w-full max-w-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE2EA] pb-3">
              <div>
                <p className="text-xs text-[#7D6232] font-medium">
                  Verificación directa en {editingVideo.platform}
                </p>
                <h2 id="verify-metrics-title" className="font-editorial text-2xl font-semibold text-[#0A1628]">
                  {editingVideo.creatorName}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar diálogo de verificación de métricas"
                onClick={() => setEditingVideo(null)}
                className="p-1.5 text-[#5E6B7E] hover:text-[#0A1628] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVerifiedMetrics} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="m-followers" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Seguidores observados
                  </label>
                  <input
                    id="m-followers"
                    type="text"
                    value={metricDraft.followers}
                    onChange={(e) => setMetricDraft({ ...metricDraft, followers: e.target.value })}
                    placeholder="Ej: 120000"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="m-views" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Visualizaciones observadas
                  </label>
                  <input
                    id="m-views"
                    type="text"
                    value={metricDraft.views}
                    onChange={(e) => setMetricDraft({ ...metricDraft, views: e.target.value })}
                    placeholder="Ej: 450000"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="m-likes" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Likes
                  </label>
                  <input
                    id="m-likes"
                    type="text"
                    value={metricDraft.likes}
                    onChange={(e) => setMetricDraft({ ...metricDraft, likes: e.target.value })}
                    placeholder="Vacío si no disponible"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="m-comments" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Comentarios
                  </label>
                  <input
                    id="m-comments"
                    type="text"
                    value={metricDraft.comments}
                    onChange={(e) => setMetricDraft({ ...metricDraft, comments: e.target.value })}
                    placeholder="Vacío si no disponible"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="m-shares" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Compartidos (si disponibles)
                  </label>
                  <input
                    id="m-shares"
                    type="text"
                    value={metricDraft.shares}
                    onChange={(e) => setMetricDraft({ ...metricDraft, shares: e.target.value })}
                    placeholder="Vacío si no disponible"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="m-duration" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Duración (segundos)
                  </label>
                  <input
                    id="m-duration"
                    type="text"
                    value={metricDraft.durationSeconds}
                    onChange={(e) =>
                      setMetricDraft({ ...metricDraft, durationSeconds: e.target.value })
                    }
                    placeholder="Ej: 48"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                  />
                </div>
              </div>

              {metricError && (
                <p role="alert" className="text-xs text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] p-2.5">
                  {metricError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-[#EFF2F6]">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-xs font-medium text-[#5E6B7E] border border-[#DCE2EA] hover:bg-[#F7F8FA] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] cursor-pointer"
                >
                  Guardar y calcular fórmulas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register New Verified Video */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-video-title"
          className="fixed inset-0 z-50 bg-[#060E1B]/60 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#DCE2EA] w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE2EA] pb-3">
              <div>
                <p className="text-xs text-[#7D6232] font-medium">
                  Documento 02 y Documento 10 · Registro Persistente
                </p>
                <h2 id="add-video-title" className="font-editorial text-2xl font-semibold text-[#0A1628]">
                  Registrar Publicación Verificada
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar formulario de nueva publicación"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-[#5E6B7E] hover:text-[#0A1628] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-creator" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Abogado o firma *
                  </label>
                  <input
                    id="new-creator"
                    type="text"
                    value={formState.creatorName}
                    onChange={(e) => setFormState({ ...formState, creatorName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6]"
                  />
                  {formErrors.creatorName && (
                    <p className="text-xs text-[#991B1B] mt-1">{formErrors.creatorName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="new-country" className="block text-xs font-medium text-[#0A1628] mb-1">
                    País *
                  </label>
                  <input
                    id="new-country"
                    type="text"
                    value={formState.country}
                    onChange={(e) => setFormState({ ...formState, country: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6]"
                  />
                  {formErrors.country && (
                    <p className="text-xs text-[#991B1B] mt-1">{formErrors.country}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="new-region" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Ámbito geográfico
                  </label>
                  <select
                    id="new-region"
                    value={formState.region}
                    onChange={(e) =>
                      setFormState({ ...formState, region: e.target.value as RegionScope })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] bg-white"
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="Latinoamérica">Latinoamérica</option>
                    <option value="Internacional">Internacional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="new-platform" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Plataforma
                  </label>
                  <select
                    id="new-platform"
                    value={formState.platform}
                    onChange={(e) =>
                      setFormState({ ...formState, platform: e.target.value as PlatformType })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6] bg-white"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="Facebook Reels">Facebook Reels</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="new-url" className="block text-xs font-medium text-[#0A1628] mb-1">
                    URL original verificable *
                  </label>
                  <input
                    id="new-url"
                    type="url"
                    value={formState.url}
                    onChange={(e) => setFormState({ ...formState, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6]"
                  />
                  {formErrors.url && <p className="text-xs text-[#991B1B] mt-1">{formErrors.url}</p>}
                </div>

                <div>
                  <label htmlFor="new-topic" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Tema jurídico *
                  </label>
                  <input
                    id="new-topic"
                    type="text"
                    value={formState.legalTopic}
                    onChange={(e) => setFormState({ ...formState, legalTopic: e.target.value })}
                    placeholder="Ej: Contratos S.A.S. / Despido sin justa causa"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6]"
                  />
                  {formErrors.legalTopic && (
                    <p className="text-xs text-[#991B1B] mt-1">{formErrors.legalTopic}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="new-format" className="block text-xs font-medium text-[#0A1628] mb-1">
                    Formato narrativo *
                  </label>
                  <input
                    id="new-format"
                    type="text"
                    value={formState.narrativeFormat}
                    onChange={(e) => setFormState({ ...formState, narrativeFormat: e.target.value })}
                    placeholder="Ej: Mitos y realidades a cámara"
                    className="w-full px-3 py-2 text-sm border border-[#BFC8D6]"
                  />
                  {formErrors.narrativeFormat && (
                    <p className="text-xs text-[#991B1B] mt-1">{formErrors.narrativeFormat}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-[#EFF2F6] pt-4">
                <p className="text-xs font-semibold text-[#0A1628] mb-3">
                  Métricas observadas directamente (deje vacío cualquier dato no disponible)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      ['followers', 'Seguidores'],
                      ['views', 'Visualizaciones'],
                      ['likes', 'Likes'],
                      ['comments', 'Comentarios'],
                      ['shares', 'Compartidos'],
                      ['durationSeconds', 'Duración (s)'],
                    ] as const
                  ).map(([field, label]) => (
                    <div key={field}>
                      <label htmlFor={`new-${field}`} className="block text-xs text-[#5E6B7E] mb-1">
                        {label}
                      </label>
                      <input
                        id={`new-${field}`}
                        type="text"
                        value={formState[field]}
                        onChange={(e) =>
                          setFormState({ ...formState, [field]: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-sm border border-[#BFC8D6] font-mono tabular-nums"
                      />
                      {formErrors[field] && (
                        <p className="text-[11px] text-[#991B1B] mt-0.5">{formErrors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EFF2F6]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5E6B7E] border border-[#DCE2EA] hover:bg-[#F7F8FA] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] cursor-pointer"
                >
                  Registrar en Base de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
