import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { CONTINUITY_BIBLE, PRODUCTION_SHOTS } from '../data/productionData';

interface Doc9MasterPromptsProps {
  onExportMarkdown: () => void;
}

export function Doc9MasterPrompts({ onExportMarkdown }: Doc9MasterPromptsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedShot, setExpandedShot] = useState<number>(1);

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback ignored if clipboard blocked in headless test environment
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  }

  function handleCopyAllPrompts() {
    const pack = [
      `=== ${CONTINUITY_BIBLE.title.toUpperCase()} ===`,
      ...CONTINUITY_BIBLE.constants.map((c) => `- ${c.element}: ${c.spec}`),
      '',
      ...PRODUCTION_SHOTS.map(
        (s) => `--- ${s.masterPrompt.sceneShotId} (${s.shotTitle}) ---\n${s.masterPrompt.readyPromptBlock}`
      ),
    ].join('\n\n');
    copyText('all-prompts', pack);
  }

  return (
    <div className="space-y-10">
      <div className="border-b border-[#DCE2EA] pb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs text-[#7D6232] tracking-wider font-medium">
            Documento 09 · Fase 5: Ingeniería de Prompts Generativos y Continuidad
          </p>
          <h1 className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-[#0A1628]">
            MASTER PROMPTS Individuales por Escena y Plano
          </h1>
          <p className="mt-2 text-sm text-[#5E6B7E]">
            Especificación completa de 18 campos por plano, Biblia de Continuidad bloqueada entre
            escenas y separación absoluta de textos/logotipos para postproducción.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyAllPrompts}
            className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            {copiedId === 'all-prompts' ? (
              <Check className="w-3.5 h-3.5 text-[#DFC79A]" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>
              {copiedId === 'all-prompts'
                ? 'Paquete copiado'
                : 'Copiar paquete completo (12 planos)'}
            </span>
          </button>

          <button
            type="button"
            onClick={onExportMarkdown}
            className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] bg-white hover:bg-[#EFF2F6] transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exportar Doc 09 (.md)</span>
          </button>
        </div>
      </div>

      {/* Continuity Bible */}
      <section className="bg-[#0A1628] text-white p-6 sm:p-8 space-y-5">
        <div>
          <p className="text-xs text-[#DFC79A] tracking-wider font-medium">
            Bloqueo de Continuidad Entre Escenas
          </p>
          <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold">
            {CONTINUITY_BIBLE.title}
          </h2>
          <p className="mt-2 text-xs text-[#DCE2EA] max-w-3xl leading-relaxed">
            {CONTINUITY_BIBLE.purpose}
          </p>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {CONTINUITY_BIBLE.constants.map((c) => (
            <div key={c.element} className="border border-[#1E355A] p-4 bg-[#060E1B]/50">
              <dt className="text-xs font-semibold text-[#DFC79A]">{c.element}</dt>
              <dd className="mt-1.5 text-xs text-[#EFF2F6] leading-relaxed">{c.spec}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Shot Prompt Selector & Individual Prompts */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {PRODUCTION_SHOTS.map((shot) => {
            const isSelected = shot.shotNumber === expandedShot;
            return (
              <button
                key={shot.shotNumber}
                type="button"
                onClick={() => setExpandedShot(shot.shotNumber)}
                className={`px-3 py-1.5 text-xs font-mono tabular-nums border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A1628] text-white border-[#0A1628]'
                    : 'bg-white text-[#0A1628] border-[#DCE2EA] hover:bg-[#EFF2F6]'
                }`}
              >
                P{String(shot.shotNumber).padStart(2, '0')}
              </button>
            );
          })}
        </div>

        {PRODUCTION_SHOTS.filter((s) => s.shotNumber === expandedShot).map((shot) => {
          const mp = shot.masterPrompt;
          const isCopied = copiedId === `shot-${shot.shotNumber}`;
          return (
            <article
              key={shot.shotNumber}
              className="bg-white border border-[#DCE2EA] p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE2EA] pb-4">
                <div>
                  <p className="font-mono text-xs text-[#7D6232] tabular-nums">
                    {mp.sceneShotId} · {mp.duration}
                  </p>
                  <h2 className="mt-1 font-editorial text-2xl sm:text-3xl font-semibold text-[#0A1628]">
                    {shot.shotTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => copyText(`shot-${shot.shotNumber}`, mp.readyPromptBlock)}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-[#DFC79A]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{isCopied ? 'Master Prompt copiado' : 'Copiar Master Prompt'}</span>
                </button>
              </div>

              {/* Ready-to-paste Master Prompt Block */}
              <div>
                <p className="text-xs font-semibold text-[#0A1628] mb-2">
                  Bloque Master Prompt listo para generador audiovisual IA
                </p>
                <pre className="bg-[#060E1B] text-[#EFF2F6] p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto border border-[#1E355A]">
                  {mp.readyPromptBlock}
                </pre>
              </div>

              {/* All 18 Mandatory Structured Parameters */}
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs pt-2 border-t border-[#EFF2F6]">
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">1. Identificación escena/plano</dt>
                  <dd className="text-[#0A1628] mt-0.5">{mp.sceneShotId}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">2. Duración</dt>
                  <dd className="text-[#0A1628] mt-0.5">{mp.duration}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">3. Personaje (rasgos físicos)</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.characterPhysical}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">4. Vestuario</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.wardrobe}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">5. Escenario</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.setting}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">6. Acción principal (acción única)</dt>
                  <dd className="text-[#0A1628] mt-0.5 leading-relaxed">{mp.mainAction}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">7. Expresión / Microexpresiones</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.microExpressions}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">8. Tipo de plano</dt>
                  <dd className="text-[#334155] mt-0.5">{mp.shotType}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">9. Posición y movimiento de cámara</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.cameraPositionMovement}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">10. Iluminación</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.lighting}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">11. Composición</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.composition}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">12. Profundidad de campo</dt>
                  <dd className="text-[#334155] mt-0.5">{mp.depthOfField}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">13. Tratamiento cromático</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.colorGrading}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">14. Movimiento ambiental</dt>
                  <dd className="text-[#334155] mt-0.5">{mp.ambientMotion}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">15. Referencia de audio / diálogo</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.audioDialogueRef}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">16. Continuidad con planos anteriores</dt>
                  <dd className="text-[#0A1628] mt-0.5 leading-relaxed">{mp.continuityWithPrevious}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#5E6B7E]">17. Condiciones de salida</dt>
                  <dd className="text-[#334155] mt-0.5 leading-relaxed">{mp.exitConditions}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#991B1B]">18. Restricciones negativas</dt>
                  <dd className="text-[#991B1B] mt-0.5 leading-relaxed">{mp.negativeConstraints}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>
    </div>
  );
}
