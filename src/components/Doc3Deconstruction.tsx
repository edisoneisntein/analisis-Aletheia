import { useState } from 'react';
import { Download, Plus, Sparkles, X } from 'lucide-react';
import type { ShotDeconstructionRow, VideoDeconstruction } from '../types/aletheia';

interface Doc3DeconstructionProps {
  deconstructions: VideoDeconstruction[];
  onAddShot: (videoId: string, shot: ShotDeconstructionRow) => void;
  onMarkVerified: (videoId: string) => void;
  onExportMarkdown: () => void;
}

export function Doc3Deconstruction({
  deconstructions,
  onAddShot,
  onMarkVerified,
  onExportMarkdown,
}: Doc3DeconstructionProps) {
  const [selectedVideoId, setSelectedVideoId] = useState(
    deconstructions[0]?.videoId ?? ''
  );
  const [showAddShotForm, setShowAddShotForm] = useState(false);
  const [shotDraft, setShotDraft] = useState({
    timecodeIn: '00:42',
    timecodeOut: '00:48',
    durationSec: '6',
    shotType: 'Plano medio corto',
    framingSize: 'Encuadre vertical 9:16 centrado',
    cameraAngle: 'Nivel de ojos',
    cameraMovement: 'Estático',
    subjectAction: '',
    audioMusic: '',
    onScreenText: '',
    narrativeFunction: '',
  });
  const [shotError, setShotError] = useState('');

  // Optional AI-assisted analysis based ONLY on analyst-observed notes
  const [showAiBox, setShowAiBox] = useState(false);
  const [observedNotes, setObservedNotes] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiReport, setAiReport] = useState('');

  const active =
    deconstructions.find((d) => d.videoId === selectedVideoId) ?? deconstructions[0];

  if (!active) return null;

  function handleSaveShot(e: React.FormEvent) {
    e.preventDefault();
    if (!shotDraft.subjectAction.trim() || !shotDraft.narrativeFunction.trim()) {
      setShotError(
        'Indique al menos la acción observada y la función narrativa del plano.'
      );
      return;
    }

    const dur = Number(shotDraft.durationSec);
    if (!Number.isFinite(dur) || dur <= 0) {
      setShotError('La duración debe ser un número mayor a 0.');
      return;
    }

    onAddShot(active.videoId, {
      id: `shot-${Date.now()}`,
      timecodeIn: shotDraft.timecodeIn.trim() || '00:00',
      timecodeOut: shotDraft.timecodeOut.trim() || '00:05',
      durationSec: dur,
      shotType: shotDraft.shotType.trim(),
      framingSize: shotDraft.framingSize.trim(),
      cameraAngle: shotDraft.cameraAngle.trim(),
      cameraMovement: shotDraft.cameraMovement.trim(),
      subjectAction: shotDraft.subjectAction.trim(),
      gazeDirection: 'Directa a lente (observación registrada)',
      facialExpression: 'Registrada por analista',
      lighting: 'Registrada por analista',
      colorimetry: 'Registrada por analista',
      setDesign: 'Registrada por analista',
      onScreenText: shotDraft.onScreenText.trim() || 'Sin texto en pantalla',
      transition: 'Corte limpio',
      audioMusic: shotDraft.audioMusic.trim() || 'Voz directa',
      narrativeFunction: shotDraft.narrativeFunction.trim(),
      epistemicStatus: 'Observación visual',
    });

    setShotError('');
    setShotDraft((prev) => ({
      ...prev,
      subjectAction: '',
      audioMusic: '',
      onScreenText: '',
      narrativeFunction: '',
    }));
    setShowAddShotForm(false);
  }

  async function handleRunAiAudit(e: React.FormEvent) {
    e.preventDefault();
    setAiError('');
    setAiReport('');
    if (observedNotes.trim().length < 20) {
      setAiError(
        'Pegue al menos 20 caracteres de transcripción o notas observadas reales para auditar sin inventar planos.'
      );
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-piece', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: active.creatorName,
          platform: active.platform,
          topic: active.title,
          observedNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'No se pudo completar la auditoría asistida.');
      } else {
        setAiReport(data.report);
      }
    } catch {
      setAiError('Error de conexión con el servidor de análisis.');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 03 · Fase 2: Ingeniería Inversa Audiovisual y Narrativa
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Descomposición Cinematográfica de los 10 Mejores Referentes
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Estructura temporal por plano, tabla técnica de 7 columnas, análisis cinematográfico y
            arquitectura psicológica-narrativa.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exportar Doc 03 (.md)</span>
        </button>
      </div>

      {/* Top 10 Selector Grid */}
      <div
        role="tablist"
        aria-label="Seleccionar referente del Top 10"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2"
      >
        {deconstructions.map((item) => {
          const isSelected = item.videoId === active.videoId;
          return (
            <button
              key={item.videoId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setSelectedVideoId(item.videoId);
                setAiReport('');
                setAiError('');
              }}
              className={`p-3 text-left border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#0A1628] text-white border-[#0A1628]'
                  : 'bg-white text-[#0A1628] border-[#DCE2EA] hover:bg-[#F7F8FA]'
              }`}
            >
              <p
                className={`font-mono text-[11px] tabular-nums ${
                  isSelected ? 'text-[#DFC79A]' : 'text-[#7D6232]'
                }`}
              >
                #{String(item.rank).padStart(2, '0')} · {item.country}
              </p>
              <p className="mt-1 text-xs font-semibold truncate">{item.creatorName}</p>
              <p
                className={`text-[11px] mt-0.5 truncate ${
                  isSelected ? 'text-[#BFC8D6]' : 'text-[#5E6B7E]'
                }`}
              >
                {item.platform}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Video Detail */}
      <section className="bg-white border border-[#DCE2EA] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE2EA] pb-5">
          <div className="max-w-3xl">
            <p className="text-xs text-[#7D6232] font-medium">
              Referente #{String(active.rank).padStart(2, '0')} · {active.country} ·{' '}
              {active.platform} · {active.inspectionStatus}
            </p>
            <h2 className="mt-1.5 font-editorial text-2xl sm:text-3xl font-semibold text-[#0A1628]">
              {active.creatorName} — {active.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {active.inspectionStatus !== 'Verificado fotograma a fotograma' && (
              <button
                type="button"
                onClick={() => onMarkVerified(active.videoId)}
                className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#9E7E45] hover:bg-[#F7F8FA] whitespace-nowrap cursor-pointer"
              >
                Marcar verificado fotograma a fotograma
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAiBox((prev) => !prev)}
              className="px-3.5 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] hover:bg-[#EFF2F6] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9E7E45]" aria-hidden="true" />
              <span>Auditar transcripción observada</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddShotForm((prev) => !prev)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Agregar plano observado</span>
            </button>
          </div>
        </div>

        {/* Epistemic Disclosure */}
        <div className="bg-[#F7F8FA] border border-[#DCE2EA] p-4 text-xs text-[#334155] leading-relaxed">
          <strong className="text-[#0A1628]">Transparencia de inspección:</strong>{' '}
          {active.inspectionDisclosure}
        </div>

        {/* Optional AI Observed-Notes Audit */}
        {showAiBox && (
          <div className="border border-[#0A1628] p-5 space-y-3 bg-[#F7F8FA]/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0A1628]">
                Auditoría Narrativa y Jurídica (Sobre Transcripción Real del Analista)
              </h3>
              <button
                type="button"
                aria-label="Cerrar auditoría asistida"
                onClick={() => setShowAiBox(false)}
                className="p-1 text-[#5E6B7E] hover:text-[#0A1628] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRunAiAudit} className="space-y-3">
              <label htmlFor="observed-notes-input" className="block text-xs text-[#5E6B7E]">
                Pegue aquí la transcripción literal o notas reales tomadas al ver el video en la plataforma:
              </label>
              <textarea
                id="observed-notes-input"
                rows={4}
                value={observedNotes}
                onChange={(e) => setObservedNotes(e.target.value)}
                placeholder="Ej: 00:00–00:03 El abogado dice '...' con plano medio corto..."
                className="w-full p-3 text-sm border border-[#BFC8D6] bg-white"
              />
              {aiError && (
                <p role="alert" className="text-xs text-[#991B1B]">
                  {aiError}
                </p>
              )}
              <button
                type="submit"
                disabled={aiLoading}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] disabled:opacity-60 cursor-pointer"
              >
                {aiLoading ? 'Auditando notas...' : 'Ejecutar auditoría técnica y jurídica'}
              </button>
            </form>
            {aiReport && (
              <div className="mt-3 pt-3 border-t border-[#DCE2EA] text-sm text-[#1E293B] whitespace-pre-wrap leading-relaxed">
                {aiReport}
              </div>
            )}
          </div>
        )}

        {/* Inline Add Shot Form */}
        {showAddShotForm && (
          <form
            onSubmit={handleSaveShot}
            className="border border-[#BFC8D6] bg-[#F7F8FA] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0A1628]">
                Registrar Plano Verificado (Observación Visual Directa)
              </h3>
              <button
                type="button"
                aria-label="Cancelar registro de plano"
                onClick={() => setShowAddShotForm(false)}
                className="p-1 text-[#5E6B7E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="shot-in" className="block text-xs text-[#5E6B7E] mb-1">
                  Entrada (mm:ss)
                </label>
                <input
                  id="shot-in"
                  type="text"
                  value={shotDraft.timecodeIn}
                  onChange={(e) => setShotDraft({ ...shotDraft, timecodeIn: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white font-mono"
                />
              </div>
              <div>
                <label htmlFor="shot-out" className="block text-xs text-[#5E6B7E] mb-1">
                  Salida (mm:ss)
                </label>
                <input
                  id="shot-out"
                  type="text"
                  value={shotDraft.timecodeOut}
                  onChange={(e) => setShotDraft({ ...shotDraft, timecodeOut: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white font-mono"
                />
              </div>
              <div>
                <label htmlFor="shot-dur" className="block text-xs text-[#5E6B7E] mb-1">
                  Duración (seg)
                </label>
                <input
                  id="shot-dur"
                  type="text"
                  value={shotDraft.durationSec}
                  onChange={(e) => setShotDraft({ ...shotDraft, durationSec: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white font-mono"
                />
              </div>
              <div>
                <label htmlFor="shot-type" className="block text-xs text-[#5E6B7E] mb-1">
                  Tipo de plano
                </label>
                <input
                  id="shot-type"
                  type="text"
                  value={shotDraft.shotType}
                  onChange={(e) => setShotDraft({ ...shotDraft, shotType: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="shot-action" className="block text-xs text-[#5E6B7E] mb-1">
                  Acción observada *
                </label>
                <input
                  id="shot-action"
                  type="text"
                  value={shotDraft.subjectAction}
                  onChange={(e) =>
                    setShotDraft({ ...shotDraft, subjectAction: e.target.value })
                  }
                  placeholder="Ej: Vocero señala cláusula y hace pausa de énfasis"
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white"
                />
              </div>
              <div>
                <label htmlFor="shot-function" className="block text-xs text-[#5E6B7E] mb-1">
                  Función narrativa *
                </label>
                <input
                  id="shot-function"
                  type="text"
                  value={shotDraft.narrativeFunction}
                  onChange={(e) =>
                    setShotDraft({ ...shotDraft, narrativeFunction: e.target.value })
                  }
                  placeholder="Ej: Cierre con advertencia legal preventiva"
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white"
                />
              </div>
              <div>
                <label htmlFor="shot-audio" className="block text-xs text-[#5E6B7E] mb-1">
                  Audio / Música
                </label>
                <input
                  id="shot-audio"
                  type="text"
                  value={shotDraft.audioMusic}
                  onChange={(e) => setShotDraft({ ...shotDraft, audioMusic: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white"
                />
              </div>
              <div>
                <label htmlFor="shot-text" className="block text-xs text-[#5E6B7E] mb-1">
                  Texto en pantalla
                </label>
                <input
                  id="shot-text"
                  type="text"
                  value={shotDraft.onScreenText}
                  onChange={(e) => setShotDraft({ ...shotDraft, onScreenText: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#BFC8D6] bg-white"
                />
              </div>
            </div>
            {shotError && (
              <p role="alert" className="text-xs text-[#991B1B]">
                {shotError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddShotForm(false)}
                className="px-3 py-1.5 text-xs border border-[#DCE2EA] bg-white text-[#5E6B7E] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs bg-[#0A1628] text-white cursor-pointer"
              >
                Añadir a la tabla
              </button>
            </div>
          </form>
        )}

        {/* Required 7-Column Shot Deconstruction Table */}
        <div>
          <h3 className="text-sm font-semibold text-[#0A1628] mb-3">
            Tabla de Descomposición por Plano ({active.shots.length} planos registrados)
          </h3>
          <div className="border border-[#DCE2EA] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-[#F7F8FA] border-b border-[#DCE2EA] text-[11px] font-semibold text-[#5E6B7E]">
                  <th className="py-2.5 px-3">Tiempo</th>
                  <th className="py-2.5 px-3">Plano</th>
                  <th className="py-2.5 px-3">Cámara</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Audio</th>
                  <th className="py-2.5 px-3">Texto</th>
                  <th className="py-2.5 px-3">Función</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFF2F6] text-xs">
                {active.shots.map((shot) => (
                  <tr key={shot.id} className="align-top hover:bg-[#F7F8FA]/70">
                    <td className="py-3 px-3 font-mono tabular-nums whitespace-nowrap text-[#0A1628]">
                      <p>
                        {shot.timecodeIn}–{shot.timecodeOut}
                      </p>
                      <p className="text-[11px] text-[#5E6B7E]">{shot.durationSec}s</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#0A1628]">{shot.shotType}</p>
                      <p className="text-[#5E6B7E] mt-0.5">{shot.framingSize}</p>
                      <p className="text-[11px] text-[#7D6232] mt-1">{shot.epistemicStatus}</p>
                    </td>
                    <td className="py-3 px-3 text-[#334155]">
                      <p>{shot.cameraAngle}</p>
                      <p className="text-[#5E6B7E] mt-0.5">{shot.cameraMovement}</p>
                    </td>
                    <td className="py-3 px-3 text-[#334155]">
                      <p>{shot.subjectAction}</p>
                      <p className="text-[11px] text-[#5E6B7E] mt-1">
                        Mirada: {shot.gazeDirection} · Luz: {shot.lighting}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-[#334155]">{shot.audioMusic}</td>
                    <td className="py-3 px-3 text-[#334155]">{shot.onScreenText}</td>
                    <td className="py-3 px-3 text-[#0A1628] font-medium">
                      {shot.narrativeFunction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dual Analysis Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div className="border border-[#DCE2EA] p-5 space-y-3">
            <h3 className="font-editorial text-xl font-semibold text-[#0A1628]">
              Análisis Cinematográfico
            </h3>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="font-semibold text-[#0A1628]">Inicio y gancho visual</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.cinematographicAnalysis.openingAndVisualHook}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Desarrollo del argumento</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.cinematographicAnalysis.conflictDevelopment}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Cambios visuales y ritmo</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.cinematographicAnalysis.visualChangesAndPacing}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Señales de credibilidad</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.cinematographicAnalysis.credibilitySignals}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Clímax y cierre</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.cinematographicAnalysis.climaxAndEnding}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-[#DCE2EA] p-5 space-y-3">
            <h3 className="font-editorial text-xl font-semibold text-[#0A1628]">
              Análisis Psicológico y Narrativo
            </h3>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="font-semibold text-[#0A1628]">Mecanismo de atención</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.psychologicalAnalysis.attentionMechanism}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Dolor del público y tensión</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.psychologicalAnalysis.painPointAndTension}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Revelación y resolución</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.psychologicalAnalysis.revelationAndResolution}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Construcción de autoridad</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.psychologicalAnalysis.authorityConstruction}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#0A1628]">Llamada a la acción</dt>
                <dd className="text-[#334155] mt-0.5 leading-relaxed">
                  {active.psychologicalAnalysis.callToActionAnalysis}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
