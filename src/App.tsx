/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ARTICLES, Article } from './data/articles';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { StyleQuizModal } from './components/StyleQuizModal';
import { WeightAuditModal } from './components/WeightAuditModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { Footer } from './components/Footer';
import {
  Sparkles,
  ArrowRight,
  HardDrive,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  BookOpen,
  Layers,
  Zap,
} from 'lucide-react';

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Bookmarks state (localStorage persisted)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('y2k_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Likes counts state (localStorage persisted)
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ARTICLES.forEach((a) => {
      initial[a.id] = a.likesCount;
    });
    try {
      const saved = localStorage.getItem('y2k_likes_map');
      if (saved) {
        return { ...initial, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return initial;
  });

  // User liked state
  const [userLiked, setUserLiked] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('y2k_user_liked');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Handle clean HTML5 pathname routing without hash symbols and remove unwanted tokens
  useEffect(() => {
    const handleLocationChange = () => {
      // Actively remove '5o91' if it appears in pathname, query string, or hash
      if (
        window.location.pathname.includes('5o91') ||
        window.location.search.includes('5o91') ||
        window.location.hash.includes('5o91')
      ) {
        const sanitizedPath =
          window.location.pathname.replace(/\/?5o91\/?/gi, '/').replace(/\/+/g, '/') || '/';
        window.history.replaceState({}, '', sanitizedPath);
      }

      // Extract clean pathname (e.g. /velour-tracksuits -> velour-tracksuits)
      const rawPath = window.location.pathname.replace(/\/?5o91\/?/gi, '/');
      const path = rawPath.replace(/^\/+/, '').replace(/\/+$/, '');

      if (path) {
        const found = ARTICLES.find((a) => a.slug === path || a.id === path);
        if (found) {
          setSelectedArticle(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // If user had a hash previously, cleanly replace it with the clean pathname URL
      if (window.location.hash) {
        const hash = window.location.hash.replace(/^#\/?/, '').replace(/5o91/gi, '');
        const found = ARTICLES.find((a) => a.slug === hash || a.id === hash);
        if (found) {
          window.history.replaceState({}, '', `/${found.slug}`);
          setSelectedArticle(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      setSelectedArticle(null);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.history.pushState({}, '', `/${article.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedArticle(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (articleId: string) => {
    let updated: string[];
    if (bookmarks.includes(articleId)) {
      updated = bookmarks.filter((id) => id !== articleId);
    } else {
      updated = [...bookmarks, articleId];
    }
    setBookmarks(updated);
    localStorage.setItem('y2k_bookmarks', JSON.stringify(updated));
  };

  const handleLike = (articleId: string) => {
    if (userLiked.includes(articleId)) {
      // Already liked, toggle off
      const nextUserLiked = userLiked.filter((id) => id !== articleId);
      const nextLikesMap = {
        ...likesMap,
        [articleId]: Math.max(0, (likesMap[articleId] || 1) - 1),
      };
      setUserLiked(nextUserLiked);
      setLikesMap(nextLikesMap);
      localStorage.setItem('y2k_user_liked', JSON.stringify(nextUserLiked));
      localStorage.setItem('y2k_likes_map', JSON.stringify(nextLikesMap));
    } else {
      // Add like
      const nextUserLiked = [...userLiked, articleId];
      const nextLikesMap = {
        ...likesMap,
        [articleId]: (likesMap[articleId] || 0) + 1,
      };
      setUserLiked(nextUserLiked);
      setLikesMap(nextLikesMap);
      localStorage.setItem('y2k_user_liked', JSON.stringify(nextUserLiked));
      localStorage.setItem('y2k_likes_map', JSON.stringify(nextLikesMap));
    }
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem('y2k_bookmarks');
  };

  // Filter articles by category and search
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.author.name.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const bookmarkedArticleList = useMemo(() => {
    return ARTICLES.filter((a) => bookmarks.includes(a.id));
  }, [bookmarks]);

  // Lead flagship story is Article 1 or first matching
  const leadStory = ARTICLES[0];
  const secondaryStories = ARTICLES.slice(1, 3);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Universal Top Navigation Header */}
      <Header
        activeTab={activeCategory}
        onSelectTab={(tab) => {
          setActiveCategory(tab);
          if (selectedArticle) {
            handleBackToCatalog();
          }
        }}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Branch: Detail View vs Magazine Catalog */}
      <main className="flex-1">
        {selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            articles={ARTICLES}
            onBack={handleBackToCatalog}
            onSelectArticle={handleSelectArticle}
            isBookmarked={bookmarks.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            likes={likesMap[selectedArticle.id] || selectedArticle.likesCount}
            onLike={handleLike}
            hasLiked={userLiked.includes(selectedArticle.id)}
          />
        ) : (
          <div className="pb-24">
            {/* HERO SECTION / LEAD STORY (Visible when not actively searching) */}
            {!searchQuery && activeCategory === 'all' && (
              <section className="border-b border-stone-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                  {/* Lead Marquee Kicker */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200 text-xs font-mono text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="bg-fuchsia-100 text-fuchsia-900 font-bold px-2 py-0.5">FEATURE STORY</span>
                      <span>ISSUE #01 CHRONICLE · CURATOR'S SELECTION</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-600">
                      <span>10 COMPREHENSIVE ESSAYS</span>
                      <span className="text-stone-300">·</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ALL 10 IMAGES &lt;100KB
                      </span>
                    </div>
                  </div>

                  {/* 3-Tier Visual Salience: Tier 1 Lead + Tier 2 Secondary Features */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Lead Story Left/Center (7 cols) */}
                    <a
                      href={`/${leadStory.slug}`}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          handleSelectArticle(leadStory);
                        }
                      }}
                      className="lg:col-span-7 group cursor-pointer text-inherit no-underline block"
                    >
                      <div className="relative aspect-4/3 w-full bg-stone-100 border border-stone-200 overflow-hidden mb-5">
                        <img
                          src={leadStory.image.src}
                          alt={leadStory.image.alt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                        <div className="absolute top-3 right-3 bg-stone-900/85 text-white font-mono text-xs px-2.5 py-1 backdrop-blur-xs flex items-center gap-1.5">
                          <HardDrive className="w-3 h-3 text-emerald-400" />
                          <span>{leadStory.image.fileSize} (WebP)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-2">
                        <span className="text-fuchsia-700 font-bold">CHRONICLE 01</span>
                        <span aria-hidden="true" className="text-stone-300">/</span>
                        <span>{leadStory.category}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{leadStory.readTime}</span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 group-hover:text-fuchsia-800 transition-colors leading-tight mb-3">
                        {leadStory.title}
                      </h2>

                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                        {leadStory.excerpt}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 group-hover:text-fuchsia-700 transition-colors">
                        <span>Read Lead Chronicle</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>

                    {/* Secondary Stories Right (5 cols) */}
                    <div className="lg:col-span-5 space-y-6 pt-2 lg:pt-0 lg:pl-6 lg:border-l lg:border-stone-200">
                      <div className="font-display text-xs font-bold uppercase tracking-wider text-stone-500 pb-2 border-b border-stone-100">
                        Spotlight Retrospectives
                      </div>

                      {secondaryStories.map((secArticle, sIdx) => (
                        <a
                          key={secArticle.id}
                          href={`/${secArticle.slug}`}
                          onClick={(e) => {
                            if (!e.metaKey && !e.ctrlKey) {
                              e.preventDefault();
                              handleSelectArticle(secArticle);
                            }
                          }}
                          className="group cursor-pointer pb-6 border-b border-stone-100 last:border-b-0 last:pb-0 text-inherit no-underline block"
                        >
                          <div className="relative aspect-16/10 w-full bg-stone-100 border border-stone-200 overflow-hidden mb-3">
                            <img
                              src={secArticle.image.src}
                              alt={secArticle.image.alt}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                            />
                            <div className="absolute top-2 right-2 bg-stone-900/80 text-white font-mono text-[11px] px-2 py-0.5">
                              {secArticle.image.fileSize}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-1">
                            <span className="text-fuchsia-700 font-bold">0{sIdx + 2}</span>
                            <span>·</span>
                            <span>{secArticle.category}</span>
                            <span>·</span>
                            <span>{secArticle.readTime}</span>
                          </div>

                          <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 group-hover:text-fuchsia-800 transition-colors leading-snug mb-1.5">
                            {secArticle.title}
                          </h3>

                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {secArticle.excerpt}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* CURATOR'S MANIFESTO RIBBON */}
            <section className="bg-stone-100 border-b border-stone-200 py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-white border border-stone-200 shadow-xs">
                    <div className="flex items-center gap-2 text-fuchsia-700 font-mono text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>THE THESIS</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-stone-950 mb-2">
                      Why Bring Back Y2K Now?
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Fatigued by sterile beige corporate minimalism and algorithmic conformity, contemporary fashion has returned to the turn of the millennium for its uninhibited joy, tactile humor, and unapologetic self-expression.
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-stone-200 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold mb-2">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>TECHNICAL DISCIPLINE</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-stone-950 mb-2">
                      Zero-Bloat Media Architecture
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Every single article is equipped with a distinct, custom-generated editorial visual strictly compressed under 100KB (averaging ~64KB WebP) so that reading remains instantaneous across mobile and desktop.
                    </p>
                  </div>

                  <div className="p-5 bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-bold mb-2">
                        <Zap className="w-3.5 h-3.5" />
                        <span>INTERACTIVE STYLING</span>
                      </div>
                      <h3 className="font-display font-bold text-base text-stone-950 mb-2">
                        Discover Your 2000s Persona
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Take our 3-question stylist quiz to discover whether your authentic silhouette leans towards Velour Royalty, Cyber Futurism, or Skater Pop-Punk.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsQuizOpen(true)}
                      className="mt-4 w-full py-2 bg-stone-900 hover:bg-fuchsia-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Take 60-Second Quiz</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* CATALOG FILTER & SEARCH BAR */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
                    The 10 Millennium Chronicles
                  </h2>
                  <p className="text-xs text-stone-500 font-mono mt-1">
                    COMPLETE MONOGRAPH RETROSPECTIVE · SHOWING {filteredArticles.length} OF 10 ESSAYS
                  </p>
                </div>

                {/* Interactive Filter Tabs (functional buttons with click handlers) */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-lg">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === 'all'
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    All (10)
                  </button>
                  <button
                    onClick={() => setActiveCategory('Streetwear & Lounge')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === 'Streetwear & Lounge'
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Streetwear
                  </button>
                  <button
                    onClick={() => setActiveCategory('Denim Archives')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === 'Denim Archives'
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Denim
                  </button>
                  <button
                    onClick={() => setActiveCategory('Techno-Futurism')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === 'Techno-Futurism'
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Cyber
                  </button>
                  <button
                    onClick={() => setActiveCategory('Accessories & Bling')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === 'Accessories & Bling'
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Accessories
                  </button>
                  <button
                    onClick={() => setActiveCategory('Footwear & Stompers')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === 'Footwear & Stompers'
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Footwear
                  </button>
                </div>
              </div>

              {/* Active Search Notice if Searching */}
              {searchQuery && (
                <div className="mt-4 flex items-center justify-between text-xs font-mono bg-stone-100 p-2.5 border border-stone-200">
                  <span>
                    Searching for: <strong className="text-stone-900">"{searchQuery}"</strong> ({filteredArticles.length} results)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-fuchsia-700 hover:underline cursor-pointer"
                  >
                    Clear search filter
                  </button>
                </div>
              )}
            </section>

            {/* 10 ARTICLES EDITORIAL CATALOG GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              {filteredArticles.length === 0 ? (
                <div className="py-20 text-center bg-white border border-stone-200 p-8">
                  <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-lg text-stone-900 mb-1">
                    No Chronicles Found
                  </h3>
                  <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                    We could not find any articles matching your search query. Try searching for "denim", "velour", "cargos", or "sunglasses".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      index={ARTICLES.findIndex((a) => a.id === article.id)}
                      onSelect={handleSelectArticle}
                      isBookmarked={bookmarks.includes(article.id)}
                      onToggleBookmark={handleToggleBookmark}
                      likes={likesMap[article.id] || article.likesCount}
                      onLike={handleLike}
                      hasLiked={userLiked.includes(article.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <StyleQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectArticle={handleSelectArticle}
      />

      <WeightAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        onSelectArticle={handleSelectArticle}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticles={bookmarkedArticleList}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Universal Editorial Footer */}
      <Footer
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (selectedArticle) {
            handleBackToCatalog();
          }
          const catEl = document.getElementById('catalog');
          if (catEl) {
            catEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}
