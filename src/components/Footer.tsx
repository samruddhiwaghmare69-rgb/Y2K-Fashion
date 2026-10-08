import React from 'react';
import { HardDrive, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAudit: () => void;
  onOpenQuiz: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAudit,
  onOpenQuiz,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Column 1: Brand Wordmark & Mission */}
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-extrabold tracking-tight text-white block mb-3">
              MILLENNIUM REVIVAL
            </span>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md mb-6">
              A curatorial digital publication documenting the revival of late 1990s and early 2000s fashion. From rhinestone velour tracksuits to cyber-metallic streetwear, we explore how millennium subcultures redefined global style.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
              <span className="text-fuchsia-400 font-semibold">ISSUE 01</span>
              <span>·</span>
              <span>10 CURATED CHRONICLES</span>
              <span>·</span>
              <span>ALL IMAGES &lt;100KB</span>
            </div>
          </div>

          {/* Column 2: Department Archives */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Curated Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('Streetwear & Lounge')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Streetwear & Loungewear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Denim Archives')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Denim Archives & Low-Rise
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Techno-Futurism')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Techno-Futurism & Metallics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Accessories & Bling')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Accessories, Bling & Clips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Footwear & Stompers')}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Footwear & Platform Stompers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Utility & Audit */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4 tracking-wide uppercase">
              Archive Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={onOpenAudit}
                  className="hover:text-fuchsia-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Asset Weight Audit (&lt;100KB)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-fuchsia-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Interactive Y2K Style Quiz</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  Back to Top of Page
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-mono gap-4">
          <div>
            © 2026 Millennium Revival Archive. Curated fashion historical analysis.
          </div>
          <div>
            Designed with Zero-Pill Typographic Discipline · 10 Distinct WebP Assets
          </div>
        </div>
      </div>
    </footer>
  );
};
