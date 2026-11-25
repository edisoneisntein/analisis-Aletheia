import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DocumentId, PhaseCheckpoint, PhaseId } from '../types/aletheia';
import { evaluatePhaseGateReadiness } from '../utils/analytics';

export interface DocumentMeta {
  id: DocumentId;
  number: string;
  shortTitle: string;
  phaseId: PhaseId;
  phaseLabel: string;
}

export const DOCUMENT_INDEX: DocumentMeta[] = [
  { id: 'doc-1', number: '01', shortTitle: 'Investigación de Mercado', phaseId: 'fase-1', phaseLabel: 'Fase 1 · Inteligencia' },
  { id: 'doc-2', number: '02', shortTitle: 'Base de Datos (30 Videos)', phaseId: 'fase-1', phaseLabel: 'Fase 1 · Inteligencia' },
  { id: 'doc-3', number: '03', shortTitle: 'Descomposición Top 10', phaseId: 'fase-2', phaseLabel: 'Fase 2 · Ingeniería Inversa' },
  { id: 'doc-4', number: '04', shortTitle: 'Matriz de Patrones', phaseId: 'fase-3', phaseLabel: 'Fase 3 · Patrones y Marca' },
  { id: 'doc-5', number: '05', shortTitle: 'Tres Conceptos Creativos', phaseId: 'fase-4', phaseLabel: 'Fase 4 · Producción' },
  { id: 'doc-6', number: '06', shortTitle: 'Concepto Ganador', phaseId: 'fase-4', phaseLabel: 'Fase 4 · Producción' },
  { id: 'doc-7', number: '07', shortTitle: 'Guion Literario y Técnico', phaseId: 'fase-4', phaseLabel: 'Fase 4 · Producción' },
  { id: 'doc-8', number: '08', shortTitle: 'Storyboard y Producción', phaseId: 'fase-4', phaseLabel: 'Fase 4 · Producción' },
  { id: 'doc-9', number: '09', shortTitle: 'Master Prompts IA', phaseId: 'fase-5', phaseLabel: 'Fase 5 · Prompts y Control' },
  { id: 'doc-10', number: '10', shortTitle: 'Biblioteca Persistente', phaseId: 'fase-5', phaseLabel: 'Fase 5 · Prompts y Control' },
];

const PHASES: Array<{ id: PhaseId; title: string }> = [
  { id: 'fase-1', title: 'Fase 1 · Inteligencia' },
  { id: 'fase-2', title: 'Fase 2 · Ingeniería Inversa' },
  { id: 'fase-3', title: 'Fase 3 · Patrones y Marca' },
  { id: 'fase-4', title: 'Fase 4 · Desarrollo y Producción' },
  { id: 'fase-5', title: 'Fase 5 · Master Prompts y Archivo' },
];

interface DocumentSidebarProps {
  activeView: 'overview' | DocumentId;
  onSelect: (view: 'overview' | DocumentId) => void;
  checkpoints: PhaseCheckpoint[];
  verifiedVideoCount: number;
  totalVideoCount: number;
}

export function DocumentSidebar({
  activeView,
  onSelect,
  checkpoints,
  verifiedVideoCount,
  totalVideoCount,
}: DocumentSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overall = evaluatePhaseGateReadiness(checkpoints);
  const activeMeta = DOCUMENT_INDEX.find((d) => d.id === activeView);
  const activeLabel = activeMeta
    ? `${activeMeta.number}. ${activeMeta.shortTitle}`
    : 'Resumen Ejecutivo y Fases';

  function handleSelect(view: 'overview' | DocumentId) {
    onSelect(view);
    setMobileOpen(false);
  }

  return (
    <aside
      aria-label="Índice del Dossier de 10 Documentos"
      className="w-full lg:w-[264px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#DCE2EA] bg-white"
    >
      {/* Mobile compact disclosure bar */}
      <div className="lg:hidden px-5 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-[#7D6232] font-medium">Índice del Dossier (10 Docs)</p>
          <p className="text-xs font-semibold text-[#0A1628] truncate">{activeLabel}</p>
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="px-3 py-1.5 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-[#F7F8FA] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{mobileOpen ? 'Ocultar índice' : 'Cambiar documento'}</span>
          {mobileOpen ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Desktop always visible; mobile visible when toggled */}
      <div className={`${mobileOpen ? 'block border-t border-[#DCE2EA]' : 'hidden'} lg:block`}>
        <div className="p-5 border-b border-[#DCE2EA]">
          <button
            type="button"
            onClick={() => handleSelect('overview')}
            className={`w-full text-left py-2 px-3 text-sm font-medium transition-colors cursor-pointer ${
              activeView === 'overview'
                ? 'bg-[#0A1628] text-white'
                : 'text-[#0A1628] hover:bg-[#EFF2F6]'
            }`}
          >
            Resumen Ejecutivo y Fases
          </button>

          <div className="mt-4 pt-3 border-t border-[#EFF2F6] text-xs text-[#5E6B7E] flex items-center justify-between tabular-nums">
            <span>Controles de fase</span>
            <span className="font-mono text-[#0A1628]">
              {overall.verified}/{overall.total} ({overall.percentage}%)
            </span>
          </div>
          <div className="mt-1.5 text-xs text-[#5E6B7E] flex items-center justify-between tabular-nums">
            <span>Videos con métricas</span>
            <span className="font-mono text-[#0A1628]">
              {verifiedVideoCount}/{totalVideoCount}
            </span>
          </div>
        </div>

        <nav aria-label="Documentos entregables" className="p-4 space-y-5">
          {PHASES.map((phase) => {
            const docs = DOCUMENT_INDEX.filter((d) => d.phaseId === phase.id);
            const readiness = evaluatePhaseGateReadiness(checkpoints, phase.id);
            return (
              <div key={phase.id}>
                <div className="px-2 pb-1.5 flex items-center justify-between text-[11px] font-medium tracking-wider text-[#5E6B7E]">
                  <span>{phase.title}</span>
                  <span className="font-mono tabular-nums text-[#7D6232]">
                    {readiness.verified}/{readiness.total}
                  </span>
                </div>
                <ul className="space-y-0.5">
                  {docs.map((doc) => {
                    const isActive = activeView === doc.id;
                    return (
                      <li key={doc.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(doc.id)}
                          className={`w-full text-left px-2.5 py-2 text-[13px] transition-colors flex items-baseline gap-2.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#EFF2F6] text-[#0A1628] font-semibold'
                              : 'text-[#334155] hover:bg-[#F7F8FA] hover:text-[#0A1628]'
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] tabular-nums shrink-0 ${
                              isActive ? 'text-[#9E7E45]' : 'text-[#8B96A8]'
                            }`}
                          >
                            {doc.number}.
                          </span>
                          <span className="truncate">{doc.shortTitle}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
