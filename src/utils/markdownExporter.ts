import {
  ALETHEIA_BRAND_IDENTITY,
  CONTINUITY_BIBLE,
  CREATIVE_CONCEPTS,
  PRODUCTION_PLAN_DOC,
  PRODUCTION_SHOTS,
  WINNING_CONCEPT_DOC,
} from '../data/productionData';
import {
  MARKET_RESEARCH_DOC,
  PATTERN_DIVERGENCES,
  PATTERN_MATRIX_DATA,
} from '../data/researchData';
import type {
  DocumentId,
  VideoDeconstruction,
  VideoRecord,
} from '../types/aletheia';
import {
  computeVideoMetrics,
  formatMetricNumber,
  formatPercent,
  formatRatio,
} from './analytics';

export interface ExportContext {
  videos: VideoRecord[];
  deconstructions: VideoDeconstruction[];
}

export function exportDocumentToMarkdown(
  docId: DocumentId,
  ctx: ExportContext
): string {
  switch (docId) {
    case 'doc-1':
      return buildDoc1Markdown();
    case 'doc-2':
      return buildDoc2Markdown(ctx.videos);
    case 'doc-3':
      return buildDoc3Markdown(ctx.deconstructions);
    case 'doc-4':
      return buildDoc4Markdown();
    case 'doc-5':
      return buildDoc5Markdown();
    case 'doc-6':
      return buildDoc6Markdown();
    case 'doc-7':
      return buildDoc7Markdown();
    case 'doc-8':
      return buildDoc8Markdown();
    case 'doc-9':
      return buildDoc9Markdown();
    case 'doc-10':
      return buildDoc10Markdown(ctx.videos);
  }
}

export function exportFullDossierMarkdown(ctx: ExportContext): string {
  const header = [
    `# DOSSIER ESTRATÉGICO DE INTELIGENCIA AUDIOVISUAL Y PRODUCCIÓN CINEMATOGRÁFICA`,
    `**Cliente:** ${ALETHEIA_BRAND_IDENTITY.name} (${ALETHEIA_BRAND_IDENTITY.location})`,
    `**Eslogan:** ${ALETHEIA_BRAND_IDENTITY.slogan}`,
    `**Aviso Legal y Epistémico:** ${ALETHEIA_BRAND_IDENTITY.mandatoryLegalDisclaimer}`,
    '',
    '---',
    '',
  ].join('\n');

  const docs: DocumentId[] = [
    'doc-1',
    'doc-2',
    'doc-3',
    'doc-4',
    'doc-5',
    'doc-6',
    'doc-7',
    'doc-8',
    'doc-9',
    'doc-10',
  ];

  return (
    header +
    docs
      .map((id) => exportDocumentToMarkdown(id, ctx))
      .join('\n\n---\n\n')
  );
}

function buildDoc1Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 1: ${MARKET_RESEARCH_DOC.title}`,
    `_${MARKET_RESEARCH_DOC.subtitle}_`,
    '',
    `> **Declaración metodológica y epistémica:** ${MARKET_RESEARCH_DOC.methodologicalDeclaration}`,
    '',
    `## Resumen Ejecutivo de Tendencias y Hallazgos`,
  ];

  for (const item of MARKET_RESEARCH_DOC.executiveSummary) {
    lines.push(`### ${item.heading} [${item.epistemic}]`);
    lines.push(item.body);
    lines.push('');
  }

  lines.push(`## Análisis de Formatos Audiovisuales Jurídicos`);
  lines.push(
    `| Formato | Atención | Autoridad | Interacción | Decisión ALETHEIA | Estatus Epistémico |`
  );
  lines.push(`| --- | --- | --- | --- | --- | --- |`);
  for (const fmt of MARKET_RESEARCH_DOC.formatsAnalysis) {
    lines.push(
      `| ${fmt.name} | ${fmt.attentionLevel} | ${fmt.authorityLevel} | ${fmt.interactionLevel} | ${fmt.aletheiaFit} | ${fmt.epistemicLabel} |`
    );
  }

  lines.push('', `## Conclusiones sobre Atención, Autoridad e Interacción`);
  for (const c of MARKET_RESEARCH_DOC.conclusions) {
    lines.push(`- **${c.pillar}** [${c.epistemic}]: ${c.insight}`);
  }

  return lines.join('\n');
}

