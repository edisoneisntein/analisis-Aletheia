export type EpistemicLabel =
  | 'Dato comprobado'
  | 'Observación visual'
  | 'Estimación visual'
  | 'Interpretación profesional'
  | 'Hipótesis'
  | 'Información no disponible';

export type PlatformType =
  | 'TikTok'
  | 'Instagram Reels'
  | 'Facebook Reels'
  | 'YouTube Shorts';

export type RegionScope = 'Colombia' | 'Latinoamérica' | 'Internacional';

export type PublicationClassification =
  | 'Viralidad extraordinaria'
  | 'Alto rendimiento relativo'
  | 'Alta interacción'
  | 'Alta capacidad educativa'
  | 'Alta capacidad de construcción de autoridad'
  | 'Alta capacidad comercial aparente';

export type PatternCategory =
  | 'Patrones narrativos'
  | 'Patrones cinematográficos'
  | 'Patrones de actuación'
  | 'Patrones de edición y sonido'
  | 'Patrones de comunicación comercial';

export type StrategicAction = 'Adoptar' | 'Adaptar' | 'Descartar';

export type DocumentId =
  | 'doc-1'
  | 'doc-2'
  | 'doc-3'
  | 'doc-4'
  | 'doc-5'
  | 'doc-6'
  | 'doc-7'
  | 'doc-8'
  | 'doc-9'
  | 'doc-10';

export type PhaseId = 'fase-1' | 'fase-2' | 'fase-3' | 'fase-4' | 'fase-5';

export interface VideoRecord {
  id: string;
  creatorName: string;
  country: string;
  region: RegionScope;
  platform: PlatformType;
  url: string;
  publishedDate: string; // YYYY-MM-DD or 'Información no disponible'
  consultedDate: string; // YYYY-MM-DD
  followers: number | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  durationSeconds: number | null;
  legalTopic: string;
  narrativeFormat: string;
  observableQuality: string;
  classifications: PublicationClassification[];
  metricsVerified: boolean;
  epistemicNote: string;
  selectionReason: string;
  transcript: string;
  keyframeNotes: string;
  shotSummary: string;
  isTopTen: boolean;
}

export interface ComputedVideoMetrics {
  viewToFollowerRatio: number | null; // A: views / followers
  likeRatePct: number | null; // B: (likes / views) * 100
  commentRatePct: number | null; // C: (comments / views) * 100
  shareRatePct: number | null; // D: (shares / views) * 100
}

export interface ShotDeconstructionRow {
  id: string;
  timecodeIn: string;
  timecodeOut: string;
  durationSec: number;
  shotType: string;
  framingSize: string;
  cameraAngle: string;
  cameraMovement: string;
  subjectAction: string;
  gazeDirection: string;
  facialExpression: string;
  lighting: string;
  colorimetry: string;
  setDesign: string;
  onScreenText: string;
  transition: string;
  audioMusic: string;
  narrativeFunction: string;
  epistemicStatus: EpistemicLabel;
}

export interface VideoDeconstruction {
  videoId: string;
  rank: number;
  title: string;
  creatorName: string;
  country: string;
  platform: PlatformType;
  url: string;
  inspectionStatus:
    | 'Verificado fotograma a fotograma'
    | 'Plantilla estructural (pendiente inspección directa en plataforma)';
  inspectionDisclosure: string;
  shots: ShotDeconstructionRow[];
  cinematographicAnalysis: {
    openingAndVisualHook: string;
    conflictDevelopment: string;
    visualChangesAndPacing: string;
    credibilitySignals: string;
    climaxAndEnding: string;
  };
  psychologicalAnalysis: {
    attentionMechanism: string;
    painPointAndTension: string;
    revelationAndResolution: string;
    authorityConstruction: string;
    callToActionAnalysis: string;
  };
}

export interface FormatAnalysisItem {
  id: string;
  name: string;
  attentionLevel: 'Muy Alta' | 'Alta' | 'Media-Alta' | 'Media';
  authorityLevel: 'Muy Alta' | 'Alta' | 'Media' | 'Baja-Media';
  interactionLevel: 'Muy Alta' | 'Alta' | 'Media-Alta' | 'Media';
  structuralMechanics: string;
  legalRiskWarning: string;
  aletheiaFit: StrategicAction;
  epistemicLabel: EpistemicLabel;
}

export interface PatternMatrixItem {
  id: string;
  category: PatternCategory;
  patternName: string;
  observedFrequency: string;
  evidenceBasis: EpistemicLabel;
  mechanism: string;
  strategicDecision: StrategicAction;
  aletheiaAdaptation: string;
}

export interface CreativeConcept {
  id: string;
  code: string;
  campaignName: string;
  isWinner: boolean;
  centralIdea: string;
  targetAudience: string;
  problemAddressed: string;
  targetEmotion: string;
  realisticPromise: string;
  initialHook: string;
  narrativeDevelopment: string;
  climax: string;
  closing: string;
  callToAction: string;
  strategicJustification: string;
  colombianLegalAnchor: string;
}

export interface ProductionShot {
  shotNumber: number;
  scene: string;
  timecodeIn: string;
  timecodeOut: string;
  durationSec: number;
  shotTitle: string;
  literaryVoiceover: string;
  postProdText: string;
  visualDescription: string;
  storyboardImage?: string;
  photography: {
    lens: string;
    distance: string;
    height: string;
    angle: string;
    cameraMovement: string;
    composition: string;
    lighting: string;
    depthOfField: string;
    colorTreatment: string;
  };
  acting: {
    posture: string;
    gestures: string;
    movement: string;
    expression: string;
    gaze: string;
    delivery: string;
    speechPace: string;
  };
  soundDesign: {
    music: string;
    ambience: string;
    sfx: string;
    silences: string;
    transition: string;
    narrationMix: string;
  };
  editing: {
    rhythm: string;
    cutType: string;
    transition: string;
    subtitles: string;
    graphicsPostProd: string;
  };
  masterPrompt: {
    sceneShotId: string;
    duration: string;
    characterPhysical: string;
    wardrobe: string;
    setting: string;
    mainAction: string;
    microExpressions: string;
    shotType: string;
    cameraPositionMovement: string;
    lighting: string;
    composition: string;
    depthOfField: string;
    colorGrading: string;
    ambientMotion: string;
    audioDialogueRef: string;
    continuityWithPrevious: string;
    exitConditions: string;
    negativeConstraints: string;
    readyPromptBlock: string;
  };
}

export interface PhaseCheckpoint {
  id: string;
  phaseId: PhaseId;
  label: string;
  category: 'Rigor Epistémico' | 'Integridad Jurídica' | 'Calidad Cinematográfica' | 'Coherencia de Marca';
  verified: boolean;
}
