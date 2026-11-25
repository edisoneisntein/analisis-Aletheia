import { Download } from 'lucide-react';
import {
  PRODUCTION_PLAN_DOC,
  PRODUCTION_SHOTS,
  WINNING_CONCEPT_DOC,
} from '../data/productionData';
import { SafeCinemaImage } from './SafeCinemaImage';

interface Doc8StoryboardPlanProps {
  onExportMarkdown: () => void;
}

export function Doc8StoryboardPlan({ onExportMarkdown }: Doc8StoryboardPlanProps) {
  return (
    <div className="space-y-10">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 08 · Fase 4: Storyboard Visual y Plan de Producción
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Storyboard y Plan de Producción — “{WINNING_CONCEPT_DOC.campaignTitle}”
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Descripción visual individual de los 12 planos con fotogramas cinematográficos de
            referencia y especificaciones completas de rodaje y postproducción.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exportar Doc 08 (.md)</span>
        </button>
      </div>

      {/* A. Visual Storyboard Grid */}
      <section className="space-y-5">
        <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
          A. Storyboard Visual por Plano (12 Planos · 00:00–00:55)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTION_SHOTS.map((shot) => (
            <article
              key={shot.shotNumber}
              className="bg-white border border-[#DCE2EA] flex flex-col"
            >
              {shot.storyboardImage ? (
                <SafeCinemaImage
                  src={shot.storyboardImage}
                  alt={`Fotograma de referencia Plano ${shot.shotNumber}: ${shot.shotTitle}`}
                  aspectClass="aspect-video"
                />
              ) : (
                <div className="aspect-video bg-[#0A1628] p-6 flex flex-col justify-between border-b border-[#1E355A]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#DFC79A] tabular-nums">
                    <span>PLANO {String(shot.shotNumber).padStart(2, '0')}</span>
                    <span>
                      {shot.timecodeIn}–{shot.timecodeOut} ({shot.durationSec}s)
                    </span>
                  </div>
                  <div className="my-auto py-3">
                    <p className="font-editorial text-xl text-white">{shot.shotTitle}</p>
                    <p className="text-xs text-[#BFC8D6] mt-1.5">
                      {shot.photography.lens} · {shot.photography.angle}
                    </p>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] border-t border-[#1E355A] pt-2">
                    {shot.shotNumber === 12
                      ? 'Composición vectorial 100% postproducción (sin generación IA)'
                      : `Encuadre de continuidad · ${shot.photography.cameraMovement}`}
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="font-mono text-[11px] text-[#7D6232] tabular-nums">
                    PLANO {String(shot.shotNumber).padStart(2, '0')} · {shot.timecodeIn}–
                    {shot.timecodeOut} ({shot.durationSec}s) · {shot.photography.lens}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[#0A1628]">
                    {shot.shotTitle}
                  </h3>
                  <p className="mt-2 text-xs text-[#334155] leading-relaxed">
                    {shot.visualDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFF2F6] text-xs space-y-1">
                  <p className="text-[#0A1628]">
                    <strong>Voz / Audio:</strong> “{shot.literaryVoiceover}”
                  </p>
                  <p className="text-[#5E6B7E]">
                    <strong>Postproducción:</strong> {shot.postProdText}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* B. Production Plan */}
      <section className="bg-white border border-[#DCE2EA] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#DCE2EA] pb-4">
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#0A1628]">
            B. Plan Integral de Producción
          </h2>
          <p className="text-xs text-[#5E6B7E] mt-1">
            Duración: {PRODUCTION_PLAN_DOC.durationTotal}
          </p>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-xs">
          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Formatos de entrega</dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.formats.map((f) => (
                <p key={f}>· {f}</p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Personajes y Talento</dt>
            <dd className="space-y-2 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.cast.map((c) => (
                <p key={c.role}>
                  <strong className="text-[#0A1628]">{c.role}:</strong> {c.profile}
                </p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Escenarios (Armenia, Quindío)</dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.locations.map((loc) => (
                <p key={loc}>· {loc}</p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Vestuario</dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.wardrobe.map((w) => (
                <p key={w}>· {w}</p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Esquema de Iluminación</dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.lightingEquipment.map((l) => (
                <p key={l}>· {l}</p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Utilería de Anclaje</dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.props.map((p) => (
                <p key={p}>· {p}</p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#0A1628] mb-2">Captura y Diseño Sonoro</dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.soundEquipment.map((s) => (
                <p key={s}>· {s}</p>
              ))}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-[#7D6232] mb-2">
              Elementos Reservados a Postproducción (NO IA)
            </dt>
            <dd className="space-y-1.5 text-[#334155] leading-relaxed">
              {PRODUCTION_PLAN_DOC.postProductionBoundary.map((b) => (
                <p key={b}>· {b}</p>
              ))}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
