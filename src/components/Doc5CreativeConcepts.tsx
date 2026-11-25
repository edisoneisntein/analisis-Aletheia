import { ArrowRight, Download } from 'lucide-react';
import { CREATIVE_CONCEPTS } from '../data/productionData';

interface Doc5CreativeConceptsProps {
  onOpenWinner: () => void;
  onExportMarkdown: () => void;
}

export function Doc5CreativeConcepts({
  onOpenWinner,
  onExportMarkdown,
}: Doc5CreativeConceptsProps) {
  return (
    <div className="space-y-10">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 05 · Fase 4: Desarrollo Creativo Original
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Tres Conceptos Creativos Originales para ALETHEIA
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Tres propuestas audiovisuales distintas, creadas desde cero con fundamento en el
            ordenamiento colombiano y los hallazgos de ingeniería inversa, sin replicar piezas de terceros.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exportar Doc 05 (.md)</span>
        </button>
      </div>

      <div className="space-y-8">
        {CREATIVE_CONCEPTS.map((concept) => (
          <article
            key={concept.id}
            className={`bg-white border p-6 sm:p-8 space-y-6 ${
              concept.isWinner ? 'border-[#0A1628]' : 'border-[#DCE2EA]'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#DCE2EA] pb-4">
              <div>
                <p className="text-xs font-medium tracking-wider text-[#7D6232]">
                  {concept.code}
                </p>
                <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#0A1628]">
                  {concept.campaignName}
                </h2>
              </div>
              {concept.isWinner && (
                <button
                  type="button"
                  onClick={onOpenWinner}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Ver Justificación y Producción (Doc 06)</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-sm">
              <div className="md:col-span-2">
                <dt className="text-xs font-semibold text-[#5E6B7E]">Idea central</dt>
                <dd className="mt-1 text-[#0A1628] leading-relaxed">{concept.centralIdea}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Público objetivo</dt>
                <dd className="mt-1 text-[#334155] leading-relaxed">{concept.targetAudience}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Problema abordado</dt>
                <dd className="mt-1 text-[#334155] leading-relaxed">{concept.problemAddressed}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Emoción buscada</dt>
                <dd className="mt-1 text-[#334155] leading-relaxed">{concept.targetEmotion}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Promesa comunicativa realista</dt>
                <dd className="mt-1 text-[#334155] leading-relaxed">{concept.realisticPromise}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Gancho inicial (00:00–00:03)</dt>
                <dd className="mt-1 text-[#0A1628] leading-relaxed">{concept.initialHook}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Desarrollo narrativo</dt>
                <dd className="mt-1 text-[#334155] leading-relaxed">{concept.narrativeDevelopment}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Clímax</dt>
                <dd className="mt-1 text-[#0A1628] leading-relaxed">{concept.climax}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#5E6B7E]">Cierre y Llamada a la acción</dt>
                <dd className="mt-1 text-[#334155] leading-relaxed">
                  {concept.closing} — <strong className="text-[#0A1628]">{concept.callToAction}</strong>
                </dd>
              </div>
              <div className="md:col-span-2 pt-3 border-t border-[#EFF2F6]">
                <dt className="text-xs font-semibold text-[#7D6232]">Anclaje normativo colombiano verificado</dt>
                <dd className="mt-1 text-xs text-[#334155] leading-relaxed">
                  {concept.colombianLegalAnchor}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs font-semibold text-[#5E6B7E]">Justificación estratégica</dt>
                <dd className="mt-1 text-xs text-[#334155] leading-relaxed">
                  {concept.strategicJustification}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
