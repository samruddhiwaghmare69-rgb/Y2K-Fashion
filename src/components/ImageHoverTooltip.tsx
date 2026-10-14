import React, { useEffect, useState, useRef } from 'react';
import { Info, Eye, HardDrive } from 'lucide-react';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  description: string;
  caption?: string;
  specs?: string;
}

/**
 * Universal ImageHoverTooltip
 * Listens for hover events on ANY <img> element across all webpages and modals,
 * presenting a refined, high-legibility archival description card near the cursor.
 */
export const ImageHoverTooltip: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    description: '',
  });

  const activeImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const img = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.closest('img');
      if (img) {
        activeImgRef.current = img;
        const description =
          img.getAttribute('data-image-description') ||
          img.getAttribute('alt') ||
          img.getAttribute('title') ||
          '';

        const caption = img.getAttribute('data-image-caption') || undefined;
        const specs = img.getAttribute('data-image-specs') || undefined;

        if (description.trim()) {
          // Strip any duplicate prefix if present in title
          const cleanDesc = description.replace(/^Image Description:\s*/i, '');
          setTooltip({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            description: cleanDesc,
            caption,
            specs,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (activeImgRef.current) {
        setTooltip((prev) => (prev.visible ? { ...prev, x: e.clientX, y: e.clientY } : prev));
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (activeImgRef.current && (!related || !activeImgRef.current.contains(related))) {
        activeImgRef.current = null;
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleScrollOrDismiss = () => {
      activeImgRef.current = null;
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('scroll', handleScrollOrDismiss, { passive: true });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') handleScrollOrDismiss();
    });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('scroll', handleScrollOrDismiss);
    };
  }, []);

  if (!tooltip.visible || !tooltip.description) return null;

  // Viewport bounds calculation: keep tooltip smoothly inside screen
  const tooltipWidth = 320;
  const tooltipHeight = 130;
  let posX = tooltip.x + 16;
  let posY = tooltip.y + 16;

  if (typeof window !== 'undefined') {
    if (posX + tooltipWidth > window.innerWidth - 12) {
      posX = Math.max(12, tooltip.x - tooltipWidth - 16);
    }
    if (posY + tooltipHeight > window.innerHeight - 12) {
      posY = Math.max(12, tooltip.y - tooltipHeight - 16);
    }
  }

  return (
    <aside
      role="tooltip"
      aria-live="polite"
      className="fixed z-[9999] pointer-events-none transition-transform duration-75 ease-out select-none"
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${tooltipWidth}px`,
      }}
    >
      <div className="bg-stone-950/95 backdrop-blur-md text-stone-100 border border-stone-700/80 shadow-2xl rounded-lg p-3 text-xs font-sans">
        <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-stone-800 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-fuchsia-400 font-semibold tracking-wider uppercase">
            <Info className="w-3 h-3 text-fuchsia-400 shrink-0" />
            <span>IMAGE DESCRIPTION</span>
          </span>
          {tooltip.specs && (
            <span className="text-stone-400 shrink-0 flex items-center gap-1">
              <HardDrive className="w-2.5 h-2.5 text-emerald-400" />
              <span>{tooltip.specs}</span>
            </span>
          )}
        </div>
        <p className="text-stone-100 leading-snug font-medium mb-1">
          {tooltip.description}
        </p>
        {tooltip.caption && (
          <p className="text-[11px] text-stone-400 font-serif italic border-t border-stone-800/60 pt-1 mt-1 leading-snug">
            {tooltip.caption}
          </p>
        )}
      </div>
    </aside>
  );
};
