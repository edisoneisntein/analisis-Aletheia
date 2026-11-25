import { useState } from 'react';
import { Check, Copy, Download, X } from 'lucide-react';

interface MarkdownExportModalProps {
  title: string;
  filename: string;
  markdown: string;
  onClose: () => void;
}

export function MarkdownExportModal({
  title,
  filename,
  markdown,
  onClose,
}: MarkdownExportModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      // Fallback ignored if clipboard API restricted
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="md-export-title"
      className="fixed inset-0 z-50 bg-[#060E1B]/65 flex items-center justify-center p-4"
    >
      <div className="bg-white border border-[#DCE2EA] w-full max-w-4xl max-h-[88vh] flex flex-col">
        <div className="p-5 border-b border-[#DCE2EA] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#7D6232] font-medium">Entregable Oficial en Formato Markdown</p>
            <h2 id="md-export-title" className="font-editorial text-2xl font-semibold text-[#0A1628]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar vista previa de exportación Markdown"
            onClick={onClose}
            className="p-1.5 text-[#5E6B7E] hover:text-[#0A1628] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-[#F7F8FA]">
          <pre className="text-xs font-mono text-[#0A1628] whitespace-pre-wrap leading-relaxed bg-white border border-[#DCE2EA] p-5">
            {markdown}
          </pre>
        </div>

        <div className="p-4 border-t border-[#DCE2EA] bg-white flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-[#5E6B7E] tabular-nums">
            {filename} · {markdown.length.toLocaleString('es-CO')} caracteres
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-medium text-[#0A1628] border border-[#BFC8D6] hover:bg-[#EFF2F6] inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#166534]" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copied ? 'Markdown copiado' : 'Copiar Markdown'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-medium text-white bg-[#0A1628] hover:bg-[#132542] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Descargar archivo .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
