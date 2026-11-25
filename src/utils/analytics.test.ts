import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateByDurationBracket,
  buildDurationInteractionDataset,
  computePearsonCorrelation,
  computeVideoMetrics,
  deriveQuantitativeClassifications,
  evaluatePhaseGateReadiness,
  filterVideoDatabase,
  summarizeCorrelationInsights,
  validateNewVideoInput,
} from './analytics';
import { exportFullDossierMarkdown } from './markdownExporter';
import {
  INITIAL_DECONSTRUCTIONS,
  INITIAL_PHASE_CHECKPOINTS,
  INITIAL_VIDEO_DATABASE,
} from '../data/researchData';
import type { VideoRecord } from '../types/aletheia';

test('computeVideoMetrics computes exact Fase 1 formulas A, B, C, D', () => {
  const result = computeVideoMetrics({
    followers: 50000,
    views: 250000,
    likes: 12500,
    comments: 625,
    shares: 1500,
  });

  assert.equal(result.viewToFollowerRatio, 5.0);
  assert.equal(result.likeRatePct, 5.0);
  assert.equal(result.commentRatePct, 0.25);
  assert.equal(result.shareRatePct, 0.6);
});

test('computeVideoMetrics returns null cleanly when metrics are unavailable or zero in denominator', () => {
  const unavailable = computeVideoMetrics({
    followers: null,
    views: null,
    likes: null,
    comments: null,
    shares: null,
  });
  assert.deepEqual(unavailable, {
    viewToFollowerRatio: null,
    likeRatePct: null,
    commentRatePct: null,
    shareRatePct: null,
  });

  const zeroDenominator = computeVideoMetrics({
    followers: 0,
    views: 0,
    likes: 10,
    comments: 2,
    shares: 1,
  });
  assert.equal(zeroDenominator.viewToFollowerRatio, null);
  assert.equal(zeroDenominator.likeRatePct, null);
  assert.equal(zeroDenominator.commentRatePct, null);
  assert.equal(zeroDenominator.shareRatePct, null);
});

test('deriveQuantitativeClassifications assigns Viralidad extraordinaria and Alta interacción accurately', () => {
  const metrics = computeVideoMetrics({
    followers: 20000,
    views: 150000,
    likes: 9000,
    comments: 750,
    shares: 1200,
  });
  const tags = deriveQuantitativeClassifications(metrics, ['Alta capacidad educativa']);
  assert.ok(tags.includes('Viralidad extraordinaria'));
  assert.ok(tags.includes('Alta interacción'));
  assert.ok(tags.includes('Alta capacidad educativa'));
  assert.ok(!tags.includes('Alta capacidad comercial aparente'));
});