function buildDoc2Markdown(videos: VideoRecord[]): string {
  const lines: string[] = [
    `# DOCUMENTO 2: Base de Datos de ${videos.length} Videos / Referentes Seleccionados`,
    '',
    `> **Advertencia métrica obligatoria:** Las visualizaciones no equivalen a personas únicas. No deben compararse directamente métricas entre plataformas distintas (TikTok, Instagram Reels, Facebook Reels, YouTube Shorts) por diferencias en criterios de conteo de reproducción. Ninguna cifra de alcance constituye prueba verificable de conversión comercial a clientes. Donde figura "N/D", la métrica se declara expresamente como **Información no disponible** hasta su verificación directa en plataforma.`,
    '',
    `| # | Abogado / Firma | País | Plataforma | Seguidores | Visualizaciones | Rel. Vis./Seg. | Tasa Likes | Tasa Com. | Tasa Comp. | Formato Narrativo | Clasificación |`,
    `| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |`,
  ];

  videos.forEach((v, idx) => {
    const m = computeVideoMetrics(v);
    lines.push(
      `| ${idx + 1} | ${v.creatorName} | ${v.country} | ${v.platform} | ${formatMetricNumber(
        v.followers
      )} | ${formatMetricNumber(v.views)} | ${formatRatio(
        m.viewToFollowerRatio
      )} | ${formatPercent(m.likeRatePct)} | ${formatPercent(
        m.commentRatePct
      )} | ${formatPercent(m.shareRatePct)} | ${v.narrativeFormat} | ${v.classifications.join(
        '; '
      )} |`
    );
  });

  return lines.join('\n');
}

