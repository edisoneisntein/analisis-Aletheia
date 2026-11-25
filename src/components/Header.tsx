import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { DocumentId } from '../types/aletheia';

interface HeaderProps {
  activeView: 'overview' | DocumentId;
  onNavigate: (view: 'overview' | DocumentId) => void;
  onExportFullDossier: () => void;
}

const NAV_ITEMS: Array<{ label: string; target: 'overview' | DocumentId; matchIds: Array<'overview' | DocumentId> }> = [
  { label: 'Resumen', target: 'overview', matchIds: ['overview'] },
  { label: 'Inteligencia', target: 'doc-1', matchIds: ['doc-1', 'doc-2', 'doc-10'] },
  { label: 'Ingeniería', target: 'doc-3', matchIds: ['doc-3', 'doc-4'] },
  { label: 'Producción', target: 'doc-5', matchIds: ['doc-5', 'doc-6', 'doc-7', 'doc-8'] },
  { label: 'Prompts', target: 'doc-9', matchIds: ['doc-9'] },
];

export function Header({
  activeView,
  onNavigate,
  onExportFullDossier,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#DCE2EA]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="font-editorial text-2xl font-semibold tracking-[0.14em] text-[#0A1628] whitespace-nowrap shrink-0 cursor-pointer hover:text-[#1E355A] transition-colors"
        >
          ALETHEIA
        </button>

        {/* Zone 2: 5 clean single-line navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.matchIds.includes(activeView);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.target)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer border-b ${
                  isActive
                    ? 'text-[#0A1628] border-[#9E7E45]'
                    : 'text-[#5E6B7E] border-transparent hover:text-[#0A1628] hover:border-[#BFC8D6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action + mobile trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onExportFullDossier}
            className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Exportar Dossier
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-[#0A1628] hover:bg-[#EFF2F6] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Navegación móvil"
          className="md:hidden border-t border-[#DCE2EA] bg-white px-5 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.matchIds.includes(activeView);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onNavigate(item.target);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 px-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-[#0A1628] bg-[#EFF2F6]' : 'text-[#5E6B7E]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
