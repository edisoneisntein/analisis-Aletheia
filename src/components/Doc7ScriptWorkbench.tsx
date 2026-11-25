import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  ALETHEIA_BRAND_IDENTITY,
  PRODUCTION_SHOTS,
  WINNING_CONCEPT_DOC,
} from '../data/productionData';

interface Doc7ScriptWorkbenchProps {
  onExportMarkdown: () => void;
}

export function Doc7ScriptWorkbench({ onExportMarkdown }: Doc7ScriptWorkbenchProps) {
  const [viewMode, setViewMode] = useState<'literario' | 'tecnico'>('tecnico');
  const [selectedShotNumber, setSelectedShotNumber] = useState<number>(1);

  const selectedShot =
    PRODUCTION_SHOTS.find((s) => s.shotNumber === selectedShotNumber) ??
    PRODUCTION_SHOTS[0];

  return (
    <div className="space-y-8">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 07 · Fase 4: Guion Literario y Técnico Integral
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Guion Completo — “{WINNING_CONCEPT_DOC.campaignTitle}”
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Duración total: 00:55 · 12 planos de precisión con Dirección de Fotografía, Actuación,
            Diseño Sonoro y Edición.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Cambiar entre guion literario y guion técnico"
            className="inline-flex items-center p-1 bg-[#EFF2F6] border border-[#DCE2EA]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'literario'}
              onClick={() => setViewMode('literario')}
              className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                viewMode === 'literario'
                  ? 'bg-white text-[#0A1628] shadow-xs'
                  : 'text-[#5E6B7E] hover:text-[#0A1628]'
              }`}
            >
              A. Guion Literario
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'tecnico'}
              onClick={() => setViewMode('tecnico')}
              className={`px-3.5 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                viewMode === 'tecnico'
                  ? 'bg-white text-[#0A1628] shadow-xs'
                  : 'text-[#5E6B7E] hover:text-[#0A1628]'
              }`}
            >
              B. Guion Técnico (12 Planos)
            </button>
          </div>

          <button
            type="button"
            onClick={onExportMarkdown}
            className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exportar Doc 07 (.md)</span>
          </button>
        </div>
      </div>

      {viewMode === 'literario' ? (
        <article className="bg-white border border-[#DCE2EA] p-8 sm:p-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-[#DCE2EA] pb-4">
              <p className="text-xs text-[#7D6232] tracking-wider font-medium">
                GUION LITERARIO ÍNTEGRO · DURACIÓN 55 SEGUNDOS
              </p>
              <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#0A1628]">
                {WINNING_CONCEPT_DOC.campaignTitle}
              </h2>
              <p className="text-xs text-[#5E6B7E] mt-1">
                {ALETHEIA_BRAND_IDENTITY.name} · {ALETHEIA_BRAND_IDENTITY.location}
              </p>
            </div>

            <div className="space-y-6">
              {PRODUCTION_SHOTS.map((shot) => (
                <div key={shot.shotNumber} className="pb-5 border-b border-[#EFF2F6] last:border-b-0">
                  <p className="font-mono text-xs text-[#7D6232] tabular-nums">
                    [{shot.timecodeIn}–{shot.timecodeOut}] · PLANO {String(shot.shotNumber).padStart(2, '0')} · {shot.scene}
                  </p>
                  <p className="mt-2 font-editorial text-xl text-[#0A1628] leading-relaxed">
                    “{shot.literaryVoiceover}”
                  </p>
                  <p className="mt-2 text-xs text-[#5E6B7E] leading-relaxed">
                    <strong className="text-[#0A1628]">Acción visual:</strong> {shot.visualDescription}
                  </p>
                  <p className="mt-1 text-xs text-[#5E6B7E]">
                    <strong className="text-[#0A1628]">Texto compuesto en postproducción:</strong>{' '}
                    {shot.postProdText}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DCE2EA] text-xs text-[#5E6B7E] leading-relaxed">
              <strong className="text-[#0A1628]">Aviso legal obligatorio en postproducción:</strong>{' '}
              {ALETHEIA_BRAND_IDENTITY.mandatoryLegalDisclaimer}
            </div>
          </div>
        </article>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Shot Timeline Selector */}
          <div className="lg:col-span-4 bg-white border border-[#DCE2EA] divide-y divide-[#EFF2F6]">
            {PRODUCTION_SHOTS.map((shot) => {
              const isSelected = shot.shotNumber === selectedShot.shotNumber;
              return (
                <button
                  key={shot.shotNumber}
                  type="button"
                  onClick={() => setSelectedShotNumber(shot.shotNumber)}
                  className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#0A1628] text-white' : 'hover:bg-[#F7F8FA] text-[#0A1628]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                    <span className={isSelected ? 'text-[#DFC79A]' : 'text-[#7D6232]'}>
                      PLANO {String(shot.shotNumber).padStart(2, '0')}
                    </span>
                    <span className={isSelected ? 'text-[#BFC8D6]' : 'text-[#5E6B7E]'}>
                      {shot.timecodeIn}–{shot.timecodeOut} ({shot.durationSec}s)
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold truncate">{shot.shotTitle}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed Technical Spec Sheet */}
          <div className="lg:col-span-8 bg-white border border-[#DCE2EA] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#DCE2EA] pb-4">
              <p className="font-mono text-xs text-[#7D6232] tabular-nums">
                PLANO {String(selectedShot.shotNumber).padStart(2, '0')} · {selectedShot.timecodeIn}–
                {selectedShot.timecodeOut} ({selectedShot.durationSec}s) · {selectedShot.scene}
              </p>
              <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold text-[#0A1628]">
                {selectedShot.shotTitle}
              </h2>
              <p className="mt-2 font-editorial italic text-lg text-[#334155]">
                “{selectedShot.literaryVoiceover}”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <section className="border border-[#DCE2EA] p-4 space-y-2">
                <h3 className="text-sm font-semibold text-[#0A1628]">E. Dirección de Fotografía</h3>
                <p><strong>Lente / Óptica:</strong> {selectedShot.photography.lens}</p>
                <p><strong>Distancia y Altura:</strong> {selectedShot.photography.distance} · {selectedShot.photography.height}</p>
                <p><strong>Ángulo:</strong> {selectedShot.photography.angle}</p>
                <p><strong>Movimiento de cámara:</strong> {selectedShot.photography.cameraMovement}</p>
                <p><strong>Composición:</strong> {selectedShot.photography.composition}</p>
                <p><strong>Iluminación:</strong> {selectedShot.photography.lighting}</p>
                <p><strong>Profundidad de campo:</strong> {selectedShot.photography.depthOfField}</p>
                <p><strong>Tratamiento cromático:</strong> {selectedShot.photography.colorTreatment}</p>
              </section>

              <section className="border border-[#DCE2EA] p-4 space-y-2">
                <h3 className="text-sm font-semibold text-[#0A1628]">F. Dirección de Actores</h3>
                <p><strong>Postura:</strong> {selectedShot.acting.posture}</p>
                <p><strong>Gestos:</strong> {selectedShot.acting.gestures}</p>
                <p><strong>Movimiento:</strong> {selectedShot.acting.movement}</p>
                <p><strong>Expresión:</strong> {selectedShot.acting.expression}</p>
                <p><strong>Mirada:</strong> {selectedShot.acting.gaze}</p>
                <p><strong>Interpretación:</strong> {selectedShot.acting.delivery}</p>
                <p><strong>Ritmo de habla:</strong> {selectedShot.acting.speechPace}</p>
              </section>

              <section className="border border-[#DCE2EA] p-4 space-y-2">
                <h3 className="text-sm font-semibold text-[#0A1628]">G. Diseño Sonoro</h3>
                <p><strong>Música:</strong> {selectedShot.soundDesign.music}</p>
                <p><strong>Ambiente:</strong> {selectedShot.soundDesign.ambience}</p>
                <p><strong>Efectos (SFX):</strong> {selectedShot.soundDesign.sfx}</p>
                <p><strong>Silencios:</strong> {selectedShot.soundDesign.silences}</p>
                <p><strong>Transición sonora:</strong> {selectedShot.soundDesign.transition}</p>
                <p><strong>Mezcla de narración:</strong> {selectedShot.soundDesign.narrationMix}</p>
              </section>

              <section className="border border-[#DCE2EA] p-4 space-y-2">
                <h3 className="text-sm font-semibold text-[#0A1628]">H. Edición y Postproducción</h3>
                <p><strong>Ritmo:</strong> {selectedShot.editing.rhythm}</p>
                <p><strong>Tipo de corte:</strong> {selectedShot.editing.cutType}</p>
                <p><strong>Transición visual:</strong> {selectedShot.editing.transition}</p>
                <p><strong>Subtítulos:</strong> {selectedShot.editing.subtitles}</p>
                <p><strong>Gráficos (solo postproducción):</strong> {selectedShot.editing.graphicsPostProd}</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
