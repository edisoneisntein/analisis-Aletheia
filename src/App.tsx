/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Doc1MarketResearch } from './components/Doc1MarketResearch';
import { Doc2VideoDatabase } from './components/Doc2VideoDatabase';
import { Doc3Deconstruction } from './components/Doc3Deconstruction';
import { Doc4PatternMatrix } from './components/Doc4PatternMatrix';
import { Doc5CreativeConcepts } from './components/Doc5CreativeConcepts';
import { Doc6WinningConcept } from './components/Doc6WinningConcept';
import { Doc7ScriptWorkbench } from './components/Doc7ScriptWorkbench';
import { Doc8StoryboardPlan } from './components/Doc8StoryboardPlan';
import { Doc9MasterPrompts } from './components/Doc9MasterPrompts';
import { Doc10ReferenceLibrary } from './components/Doc10ReferenceLibrary';
import { DOCUMENT_INDEX, DocumentSidebar } from './components/DocumentSidebar';
import { Header } from './components/Header';
import { MarkdownExportModal } from './components/MarkdownExportModal';
import { OverviewHero } from './components/OverviewHero';
import { ALETHEIA_BRAND_IDENTITY } from './data/productionData';
import {
  INITIAL_DECONSTRUCTIONS,
  INITIAL_PHASE_CHECKPOINTS,
  INITIAL_VIDEO_DATABASE,
} from './data/researchData';
import type {
  DocumentId,
  PhaseCheckpoint,
  ShotDeconstructionRow,
  VideoDeconstruction,
  VideoRecord,
} from './types/aletheia';
import {
  exportDocumentToMarkdown,
  exportFullDossierMarkdown,
} from './utils/markdownExporter';