test('validateNewVideoInput rejects missing required fields and non-numeric metrics', () => {
  const invalid = validateNewVideoInput({
    creatorName: '',
    country: '',
    region: 'Colombia',
    platform: 'TikTok',
    url: 'invalid-url',
    publishedDate: '',
    followers: 'abc',
    views: '1000',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    durationSeconds: '45',
    legalTopic: '',
    narrativeFormat: '',
    observableQuality: '',
    selectionReason: '',
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.creatorName);
  assert.ok(invalid.errors.country);
  assert.ok(invalid.errors.url);
  assert.ok(invalid.errors.followers);
  assert.ok(invalid.errors.legalTopic);
  assert.ok(invalid.errors.narrativeFormat);
});

test('filterVideoDatabase filters 30 curated records by region and platform', () => {
  assert.equal(INITIAL_VIDEO_DATABASE.length, 30);

  const colombiaOnly = filterVideoDatabase(INITIAL_VIDEO_DATABASE, {
    query: '',
    region: 'Colombia',
    platform: 'Todas',
    classification: 'Todas',
    verifiedOnly: false,
  });
  assert.equal(colombiaOnly.length, 14);

  const ytShortsColombia = filterVideoDatabase(INITIAL_VIDEO_DATABASE, {
    query: '',
    region: 'Colombia',
    platform: 'YouTube Shorts',
    classification: 'Todas',
    verifiedOnly: false,
  });
  assert.ok(ytShortsColombia.length >= 4);
});

test('evaluatePhaseGateReadiness calculates phase completion accurately', () => {
  const partial = INITIAL_PHASE_CHECKPOINTS.map((c, i) =>
    i === 0 ? { ...c, verified: false } : c
  );
  const f1 = evaluatePhaseGateReadiness(partial, 'fase-1');
  assert.equal(f1.total, 2);
  assert.equal(f1.verified, 1);
  assert.equal(f1.percentage, 50);
  assert.equal(f1.isComplete, false);
});

test('exportFullDossierMarkdown outputs all 10 required ALETHEIA documents with legal disclaimer', () => {
  const md = exportFullDossierMarkdown({
    videos: INITIAL_VIDEO_DATABASE,
    deconstructions: INITIAL_DECONSTRUCTIONS,
  });

  for (let i = 1; i <= 10; i++) {
    assert.ok(
      md.includes(`# DOCUMENTO ${i}:`),
      `Missing DOCUMENTO ${i} in exported Markdown dossier`
    );
  }
  assert.ok(md.includes('ALETHEIA Consultores S.A.S.'));
  assert.ok(md.includes('LA VERDAD NOS HACE LIBRES.'));
  assert.ok(md.includes('Información no disponible'));
});

test('buildDurationInteractionDataset excludes unverified N/D rows and filters by platform & metric', () => {
  assert.equal(
    buildDurationInteractionDataset(INITIAL_VIDEO_DATABASE, 'totalInteractionPct').length,
    0
  );

  const sample: VideoRecord[] = [
    {
      ...INITIAL_VIDEO_DATABASE[0],
      id: 't1',
      platform: 'TikTok',
      durationSeconds: 30,
      followers: 20000,
      views: 100000,
      likes: 6000,
      comments: 500,
      shares: 1000,
      metricsVerified: true,
    },
    {
      ...INITIAL_VIDEO_DATABASE[1],
      id: 't2',
      platform: 'Instagram Reels',
      durationSeconds: 55,
      followers: 15000,
      views: 50000,
      likes: 2000,
      comments: 250,
      shares: 250,
      metricsVerified: true,
    },
    {
      ...INITIAL_VIDEO_DATABASE[2],
      id: 't3',
      platform: 'TikTok',
      durationSeconds: null,
      followers: 10000,
      views: 40000,
      likes: 1200,
      comments: null,
      shares: null,
      metricsVerified: true,
    },
  ];

  const allTotal = buildDurationInteractionDataset(sample, 'totalInteractionPct');
  assert.equal(allTotal.length, 2);
  assert.equal(allTotal[0].interactionRatePct, 7.5);
  assert.equal(allTotal[1].interactionRatePct, 5.0);

  const tiktokComments = buildDurationInteractionDataset(sample, 'commentRatePct', 'TikTok');
  assert.equal(tiktokComments.length, 1);
  assert.equal(tiktokComments[0].interactionRatePct, 0.5);
});

test('computePearsonCorrelation and aggregateByDurationBracket compute exact statistics', () => {
  const tooSmall = computePearsonCorrelation([
    { durationSeconds: 30, interactionRatePct: 6 },
    { durationSeconds: 60, interactionRatePct: 4 },
  ]);
  assert.equal(tooSmall.r, null);

  const negLinear = computePearsonCorrelation([
    { durationSeconds: 20, interactionRatePct: 8 },
    { durationSeconds: 40, interactionRatePct: 6 },
    { durationSeconds: 60, interactionRatePct: 4 },
    { durationSeconds: 80, interactionRatePct: 2 },
  ]);
  assert.equal(negLinear.r, -1);
  assert.equal(negLinear.strengthLabel, 'Correlación negativa fuerte');

  const points = [
    {
      id: 'a',
      creatorName: 'A',
      country: 'Colombia',
      platform: 'TikTok' as const,
      narrativeFormat: 'Mitos',
      durationSeconds: 25,
      interactionRatePct: 5.2,
      totalInteractionPct: 5.2,
      likeRatePct: 4.5,
      commentRatePct: 0.3,
      shareRatePct: 0.4,
      viewToFollowerRatio: 3.1,
      views: 80000,
      classifications: [],
    },
    {
      id: 'b',
      creatorName: 'B',
      country: 'Colombia',
      platform: 'Instagram Reels' as const,
      narrativeFormat: 'Prevención',
      durationSeconds: 52,
      interactionRatePct: 7.4,
      totalInteractionPct: 7.4,
      likeRatePct: 6.0,
      commentRatePct: 0.6,
      shareRatePct: 0.8,
      viewToFollowerRatio: 4.2,
      views: 110000,
      classifications: [],
    },
    {
      id: 'c',
      creatorName: 'C',
      country: 'Colombia',
      platform: 'YouTube Shorts' as const,
      narrativeFormat: 'Caso hipotético',
      durationSeconds: 95,
      interactionRatePct: 3.1,
      totalInteractionPct: 3.1,
      likeRatePct: 2.7,
      commentRatePct: 0.2,
      shareRatePct: 0.2,
      viewToFollowerRatio: 1.4,
      views: 45000,
      classifications: [],
    },
  ];

  const brackets = aggregateByDurationBracket(points);
  assert.equal(brackets[0].bracket, '≤ 30 s');
  assert.equal(brackets[0].count, 1);
  assert.equal(brackets[1].bracket, '31–60 s');
  assert.equal(brackets[1].avgInteractionPct, 7.4);
  assert.equal(brackets[2].count, 0);
  assert.equal(brackets[3].bracket, '> 90 s');

  const summary = summarizeCorrelationInsights(points);
  assert.equal(summary.sampleSize, 3);
  assert.equal(summary.bestBracket?.bracket, '31–60 s');
  assert.equal(summary.distinctPlatforms, 3);
});

