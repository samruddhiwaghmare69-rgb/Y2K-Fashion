import React from 'react';
import { Bookmark, Sparkles, SlidersHorizontal, Search } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  onOpenQuiz: () => void;
  onOpenAudit: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  bookmarksCount,
  onOpenBookmarks,
  onOpenQuiz,
  onOpenAudit,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      {/* Editorial Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <span className="text-fuchsia-400 font-semibold tracking-wider">ISSUE #01</span>
          <span className="text-stone-400">·</span>
          <span>THE MILLENNIUM STYLE CHRONICLES (1998–2004 // 2026 REVIVAL)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-stone-300 text-xs">
          <button
            onClick={onOpenAudit}
            className="hover:text-fuchsia-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Inspect image payload weights"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>10 Assets &lt; 100KB Verified</span>
          </button>
          <span className="text-stone-600">|</span>
          <button
            onClick={onOpenQuiz}
            className="hover:text-fuchsia-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-fuchsia-400" />
            <span>Find Your Y2K Persona</span>
          </button>
        </div>
      </div>

      {/* Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            onSelectTab('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 rounded"
        >
          <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 group-hover:text-fuchsia-700 transition-colors">
            MILLENNIUM REVIVAL
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('all')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'all'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-fuchsia-600'
                : 'hover:text-stone-950'
            }`}
          >
            All 10 Articles
          </button>
          <button
            onClick={() => onSelectTab('Streetwear & Lounge')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'Streetwear & Lounge'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-fuchsia-600'
                : 'hover:text-stone-950'
            }`}
          >
            Streetwear
          </button>
          <button
            onClick={() => onSelectTab('Denim Archives')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'Denim Archives'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-fuchsia-600'
                : 'hover:text-stone-950'
            }`}
          >
            Denim
          </button>
          <button
            onClick={() => onSelectTab('Techno-Futurism')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'Techno-Futurism'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-fuchsia-600'
                : 'hover:text-stone-950'
            }`}
          >
            Cyber Futurism
          </button>
          <button
            onClick={() => onSelectTab('Accessories & Bling')}
            className={`transition-colors relative py-1 cursor-pointer ${
              activeTab === 'Accessories & Bling'
                ? 'text-stone-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-fuchsia-600'
                : 'hover:text-stone-950'
            }`}
          >
            Accessories
          </button>
          <button
            onClick={onOpenQuiz}
            className="hover:text-stone-950 transition-colors py-1 cursor-pointer flex items-center gap-1.5"
          >
            <span>Style Quiz</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search trends & archives..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200/70 focus:bg-white border border-stone-200 rounded-lg w-44 lg:w-56 transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            />
          </div>

          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            aria-label="View saved reading list"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Saved</span>
            {bookmarksCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-fuchsia-600 text-white font-mono text-[11px] rounded-full">
                {bookmarksCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAudit}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <span className="hidden sm:inline">Inspect &lt;100KB Assets</span>
            <span className="sm:hidden">Assets</span>
          </button>
        </div>
      </div>
    </header>
  );
};
