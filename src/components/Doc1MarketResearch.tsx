import { useState } from 'react';
import { Download } from 'lucide-react';
import { MARKET_RESEARCH_DOC } from '../data/researchData';
import type { StrategicAction, VideoRecord } from '../types/aletheia';
import { DurationInteractionChart } from './DurationInteractionChart';

interface Doc1MarketResearchProps {
  videos: VideoRecord[];
  onNavigateToDatabase: () => void;
  onExportMarkdown: () => void;
}

export function Doc1MarketResearch({
  videos,
  onNavigateToDatabase,
  onExportMarkdown,
}: Doc1MarketResearchProps) {
  const [fitFilter, setFitFilter] = useState<StrategicAction | 'Todos'>('Todos');

  const filteredFormats =
    fitFilter === 'Todos'
      ? MARKET_RESEARCH_DOC.formatsAnalysis
      : MARKET_RESEARCH_DOC.formatsAnalysis.filter((f) => f.aletheiaFit === fitFilter);

  return (
    <div className="space-y-10">
      {/* Document Header */}
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 01 · Fase 1: Inteligencia de Mercado Audiovisual Jurídico
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            {MARKET_RESEARCH_DOC.title}
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E] leading-relaxed">
            {MARKET_RESEARCH_DOC.subtitle}
          </p>
          <p className="mt-2 text-xs text-[#5E6B7E]">
            Ventana temporal: {MARKET_RESEARCH_DOC.consultationWindow}
          </p>
        </div>

        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exportar Doc 01 (.md)</span>
        </button>
      </div>

      {/* Methodological & Epistemic Declaration */}
      <div className="bg-white border border-[#DCE2EA] p-6">
        <h2 className="text-sm font-semibold text-[#0A1628]">
          Declaración de Rigor Analítico y Evidencia
        </h2>
        <p className="mt-2 text-sm text-[#334155] leading-relaxed max-w-4xl">
          {MARKET_RESEARCH_DOC.methodologicalDeclaration}
        </p>
        <div className="mt-4 pt-4 border-t border-[#EFF2F6] flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5E6B7E]">
          <span>Etiquetas epistémicas activas:</span>
          <span className="text-[#0A1628] font-medium">Dato comprobado</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#0A1628] font-medium">Observación visual</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#0A1628] font-medium">Estimación visual</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#0A1628] font-medium">Interpretación profesional</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#0A1628] font-medium">Hipótesis</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#7D6232] font-medium">Información no disponible</span>
        </div>
      </div>

      {/* Executive Summary */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
          01. Resumen Ejecutivo de Tendencias y Hallazgos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MARKET_RESEARCH_DOC.executiveSummary.map((item) => (
            <article key={item.heading} className="bg-white border border-[#DCE2EA] p-6">
              <p className="text-xs text-[#7D6232] font-medium">{item.epistemic}</p>
              <h3 className="mt-1.5 text-base font-semibold text-[#0A1628]">{item.heading}</h3>
              <p className="mt-2.5 text-sm text-[#334155] leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Duration vs. Interaction Rate Correlation Chart (Recharts) */}
      <DurationInteractionChart
        videos={videos}
        onNavigateToDatabase={onNavigateToDatabase}
      />

      {/* 12 Formats Analysis */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
              03. Análisis Comparativo de 12 Formatos Audiovisuales Jurídicos
            </h2>
            <p className="text-sm text-[#5E6B7E] mt-1">
              Evaluación de atención, autoridad, interacción, riesgo jurídico y recomendación para ALETHEIA.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filtrar formatos por recomendación para ALETHEIA"
            className="inline-flex items-center p-1 bg-[#EFF2F6] border border-[#DCE2EA]"
          >
            {(['Todos', 'Adoptar', 'Adaptar', 'Descartar'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFitFilter(option)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  fitFilter === option
                    ? 'bg-white text-[#0A1628] shadow-xs'
                    : 'text-[#5E6B7E] hover:text-[#0A1628]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#DCE2EA] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-[#DCE2EA] bg-[#F7F8FA] text-xs font-semibold text-[#5E6B7E]">
                <th className="py-3 px-4">Formato Audiovisual</th>
                <th className="py-3 px-3">Atención</th>
                <th className="py-3 px-3">Autoridad</th>
                <th className="py-3 px-3">Interacción</th>
                <th className="py-3 px-4">Mecánica y Riesgo Jurídico</th>
                <th className="py-3 px-4">Decisión ALETHEIA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF2F6] text-sm">
              {filteredFormats.map((fmt) => (
                <tr key={fmt.id} className="hover:bg-[#F7F8FA]/70 align-top">
                  <td className="py-3.5 px-4 font-medium text-[#0A1628] w-[22%]">
                    <p>{fmt.name}</p>
                    <p className="text-xs text-[#5E6B7E] font-normal mt-1">{fmt.epistemicLabel}</p>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#334155] whitespace-nowrap">
                    {fmt.attentionLevel}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#0A1628] font-medium whitespace-nowrap">
                    {fmt.authorityLevel}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#334155] whitespace-nowrap">
                    {fmt.interactionLevel}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#334155] leading-relaxed">
                    <p>{fmt.structuralMechanics}</p>
                    <p className="mt-1.5 text-[#7D6232]">
                      Control legal: {fmt.legalRiskWarning}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold whitespace-nowrap">
                    <span
                      className={
                        fmt.aletheiaFit === 'Adoptar'
                          ? 'text-[#0A1628]'
                          : fmt.aletheiaFit === 'Adaptar'
                            ? 'text-[#7D6232]'
                            : 'text-[#991B1B]'
                      }
                    >
                      {fmt.aletheiaFit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Conclusions */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
          04. Conclusiones sobre Atención, Autoridad e Interacción
        </h2>
        <div className="bg-white border border-[#DCE2EA] divide-y divide-[#EFF2F6]">
          {MARKET_RESEARCH_DOC.conclusions.map((c) => (
            <div key={c.pillar} className="p-6">
              <p className="text-xs text-[#7D6232] font-medium">{c.epistemic}</p>
              <h3 className="mt-1 text-base font-semibold text-[#0A1628]">{c.pillar}</h3>
              <p className="mt-2 text-sm text-[#334155] leading-relaxed max-w-4xl">{c.insight}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
