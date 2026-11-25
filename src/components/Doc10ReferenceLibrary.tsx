import { useEffect, useState } from 'react';
import { Download, ExternalLink, RotateCcw } from 'lucide-react';
import type { VideoRecord } from '../types/aletheia';
import {
  computeVideoMetrics,
  formatMetricNumber,
  formatRatio,
} from '../utils/analytics';

interface Doc10ReferenceLibraryProps {
  videos: VideoRecord[];
  onUpdateAssetNotes: (
    videoId: string,
    updates: Pick<VideoRecord, 'transcript' | 'keyframeNotes' | 'shotSummary' | 'selectionReason'>
  ) => void;
  onResetLibrary: () => void;
  onExportMarkdown: () => void;
}

export function Doc10ReferenceLibrary({
  videos,
  onUpdateAssetNotes,
  onResetLibrary,
  onExportMarkdown,
}: Doc10ReferenceLibraryProps) {
  const [selectedId, setSelectedId] = useState(videos[0]?.id ?? '');
  const [savedNotice, setSavedNotice] = useState(false);

  const active = videos.find((v) => v.id === selectedId) ?? videos[0];

  const [draft, setDraft] = useState({
    transcript: active?.transcript ?? '',
    keyframeNotes: active?.keyframeNotes ?? '',
    shotSummary: active?.shotSummary ?? '',
    selectionReason: active?.selectionReason ?? '',
  });

  useEffect(() => {
    if (!active) return;
    setDraft({
      transcript: active.transcript,
      keyframeNotes: active.keyframeNotes,
      shotSummary: active.shotSummary,
      selectionReason: active.selectionReason,
    });
  }, [active]);

  function selectVideo(v: VideoRecord) {
    setSelectedId(v.id);
    setSavedNotice(false);
    setDraft({
      transcript: v.transcript,
      keyframeNotes: v.keyframeNotes,
      shotSummary: v.shotSummary,
      selectionReason: v.selectionReason,
    });
  }

  function handleSaveAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    onUpdateAssetNotes(active.id, draft);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  }

  function handleDownloadJson() {
    const blob = new Blob([JSON.stringify(videos, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aletheia-biblioteca-referencias-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!active) return null;
  const metrics = computeVideoMetrics(active);

  return (
    <div className="space-y-8">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 10 · Asset Persistente Reutilizable para Futuras Campañas
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Biblioteca de Referencias Audiovisuales ({videos.length} Assets)
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Repositorio sincronizado con el Documento 02: almacena URL original, notas de
            fotogramas clave, transcripción, descripción de planos, métricas con fecha de consulta y
            razones de selección en almacenamiento local persistente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadJson}
            className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exportar JSON</span>
          </button>
          <button
            type="button"
            onClick={onExportMarkdown}
            className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exportar Doc 10 (.md)</span>
          </button>
          <button
            type="button"
            onClick={onResetLibrary}
            className="px-3.5 py-2 text-xs font-medium text-[#5E6B7E] border border-[#DCE2EA] bg-white hover:bg-[#F7F8FA] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Restaurar base inicial</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Asset List */}
        <div className="lg:col-span-4 bg-white border border-[#DCE2EA] max-h-[680px] overflow-y-auto divide-y divide-[#EFF2F6]">
          {videos.map((v, idx) => {
            const isSelected = v.id === active.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => selectVideo(v)}
                className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#0A1628] text-white' : 'hover:bg-[#F7F8FA] text-[#0A1628]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                  <span className={isSelected ? 'text-[#DFC79A]' : 'text-[#7D6232]'}>
                    ASSET {String(idx + 1).padStart(2, '0')} · {v.country}
                  </span>
                  <span className={isSelected ? 'text-[#BFC8D6]' : 'text-[#5E6B7E]'}>
                    {v.platform}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold truncate">{v.creatorName}</p>
                <p
                  className={`text-[11px] mt-0.5 truncate ${
                    isSelected ? 'text-[#BFC8D6]' : 'text-[#5E6B7E]'
                  }`}
                >
                  {v.legalTopic}
                </p>
              </button>
            );
          })}
        </div>

        {/* Asset Record Editor */}
        <div className="lg:col-span-8 bg-white border border-[#DCE2EA] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#DCE2EA] pb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[#7D6232] font-medium">
                {active.country} · {active.platform} · Consultado el {active.consultedDate}
              </p>
              <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold text-[#0A1628]">
                {active.creatorName}
              </h2>
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#1E355A] hover:underline break-all"
              >
                <span>{active.url}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F8FA] border border-[#DCE2EA] p-4 text-xs">
            <div>
              <p className="text-[#5E6B7E]">Seguidores</p>
              <p className="font-mono text-sm font-semibold text-[#0A1628] tabular-nums mt-0.5">
                {formatMetricNumber(active.followers)}
              </p>
            </div>
            <div>
              <p className="text-[#5E6B7E]">Visualizaciones</p>
              <p className="font-mono text-sm font-semibold text-[#0A1628] tabular-nums mt-0.5">
                {formatMetricNumber(active.views)}
              </p>
            </div>
            <div>
              <p className="text-[#5E6B7E]">Rel. V/S</p>
              <p className="font-mono text-sm font-semibold text-[#0A1628] tabular-nums mt-0.5">
                {formatRatio(metrics.viewToFollowerRatio)}
              </p>
            </div>
            <div>
              <p className="text-[#5E6B7E]">Estado métricas</p>
              <p className="font-medium text-[#7D6232] mt-0.5">
                {active.metricsVerified ? 'Verificado' : 'No disponible'}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#334155] leading-relaxed">
            <strong className="text-[#0A1628]">Nota epistémica:</strong> {active.epistemicNote}
          </p>

          <form onSubmit={handleSaveAsset} className="space-y-4">
            <div>
              <label htmlFor="asset-reason" className="block text-xs font-semibold text-[#0A1628] mb-1">
                Razón estratégica de selección
              </label>
              <textarea
                id="asset-reason"
                rows={2}
                value={draft.selectionReason}
                onChange={(e) => setDraft({ ...draft, selectionReason: e.target.value })}
                className="w-full p-2.5 text-xs border border-[#BFC8D6] bg-white"
              />
            </div>

            <div>
              <label htmlFor="asset-keyframes" className="block text-xs font-semibold text-[#0A1628] mb-1">
                Registro de capturas y fotogramas clave
              </label>
              <textarea
                id="asset-keyframes"
                rows={2}
                value={draft.keyframeNotes}
                onChange={(e) => setDraft({ ...draft, keyframeNotes: e.target.value })}
                className="w-full p-2.5 text-xs border border-[#BFC8D6] bg-white"
              />
            </div>

            <div>
              <label htmlFor="asset-shots" className="block text-xs font-semibold text-[#0A1628] mb-1">
                Descripción de planos observables
              </label>
              <textarea
                id="asset-shots"
                rows={2}
                value={draft.shotSummary}
                onChange={(e) => setDraft({ ...draft, shotSummary: e.target.value })}
                className="w-full p-2.5 text-xs border border-[#BFC8D6] bg-white"
              />
            </div>

            <div>
              <label htmlFor="asset-transcript" className="block text-xs font-semibold text-[#0A1628] mb-1">
                Transcripción literal del diálogo
              </label>
              <textarea
                id="asset-transcript"
                rows={4}
                value={draft.transcript}
                onChange={(e) => setDraft({ ...draft, transcript: e.target.value })}
                className="w-full p-2.5 text-xs border border-[#BFC8D6] bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EFF2F6]">
              <span className="text-xs text-[#166534]">
                {savedNotice ? 'Asset actualizado en almacenamiento persistente.' : ''}
              </span>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] cursor-pointer"
              >
                Guardar ficha en Biblioteca
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
