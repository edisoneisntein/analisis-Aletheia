import { useState } from 'react';
import { Download } from 'lucide-react';
import { ALETHEIA_BRAND_IDENTITY } from '../data/productionData';
import { PATTERN_DIVERGENCES, PATTERN_MATRIX_DATA } from '../data/researchData';
import type { PatternCategory, StrategicAction } from '../types/aletheia';

interface Doc4PatternMatrixProps {
  onExportMarkdown: () => void;
}

const CATEGORIES: Array<PatternCategory | 'Todas'> = [
  'Todas',
  'Patrones narrativos',
  'Patrones cinematográficos',
  'Patrones de actuación',
  'Patrones de edición y sonido',
  'Patrones de comunicación comercial',
];

export function Doc4PatternMatrix({ onExportMarkdown }: Doc4PatternMatrixProps) {
  const [category, setCategory] = useState<PatternCategory | 'Todas'>('Todas');
  const [decision, setDecision] = useState<StrategicAction | 'Todas'>('Todas');

  const filtered = PATTERN_MATRIX_DATA.filter((item) => {
    if (category !== 'Todas' && item.category !== category) return false;
    if (decision !== 'Todas' && item.strategicDecision !== decision) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 04 · Fase 3: Matriz de Patrones y Adaptación a ALETHEIA
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            Matriz Comparativa de Patrones de Viralidad y Autoridad
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Criterios técnicos para adoptar, adaptar o descartar prácticas del ecosistema jurídico
            sin asumir fórmulas únicas ni diluir la sobriedad institucional de ALETHEIA.
          </p>
        </div>

        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exportar Doc 04 (.md)</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#DCE2EA] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="pattern-cat-select" className="text-xs font-medium text-[#5E6B7E]">
            Categoría:
          </label>
          <select
            id="pattern-cat-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as PatternCategory | 'Todas')}
            className="px-3 py-1.5 text-xs border border-[#DCE2EA] bg-[#F7F8FA] text-[#0A1628]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div
          role="group"
          aria-label="Filtrar por decisión estratégica para ALETHEIA"
          className="inline-flex items-center p-1 bg-[#EFF2F6] border border-[#DCE2EA]"
        >
          {(['Todas', 'Adoptar', 'Adaptar', 'Descartar'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setDecision(opt)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                decision === opt
                  ? 'bg-white text-[#0A1628] shadow-xs'
                  : 'text-[#5E6B7E] hover:text-[#0A1628]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-[#DCE2EA] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F7F8FA] border-b border-[#DCE2EA] text-xs font-semibold text-[#5E6B7E]">
              <th className="py-3 px-4">Categoría y Patrón</th>
              <th className="py-3 px-4">Mecanismo y Frecuencia</th>
              <th className="py-3 px-4">Decisión ALETHEIA</th>
              <th className="py-3 px-4">Adaptación Institucional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF2F6] text-xs">
            {filtered.map((item) => (
              <tr key={item.id} className="align-top hover:bg-[#F7F8FA]/70">
                <td className="py-4 px-4 w-[26%]">
                  <p className="text-[11px] text-[#7D6232]">{item.category}</p>
                  <p className="mt-1 text-sm font-semibold text-[#0A1628]">{item.patternName}</p>
                  <p className="mt-1 text-[11px] text-[#5E6B7E]">Base: {item.evidenceBasis}</p>
                </td>
                <td className="py-4 px-4 w-[30%] text-[#334155] leading-relaxed">
                  <p>{item.mechanism}</p>
                  <p className="mt-1.5 text-[11px] text-[#5E6B7E]">{item.observedFrequency}</p>
                </td>
                <td className="py-4 px-4 w-[12%] font-semibold whitespace-nowrap">
                  <span
                    className={
                      item.strategicDecision === 'Adoptar'
                        ? 'text-[#0A1628]'
                        : item.strategicDecision === 'Adaptar'
                          ? 'text-[#7D6232]'
                          : 'text-[#991B1B]'
                    }
                  >
                    {item.strategicDecision}
                  </span>
                </td>
                <td className="py-4 px-4 text-[#0A1628] leading-relaxed">
                  {item.aletheiaAdaptation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Divergences (Anti-single-formula principle) */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-[#0A1628]">
          Diferencias Significativas Entre Videos Exitosos (Principio de No Fórmula Única)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PATTERN_DIVERGENCES.map((div) => (
            <article key={div.title} className="bg-white border border-[#DCE2EA] p-6">
              <h3 className="text-sm font-semibold text-[#0A1628]">{div.title}</h3>
              <p className="mt-2 text-xs text-[#334155] leading-relaxed">{div.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ALETHEIA Brand Identity Anchor */}
      <section className="bg-[#0A1628] text-white p-6 sm:p-8 space-y-5">
        <div>
          <p className="text-xs text-[#DFC79A] tracking-wider">
            Identidad Corporativa de Filtrado · {ALETHEIA_BRAND_IDENTITY.location}
          </p>
          <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold">
            {ALETHEIA_BRAND_IDENTITY.name} — “{ALETHEIA_BRAND_IDENTITY.slogan}”
          </h2>
          <p className="mt-2 text-sm text-[#DCE2EA] max-w-3xl">
            {ALETHEIA_BRAND_IDENTITY.positioning} Personalidad:{' '}
            {ALETHEIA_BRAND_IDENTITY.personality.join(' · ')}.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {ALETHEIA_BRAND_IDENTITY.palette.map((swatch) => (
            <div key={swatch.hex} className="border border-[#1E355A] p-4 bg-[#060E1B]/50">
              <div
                className="h-8 w-full border border-white/15 mb-3"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden="true"
              />
              <p className="text-xs font-semibold text-white">{swatch.name}</p>
              <p className="font-mono text-[11px] text-[#DFC79A] mt-0.5">{swatch.hex}</p>
              <p className="text-[11px] text-[#BFC8D6] mt-1 leading-snug">{swatch.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
