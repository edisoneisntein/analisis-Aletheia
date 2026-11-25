import { ArrowRight, Download } from 'lucide-react';
import {
  ALETHEIA_BRAND_IDENTITY,
  ALETHEIA_MEDIA_ASSETS,
  CREATIVE_CONCEPTS,
  WINNING_CONCEPT_DOC,
} from '../data/productionData';
import type { DocumentId } from '../types/aletheia';
import { SafeCinemaImage } from './SafeCinemaImage';

interface Doc6WinningConceptProps {
  onNavigateDoc: (docId: DocumentId) => void;
  onExportMarkdown: () => void;
}

export function Doc6WinningConcept({
  onNavigateDoc,
  onExportMarkdown,
}: Doc6WinningConceptProps) {
  const winner = CREATIVE_CONCEPTS.find((c) => c.isWinner) ?? CREATIVE_CONCEPTS[1];

  return (
    <div className="space-y-10">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 06 · Fase 4: Selección Estratégica y Control Reputacional
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Concepto Ganador: “{WINNING_CONCEPT_DOC.campaignTitle}”
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">{WINNING_CONCEPT_DOC.formatSpec}</p>
        </div>

        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exportar Doc 06 (.md)</span>
        </button>
      </div>

      {/* Editorial Feature Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#DCE2EA]">
        <div className="lg:col-span-6 p-7 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-xs text-[#7D6232] font-medium">
              Alineación con {ALETHEIA_BRAND_IDENTITY.name} · Armenia, Quindío
            </p>
            <h2 className="font-editorial text-3xl font-semibold text-[#0A1628]">
              De la tensión silenciosa a la libertad de decidir con verdad jurídica
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed">{winner.centralIdea}</p>
            <p className="text-xs text-[#5E6B7E] leading-relaxed pt-3 border-t border-[#EFF2F6]">
              <strong className="text-[#0A1628]">Marco normativo verificado:</strong>{' '}
              {winner.colombianLegalAnchor}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigateDoc('doc-7')}
              className="px-4 py-2.5 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Abrir Guion Completo (Doc 07)</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateDoc('doc-9')}
              className="px-4 py-2.5 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] hover:bg-[#EFF2F6] whitespace-nowrap cursor-pointer"
            >
              Ir a Master Prompts IA (Doc 09)
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <SafeCinemaImage
            src={ALETHEIA_MEDIA_ASSETS.shot01Firma}
            alt="Fotograma maestro del gancho visual: estilográfica azul marino y dorado champagne detenida a dos milímetros del papel algodón"
            aspectClass="h-full min-h-[260px]"
            className="h-full"
          />
        </div>
      </div>

      {/* 5 Strategic Pillars */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
          Justificación Estratégica y Coherencia de Marca
        </h2>
        <div className="bg-white border border-[#DCE2EA] divide-y divide-[#EFF2F6]">
          {WINNING_CONCEPT_DOC.strategicPillars.map((pillar) => (
            <div key={pillar.title} className="p-6">
              <h3 className="text-sm font-semibold text-[#0A1628]">{pillar.title}</h3>
              <p className="mt-2 text-sm text-[#334155] leading-relaxed max-w-4xl">
                {pillar.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal & Reputational Audit Table */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
          Auditoría de Integridad Jurídica y Reputacional
        </h2>
        <div className="bg-white border border-[#DCE2EA] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#DCE2EA] text-xs font-semibold text-[#5E6B7E]">
                <th className="py-3 px-4">Principio Obligatorio</th>
                <th className="py-3 px-4">Dictamen</th>
                <th className="py-3 px-4">Verificación Documental</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2F6] text-xs">
              {WINNING_CONCEPT_DOC.legalAuditChecks.map((check) => (
                <tr key={check.rule} className="align-top">
                  <td className="py-3.5 px-4 font-semibold text-[#0A1628] w-[28%]">
                    {check.rule}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#166534] whitespace-nowrap w-[18%]">
                    {check.status}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155] leading-relaxed">
                    {check.verification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