const STORAGE_KEYS = {
  videos: 'aletheia_videos_v1',
  deconstructions: 'aletheia_deconstructions_v1',
  checkpoints: 'aletheia_checkpoints_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<'overview' | DocumentId>('overview');

  const [videos, setVideos] = useState<VideoRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.videos, INITIAL_VIDEO_DATABASE)
  );
  const [deconstructions, setDeconstructions] = useState<VideoDeconstruction[]>(() =>
    loadFromStorage(STORAGE_KEYS.deconstructions, INITIAL_DECONSTRUCTIONS)
  );
  const [checkpoints, setCheckpoints] = useState<PhaseCheckpoint[]>(() =>
    loadFromStorage(STORAGE_KEYS.checkpoints, INITIAL_PHASE_CHECKPOINTS)
  );

  const [exportModalState, setExportModalState] = useState<{
    title: string;
    filename: string;
    markdown: string;
  } | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(videos));
    } catch {
      // Ignore quota errors
    }
  }, [videos]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.deconstructions,
        JSON.stringify(deconstructions)
      );
    } catch {
      // Ignore quota errors
    }
  }, [deconstructions]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.checkpoints, JSON.stringify(checkpoints));
    } catch {
      // Ignore quota errors
    }
  }, [checkpoints]);

  function handleNavigate(view: 'overview' | DocumentId) {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleToggleCheckpoint(id: string) {
    setCheckpoints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c))
    );
  }

  function handleAddVideo(record: VideoRecord) {
    setVideos((prev) => [record, ...prev]);
  }

  function handleUpdateVideoMetrics(
    videoId: string,
    updates: Pick<
      VideoRecord,
      | 'followers'
      | 'views'
      | 'likes'
      | 'comments'
      | 'shares'
      | 'saves'
      | 'durationSeconds'
      | 'publishedDate'
      | 'consultedDate'
      | 'metricsVerified'
      | 'classifications'
      | 'epistemicNote'
    >
  ) {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v))
    );
  }

  function handleUpdateAssetNotes(
    videoId: string,
    updates: Pick<
      VideoRecord,
      'transcript' | 'keyframeNotes' | 'shotSummary' | 'selectionReason'
    >
  ) {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v))
    );
  }

  function handleResetLibrary() {
    setVideos(INITIAL_VIDEO_DATABASE);
    setDeconstructions(INITIAL_DECONSTRUCTIONS);
    setCheckpoints(INITIAL_PHASE_CHECKPOINTS);
  }

  function handleAddShot(videoId: string, shot: ShotDeconstructionRow) {
    setDeconstructions((prev) =>
      prev.map((d) =>
        d.videoId === videoId ? { ...d, shots: [...d.shots, shot] } : d
      )
    );
  }

  function handleMarkDeconstructionVerified(videoId: string) {
    setDeconstructions((prev) =>
      prev.map((d) =>
        d.videoId === videoId
          ? {
              ...d,
              inspectionStatus: 'Verificado fotograma a fotograma',
              inspectionDisclosure: `Verificación directa confirmada por el analista el ${new Date()
                .toISOString()
                .slice(0, 10)}.`,
            }
          : d
      )
    );
  }

  function openSingleDocExport(docId: DocumentId) {
    const meta = DOCUMENT_INDEX.find((d) => d.id === docId);
    const md = exportDocumentToMarkdown(docId, { videos, deconstructions });
    setExportModalState({
      title: `Documento ${meta?.number ?? ''} — ${meta?.shortTitle ?? ''}`,
      filename: `aletheia-${docId}.md`,
      markdown: md,
    });
  }

  function openFullDossierExport() {
    const md = exportFullDossierMarkdown({ videos, deconstructions });
    setExportModalState({
      title: 'Dossier Completo ALETHEIA (Documentos 01 al 10)',
      filename: `aletheia-dossier-completo-${new Date().toISOString().slice(0, 10)}.md`,
      markdown: md,
    });
  }

  const verifiedVideosCount = videos.filter((v) => v.metricsVerified).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#0A1628]">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        onExportFullDossier={openFullDossierExport}
      />

      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row">
        <DocumentSidebar
          activeView={activeView}
          onSelect={handleNavigate}
          checkpoints={checkpoints}
          verifiedVideoCount={verifiedVideosCount}
          totalVideoCount={videos.length}
        />

        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 sm:py-10">
          {activeView === 'overview' && (
            <OverviewHero
              checkpoints={checkpoints}
              onToggleCheckpoint={handleToggleCheckpoint}
              onNavigateDoc={handleNavigate}
              totalVideos={videos.length}
              verifiedVideos={verifiedVideosCount}
            />
          )}

          {activeView === 'doc-1' && (
            <Doc1MarketResearch
              videos={videos}
              onNavigateToDatabase={() => handleNavigate('doc-2')}
              onExportMarkdown={() => openSingleDocExport('doc-1')}
            />
          )}

          {activeView === 'doc-2' && (
            <Doc2VideoDatabase
              videos={videos}
              onAddVideo={handleAddVideo}
              onUpdateVideoMetrics={handleUpdateVideoMetrics}
              onExportMarkdown={() => openSingleDocExport('doc-2')}
            />
          )}

          {activeView === 'doc-3' && (
            <Doc3Deconstruction
              deconstructions={deconstructions}
              onAddShot={handleAddShot}
              onMarkVerified={handleMarkDeconstructionVerified}
              onExportMarkdown={() => openSingleDocExport('doc-3')}
            />
          )}

          {activeView === 'doc-4' && (
            <Doc4PatternMatrix onExportMarkdown={() => openSingleDocExport('doc-4')} />
          )}

          {activeView === 'doc-5' && (
            <Doc5CreativeConcepts
              onOpenWinner={() => handleNavigate('doc-6')}
              onExportMarkdown={() => openSingleDocExport('doc-5')}
            />
          )}

          {activeView === 'doc-6' && (
            <Doc6WinningConcept
              onNavigateDoc={handleNavigate}
              onExportMarkdown={() => openSingleDocExport('doc-6')}
            />
          )}

          {activeView === 'doc-7' && (
            <Doc7ScriptWorkbench onExportMarkdown={() => openSingleDocExport('doc-7')} />
          )}

          {activeView === 'doc-8' && (
            <Doc8StoryboardPlan onExportMarkdown={() => openSingleDocExport('doc-8')} />
          )}

          {activeView === 'doc-9' && (
            <Doc9MasterPrompts onExportMarkdown={() => openSingleDocExport('doc-9')} />
          )}

          {activeView === 'doc-10' && (
            <Doc10ReferenceLibrary
              videos={videos}
              onUpdateAssetNotes={handleUpdateAssetNotes}
              onResetLibrary={handleResetLibrary}
              onExportMarkdown={() => openSingleDocExport('doc-10')}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-[#DCE2EA] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5E6B7E]">
          <p>
            {ALETHEIA_BRAND_IDENTITY.name} · {ALETHEIA_BRAND_IDENTITY.location} ·{' '}
            <span className="font-editorial italic text-[#0A1628]">
              {ALETHEIA_BRAND_IDENTITY.slogan}
            </span>
          </p>
          <p>
            Información jurídica general bajo el ordenamiento colombiano · No sustituye asesoría legal particular.
          </p>
        </div>
      </footer>

      {exportModalState && (
        <MarkdownExportModal
          title={exportModalState.title}
          filename={exportModalState.filename}
          markdown={exportModalState.markdown}
          onClose={() => setExportModalState(null)}
        />
      )}
    </div>
  );
}