function buildDoc3Markdown(deconstructions: VideoDeconstruction[]): string {
  const lines: string[] = [
    `# DOCUMENTO 3: Descomposición Cinematográfica de los ${deconstructions.length} Mejores Videos`,
    '',
  ];

  for (const d of deconstructions) {
    lines.push(`## #${d.rank}. ${d.creatorName} (${d.country} · ${d.platform})`);
    lines.push(`**Estado de inspección:** ${d.inspectionStatus}`);
    lines.push(`> ${d.inspectionDisclosure}`);
    lines.push('');
    lines.push(`| Tiempo | Plano | Cámara | Acción | Audio | Texto | Función |`);
    lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
    for (const s of d.shots) {
      lines.push(
        `| ${s.timecodeIn}–${s.timecodeOut} (${s.durationSec}s) | ${s.shotType} (${s.framingSize}) | ${s.cameraAngle}; ${s.cameraMovement} | ${s.subjectAction} | ${s.audioMusic} | ${s.onScreenText} | ${s.narrativeFunction} [${s.epistemicStatus}] |`
      );
    }
    lines.push('');
    lines.push(`### Análisis Cinematográfico`);
    lines.push(`- **Inicio y gancho visual:** ${d.cinematographicAnalysis.openingAndVisualHook}`);
    lines.push(`- **Desarrollo del conflicto:** ${d.cinematographicAnalysis.conflictDevelopment}`);
    lines.push(`- **Cambios visuales y ritmo:** ${d.cinematographicAnalysis.visualChangesAndPacing}`);
    lines.push(`- **Transmisión de credibilidad:** ${d.cinematographicAnalysis.credibilitySignals}`);
    lines.push(`- **Clímax y cierre:** ${d.cinematographicAnalysis.climaxAndEnding}`);
    lines.push('');
    lines.push(`### Análisis Psicológico y Narrativo`);
    lines.push(`- **Mecanismo de atención:** ${d.psychologicalAnalysis.attentionMechanism}`);
    lines.push(`- **Dolor y tensión:** ${d.psychologicalAnalysis.painPointAndTension}`);
    lines.push(`- **Revelación y solución:** ${d.psychologicalAnalysis.revelationAndResolution}`);
    lines.push(`- **Construcción de autoridad:** ${d.psychologicalAnalysis.authorityConstruction}`);
    lines.push(`- **Llamada a la acción:** ${d.psychologicalAnalysis.callToActionAnalysis}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildDoc4Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 4: Matriz Comparativa de Patrones de Viralidad y Autoridad`,
    '',
    `| Categoría | Patrón | Base Epistémica | Decisión ALETHEIA | Adaptación Estratégica |`,
    `| --- | --- | --- | --- | --- |`,
  ];

  for (const p of PATTERN_MATRIX_DATA) {
    lines.push(
      `| ${p.category} | ${p.patternName} | ${p.evidenceBasis} | **${p.strategicDecision}** | ${p.aletheiaAdaptation} |`
    );
  }

  lines.push('', `## Diferencias Clave Entre Videos Exitosos (Principio de No Fórmula Única)`);
  for (const div of PATTERN_DIVERGENCES) {
    lines.push(`- **${div.title}:** ${div.detail}`);
  }

  return lines.join('\n');
}

function buildDoc5Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 5: Tres Conceptos Creativos Originales para ALETHEIA Consultores S.A.S.`,
    '',
  ];

  for (const c of CREATIVE_CONCEPTS) {
    lines.push(`## ${c.code}: ${c.campaignName}`);
    lines.push(`- **Idea central:** ${c.centralIdea}`);
    lines.push(`- **Público objetivo:** ${c.targetAudience}`);
    lines.push(`- **Problema abordado:** ${c.problemAddressed}`);
    lines.push(`- **Emoción buscada:** ${c.targetEmotion}`);
    lines.push(`- **Promesa comunicativa realista:** ${c.realisticPromise}`);
    lines.push(`- **Gancho inicial:** ${c.initialHook}`);
    lines.push(`- **Desarrollo narrativo:** ${c.narrativeDevelopment}`);
    lines.push(`- **Clímax:** ${c.climax}`);
    lines.push(`- **Cierre:** ${c.closing}`);
    lines.push(`- **Llamada a la acción:** ${c.callToAction}`);
    lines.push(`- **Anclaje jurídico colombiano:** ${c.colombianLegalAnchor}`);
    lines.push(`- **Justificación estratégica:** ${c.strategicJustification}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildDoc6Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 6: Concepto Ganador y Justificación Estratégica`,
    `**Campaña seleccionada:** ${WINNING_CONCEPT_DOC.campaignTitle}`,
    `**Formato:** ${WINNING_CONCEPT_DOC.formatSpec}`,
    '',
    `## Pilares de Selección Estratégica`,
  ];

  for (const pillar of WINNING_CONCEPT_DOC.strategicPillars) {
    lines.push(`### ${pillar.title}`);
    lines.push(pillar.detail);
    lines.push('');
  }

  lines.push(`## Auditoría de Integridad Jurídica y Reputacional`);
  lines.push(`| Regla Obligatoria | Estatus | Verificación |`);
  lines.push(`| --- | --- | --- |`);
  for (const check of WINNING_CONCEPT_DOC.legalAuditChecks) {
    lines.push(`| ${check.rule} | ${check.status} | ${check.verification} |`);
  }

  return lines.join('\n');
}

