import { ArrowRight, CheckSquare, Square } from 'lucide-react';
import {
  ALETHEIA_BRAND_IDENTITY,
  ALETHEIA_MEDIA_ASSETS,
  WINNING_CONCEPT_DOC,
} from '../data/productionData';
import { MULTIDISCIPLINARY_TEAM } from '../data/researchData';
import type { DocumentId, PhaseCheckpoint } from '../types/aletheia';
import { evaluatePhaseGateReadiness } from '../utils/analytics';
import { DOCUMENT_INDEX } from './DocumentSidebar';
import { SafeCinemaImage } from './SafeCinemaImage';

interface OverviewHeroProps {
  checkpoints: PhaseCheckpoint[];
  onToggleCheckpoint: (id: string) => void;
  onNavigateDoc: (docId: DocumentId) => void;
  totalVideos: number;
  verifiedVideos: number;
}

export function OverviewHero({
  checkpoints,
  onToggleCheckpoint,
  onNavigateDoc,
  totalVideos,
  verifiedVideos,
}: OverviewHeroProps) {
  const readiness = evaluatePhaseGateReadiness(checkpoints);

  return (
    <div className="space-y-12">
      {/* Institutional Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 items-stretch bg-white border border-[#DCE2EA]">
        <div className="lg:col-span-6 p-7 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs tracking-[0.12em] text-[#7D6232] font-medium">
              {ALETHEIA_BRAND_IDENTITY.name} · {ALETHEIA_BRAND_IDENTITY.location}
            </p>
            <h1 className="mt-3 font-editorial text-3xl xl:text-[40px] font-semibold text-[#0A1628] leading-[1.1]">
              Inteligencia Audiovisual y Producción Cinematográfica Jurídica
            </h1>
            <p className="mt-4 text-sm text-[#334155] leading-relaxed max-w-xl">
              Dossier operativo de 5 fases secuenciales y 10 documentos entregables diseñado para
              construir una identidad audiovisual sobria, cinematográfica y jurídicamente
              inobjetable para ALETHEIA Consultores S.A.S., priorizando autoridad y claridad sobre
              la viralidad vacía.
            </p>
            <p className="mt-4 font-editorial italic text-lg text-[#0A1628] border-t border-b border-[#DCE2EA] py-2.5">
              “{ALETHEIA_BRAND_IDENTITY.slogan}”
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateDoc('doc-6')}
              className="px-4 py-2.5 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Ver Producción Ganadora</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateDoc('doc-2')}
              className="px-4 py-2.5 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] hover:bg-[#EFF2F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Abrir Base de 30 Referentes
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative min-h-[280px] lg:border-l border-[#DCE2EA]">
          <SafeCinemaImage
            src={ALETHEIA_MEDIA_ASSETS.heroArchitecture}
            alt="Sala de juntas contemporánea de ALETHEIA Consultores S.A.S. en Armenia, Quindío al amanecer"
            aspectClass="h-full min-h-[280px]"
            className="h-full"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060E1B]/90 via-[#060E1B]/45 to-transparent p-6">
            <p className="text-xs text-[#DFC79A] tracking-wider font-medium">
              Estética Cinematográfica Oficial · Campaña Insignia
            </p>
            <p className="font-editorial text-2xl text-white mt-1">
              {WINNING_CONCEPT_DOC.campaignTitle}
            </p>
            <p className="text-xs text-[#DCE2EA] mt-1">
              Azul Marino Profundo · Plata · Blanco · Dorado Champagne
            </p>
          </div>
        </div>
      </section>

      {/* Full-width Operational Metrics Strip */}
      <section
        aria-label="Resumen cuantitativo del dossier"
        className="grid grid-cols-2 lg:grid-cols-4 border border-[#DCE2EA] bg-white divide-y lg:divide-y-0 lg:divide-x divide-[#DCE2EA]"
      >
        <div className="p-6">
          <p className="text-xs text-[#5E6B7E]">Arquitectura Entregable</p>
          <p className="mt-2 font-mono text-2xl font-medium text-[#0A1628] tabular-nums">
            10 Documentos
          </p>
          <p className="mt-1 text-xs text-[#5E6B7E]">5 fases secuenciales en Markdown</p>
        </div>
        <div className="p-6">
          <p className="text-xs text-[#5E6B7E]">Referentes Catalogados</p>
          <p className="mt-2 font-mono text-2xl font-medium text-[#0A1628] tabular-nums">
            {totalVideos} registros
          </p>
          <p className="mt-1 text-xs text-[#5E6B7E]">
            {verifiedVideos} con métricas directas verificadas
          </p>
        </div>
        <div className="p-6">
          <p className="text-xs text-[#5E6B7E]">Producción Master</p>
          <p className="mt-2 font-mono text-2xl font-medium text-[#0A1628] tabular-nums">
            12 Planos · 55s
          </p>
          <p className="mt-1 text-xs text-[#5E6B7E]">Guion, Storyboard y Master Prompts IA</p>
        </div>
        <div className="p-6">
          <p className="text-xs text-[#5E6B7E]">Puntos de Control Verificados</p>
          <p className="mt-2 font-mono text-2xl font-medium text-[#0A1628] tabular-nums">
            {readiness.verified}/{readiness.total} ({readiness.percentage}%)
          </p>
          <p className="mt-1 text-xs text-[#5E6B7E]">Rigor epistémico e integridad jurídica</p>
        </div>
      </section>

      {/* 10 Documents Editorial Index */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#DCE2EA] pb-3">
          <div>
            <h2 className="font-editorial text-3xl font-semibold text-[#0A1628]">
              Índice de los 10 Documentos Entregables
            </h2>
            <p className="text-sm text-[#5E6B7E] mt-1">
              Seleccione cualquier documento para auditar, editar métricas verificadas o exportar a Markdown.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#DCE2EA] border border-[#DCE2EA]">
          {DOCUMENT_INDEX.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onNavigateDoc(doc.id)}
              className="bg-white p-5 text-left hover:bg-[#F7F8FA] transition-colors flex items-start justify-between gap-4 group cursor-pointer"
            >
              <div>
                <p className="text-xs text-[#5E6B7E]">
                  Documento {doc.number} · {doc.phaseLabel}
                </p>
                <p className="mt-1 text-base font-semibold text-[#0A1628] group-hover:text-[#7D6232] transition-colors">
                  {doc.shortTitle}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 text-[#8B96A8] group-hover:text-[#0A1628] shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Phase Gate Control Matrix */}
      <section className="bg-white border border-[#DCE2EA] p-6 sm:p-8 space-y-5">
        <div className="border-b border-[#DCE2EA] pb-4 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#0A1628]">
              Control Secuencial de Calidad, Evidencia e Integridad Jurídica
            </h2>
            <p className="text-sm text-[#5E6B7E] mt-1">
              No se avanza a producción final sin verificar cada punto de control epistémico y normativo colombiano.
            </p>
          </div>
          <span className="font-mono text-sm text-[#0A1628] tabular-nums">
            Estado global: {readiness.verified} de {readiness.total} verificados
          </span>
        </div>

        <div className="divide-y divide-[#EFF2F6]">
          {checkpoints.map((chk) => (
            <button
              key={chk.id}
              type="button"
              onClick={() => onToggleCheckpoint(chk.id)}
              className="w-full py-3.5 text-left flex items-start gap-3.5 hover:bg-[#F7F8FA] px-2 -mx-2 transition-colors cursor-pointer"
            >
              {chk.verified ? (
                <CheckSquare className="w-4 h-4 text-[#0A1628] shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <Square className="w-4 h-4 text-[#8B96A8] shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0A1628] font-medium">{chk.label}</p>
                <p className="text-xs text-[#5E6B7E] mt-0.5">
                  {chk.phaseId.replace('-', ' ').replace('f', 'F')} · {chk.category} ·{' '}
                  {chk.verified ? 'Verificado' : 'Pendiente de revisión'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 10 Elite Roles */}
      <section className="space-y-4">
        <div className="border-b border-[#DCE2EA] pb-3">
          <h2 className="font-editorial text-3xl font-semibold text-[#0A1628]">
            Equipo Multidisciplinario de Inteligencia y Producción
          </h2>
          <p className="text-sm text-[#5E6B7E] mt-1">
            Diez especialidades integradas bajo una sola dirección estratégica y jurídica para ALETHEIA Consultores S.A.S.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 bg-white border border-[#DCE2EA] p-6 sm:p-8">
          {MULTIDISCIPLINARY_TEAM.map((member) => (
            <div key={member.index} className="pb-4 border-b border-[#EFF2F6] last:border-b-0">
              <p className="text-sm font-semibold text-[#0A1628]">
                <span className="font-mono text-xs text-[#9E7E45] mr-2">{member.index}.</span>
                {member.role}
              </p>
              <p className="mt-1 text-xs text-[#5E6B7E] leading-relaxed">{member.mandate}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mandatory Legal Notice Footer */}
      <section className="border border-[#DCE2EA] bg-[#EFF2F6]/60 p-5 text-xs text-[#334155] leading-relaxed">
        <strong className="text-[#0A1628]">Declaración de Integridad Jurídica:</strong>{' '}
        {ALETHEIA_BRAND_IDENTITY.mandatoryLegalDisclaimer}
      </section>
    </div>
  );
}