function buildDoc7Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 7: Guion Literario y Técnico Completo — "${WINNING_CONCEPT_DOC.campaignTitle}"`,
    '',
    `## A. Guion Literario Completo`,
  ];

  for (const shot of PRODUCTION_SHOTS) {
    lines.push(
      `- **[${shot.timecodeIn}–${shot.timecodeOut}] (${shot.scene}):** "${shot.literaryVoiceover}" _(Texto en postproducción: ${shot.postProdText})_`
    );
  }

  lines.push('', `## B. Guion Técnico Descompuesto por Planos`);
  for (const shot of PRODUCTION_SHOTS) {
    lines.push(`### Plano ${shot.shotNumber} · ${shot.shotTitle} (${shot.timecodeIn}–${shot.timecodeOut}, ${shot.durationSec}s)`);
    lines.push(`- **Fotografía:** Lente ${shot.photography.lens} · Distancia ${shot.photography.distance} · Altura ${shot.photography.height} · Ángulo ${shot.photography.angle} · Movimiento: ${shot.photography.cameraMovement} · Iluminación: ${shot.photography.lighting} · Color: ${shot.photography.colorTreatment}`);
    lines.push(`- **Actuación:** Postura ${shot.acting.posture} · Expresión ${shot.acting.expression} · Mirada ${shot.acting.gaze} · Ritmo: ${shot.acting.speechPace}`);
    lines.push(`- **Sonido:** Música: ${shot.soundDesign.music} · SFX: ${shot.soundDesign.sfx} · Silencios: ${shot.soundDesign.silences}`);
    lines.push(`- **Edición:** ${shot.editing.rhythm} · Corte: ${shot.editing.cutType} · Postproducción: ${shot.editing.graphicsPostProd}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildDoc8Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 8: Storyboard Visual y Plan de Producción`,
    '',
    `## A. Storyboard Individual por Plano`,
  ];

  for (const shot of PRODUCTION_SHOTS) {
    lines.push(`- **Plano ${shot.shotNumber} (${shot.timecodeIn}–${shot.timecodeOut}) — ${shot.shotTitle}:** ${shot.visualDescription}`);
  }

  lines.push('', `## B. Plan de Producción`);
  lines.push(`- **Duración:** ${PRODUCTION_PLAN_DOC.durationTotal}`);
  lines.push(`- **Formatos:** ${PRODUCTION_PLAN_DOC.formats.join(' | ')}`);
  lines.push(`- **Locaciones:** ${PRODUCTION_PLAN_DOC.locations.join(' | ')}`);
  lines.push(`- **Vestuario:** ${PRODUCTION_PLAN_DOC.wardrobe.join(' | ')}`);
  lines.push(`- **Iluminación:** ${PRODUCTION_PLAN_DOC.lightingEquipment.join(' | ')}`);
  lines.push(`- **Utilería:** ${PRODUCTION_PLAN_DOC.props.join(' | ')}`);
  lines.push(`- **Sonido:** ${PRODUCTION_PLAN_DOC.soundEquipment.join(' | ')}`);
  lines.push(`- **Elementos exclusivos de postproducción (NO IA):** ${PRODUCTION_PLAN_DOC.postProductionBoundary.join(' | ')}`);

  return lines.join('\n');
}

function buildDoc9Markdown(): string {
  const lines: string[] = [
    `# DOCUMENTO 9: MASTER PROMPTS Individuales por Escena y Plano`,
    '',
    `## ${CONTINUITY_BIBLE.title}`,
  ];

  for (const c of CONTINUITY_BIBLE.constants) {
    lines.push(`- **${c.element}:** ${c.spec}`);
  }

  lines.push('', `## Colección de Master Prompts por Plano`);
  for (const shot of PRODUCTION_SHOTS) {
    const mp = shot.masterPrompt;
    lines.push(`### ${mp.sceneShotId} — ${shot.shotTitle} (${mp.duration})`);
    lines.push('```text');
    lines.push(mp.readyPromptBlock);
    lines.push('```');
    lines.push(`- **Continuidad:** ${mp.continuityWithPrevious}`);
    lines.push(`- **Condiciones de salida:** ${mp.exitConditions}`);
    lines.push(`- **Restricciones negativas:** ${mp.negativeConstraints}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildDoc10Markdown(videos: VideoRecord[]): string {
  const lines: string[] = [
    `# DOCUMENTO 10: Biblioteca de Referencias Audiovisuales (Asset Persistente)`,
    '',
  ];

  videos.forEach((v, idx) => {
    const m = computeVideoMetrics(v);
    lines.push(`## ${idx + 1}. ${v.creatorName} (${v.country} · ${v.platform})`);
    lines.push(`- **URL de referencia:** ${v.url}`);
    lines.push(`- **Fecha de consulta:** ${v.consultedDate} · **Fecha publicación:** ${v.publishedDate}`);
    lines.push(`- **Métricas observadas:** Seguidores ${formatMetricNumber(v.followers)} · Visualizaciones ${formatMetricNumber(v.views)} · Likes ${formatMetricNumber(v.likes)} · Comentarios ${formatMetricNumber(v.comments)} · Compartidos ${formatMetricNumber(v.shares)} · Relación V/S ${formatRatio(m.viewToFollowerRatio)}`);
    lines.push(`- **Nota epistémica:** ${v.epistemicNote}`);
    lines.push(`- **Razón de selección:** ${v.selectionReason}`);
    lines.push(`- **Notas de fotogramas clave:** ${v.keyframeNotes}`);
    lines.push(`- **Descripción de planos:** ${v.shotSummary}`);
    lines.push(`- **Transcripción registrada:** ${v.transcript}`);
    lines.push('');
  });

  return lines.join('\n');
}
