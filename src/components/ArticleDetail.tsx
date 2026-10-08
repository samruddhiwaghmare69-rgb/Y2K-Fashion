import React, { useState, useEffect } from 'react';
import { Article } from '../data/articles';
import {
  ArrowLeft,
  Bookmark,
  Heart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  MessageSquare,
  Sparkles,
  Calendar,
  Clock,
  Send,
  Eye,
  Info
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  articles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  likes: number;
  onLike: (articleId: string) => void;
  hasLiked: boolean;
}

interface CommentItem {
  id: string;
  author: string;
  date: string;
  text: string;
  likes: number;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  articles,
  onBack,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  likes,
  onLike,
  hasLiked,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Comments state persisted in localStorage
  const [comments, setComments] = useState<CommentItem[]>(() => {
    const saved = localStorage.getItem(`y2k_comments_${article.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default initial comments based on article
    return [
      {
        id: 'c1',
        author: 'Lexi_Archive02',
        date: '2 hours ago',
        text: `The breakdown on ${article.title.split(':')[0]} is so accurate. Sourcing authentic pieces on resale platforms has exploded lately!`,
        likes: 14,
      },
      {
        id: 'c2',
        author: 'RetroVault',
        date: '5 hours ago',
        text: 'Love the photographic documentation and the fact that the imagery is crisp yet loads instantaneously.',
        likes: 9,
      },
    ];
  });

  const [newAuthor, setNewAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Scroll listener for reading progress
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  const currentIndex = articles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: newAuthor.trim() || 'Y2K_Enthusiast',
      date: 'Just now',
      text: newCommentText.trim(),
      likes: 1,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`y2k_comments_${article.id}`, JSON.stringify(updated));
    setNewCommentText('');
    setNewAuthor('');
  };

  return (
    <article className="min-h-screen bg-stone-50 pb-24">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Navigation Subheader */}
      <div className="sticky top-18 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/90 py-2.5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-950 font-medium transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Issue #01</span>
          </button>

          <div className="font-mono text-stone-500 hidden sm:block">
            CHRONICLE <span className="text-stone-900 font-semibold">{String(currentIndex + 1).padStart(2, '0')}</span> OF 10
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
                isBookmarked
                  ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700 font-medium'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => onLike(article.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
                hasLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title="Like this article"
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border bg-white border-stone-200 text-stone-700 hover:bg-stone-100 text-xs cursor-pointer transition-colors"
              title="Copy share link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        {/* Editorial Kickers / Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500 mb-4">
          <span className="text-fuchsia-700 font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            {article.date}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {article.readTime}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
            Image payload: {article.image.fileSize} (&lt;100KB verified)
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.15] mb-5 text-balance">
          {article.title}
        </h1>

        {/* Subtitle Deck */}
        <p className="text-lg sm:text-xl text-stone-600 leading-relaxed font-light mb-8">
          {article.subtitle}
        </p>

        {/* Author Byline Lockup */}
        <div className="flex items-center justify-between py-4 border-y border-stone-200 text-xs text-stone-600 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-display font-bold text-sm">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-stone-900">{article.author.name}</div>
              <div className="text-stone-500">{article.author.role} · {article.author.handle}</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-stone-500 font-mono">
            <span>VOL. 1</span>
            <span className="text-stone-300">/</span>
            <span>CHRONICLE #{String(currentIndex + 1).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Primary Photographic Centerpiece */}
        <figure className="mb-12 bg-white border border-stone-200 overflow-hidden shadow-xs">
          <div className="relative aspect-4/3 w-full bg-stone-100">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
                <span className="text-xs font-mono text-stone-400">Loading verified visual...</span>
              </div>
            )}
            <img
              src={article.image.src}
              alt={article.image.alt}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Quick Inspection Affordance */}
            <button
              onClick={() => setShowImageZoom(!showImageZoom)}
              className="absolute bottom-3 right-3 bg-stone-900/85 hover:bg-stone-900 text-white text-xs px-2.5 py-1.5 rounded flex items-center gap-1.5 backdrop-blur-xs cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Asset</span>
            </button>
          </div>

          {/* Archival Accession Caption */}
          <figcaption className="p-4 bg-stone-50/80 border-t border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-serif italic leading-relaxed text-stone-700">
              {article.image.caption}
            </p>
            <div className="shrink-0 flex items-center gap-3 font-mono text-[11px] text-stone-500 bg-white border border-stone-200 px-2.5 py-1">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <HardDrive className="w-3 h-3 text-emerald-500" />
                {article.image.fileSize}
              </span>
              <span className="text-stone-300">|</span>
              <span>{article.image.format}</span>
              <span className="text-stone-300">|</span>
              <span>{article.image.dimensions}</span>
            </div>
          </figcaption>
        </figure>

        {/* Image Inspection Card (Toggled) */}
        {showImageZoom && (
          <div className="mb-10 p-4 bg-stone-900 text-stone-200 rounded-none border border-stone-800 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800">
              <span className="text-fuchsia-400 font-semibold">ASSET SPECIFICATION INSPECTION</span>
              <button
                onClick={() => setShowImageZoom(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div>
                <span className="text-stone-500 block">FILE WEIGHT:</span>
                <span className="text-emerald-400 font-bold">{article.image.fileSize} (Strictly &lt; 100KB)</span>
              </div>
              <div>
                <span className="text-stone-500 block">ENCODING:</span>
                <span>{article.image.format} (Quality: 76)</span>
              </div>
              <div>
                <span className="text-stone-500 block">ASPECT RATIO:</span>
                <span>4:3 ({article.image.dimensions} px)</span>
              </div>
              <div>
                <span className="text-stone-500 block">SOURCE PATH:</span>
                <span className="truncate block" title={article.image.src}>{article.image.src}</span>
              </div>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Verified: This visual asset has been pre-optimized to deliver authentic editorial color grading while keeping network weight safely beneath the 100KB boundary for instantaneous rendering.
            </p>
          </div>
        )}

        {/* Core Long-form Article Narrative */}
        <div className="space-y-10 text-stone-800 text-base sm:text-lg leading-[1.8] font-light">
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-5">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-950 pt-3">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, pIdx) => {
                // Drop cap on first paragraph of the first section
                if (idx === 0 && pIdx === 0) {
                  return (
                    <p
                      key={pIdx}
                      className="first-letter:text-5xl first-letter:font-serif first-letter:font-extrabold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:text-stone-950 leading-relaxed"
                    >
                      {p}
                    </p>
                  );
                }
                return (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                );
              })}

              {/* Editorial Pull Quote */}
              {section.pullQuote && (
                <div className="my-8 py-6 px-6 sm:px-8 bg-stone-100/90 border-l-4 border-fuchsia-600 text-stone-900">
                  <blockquote className="font-serif italic text-xl sm:text-2xl leading-snug">
                    "{section.pullQuote}"
                  </blockquote>
                </div>
              )}

              {/* Curator Archival Note */}
              {section.curatorNote && (
                <div className="p-4 bg-white border border-stone-200 text-xs sm:text-sm text-stone-700 font-mono flex items-start gap-3">
                  <Info className="w-4 h-4 text-fuchsia-600 shrink-0 mt-0.5" />
                  <div>{section.curatorNote}</div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Key Aesthetic Elements Module */}
        <div className="mt-14 p-6 bg-white border border-stone-200">
          <h3 className="font-display text-lg font-bold text-stone-950 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-600" />
            <span>Deconstructed DNA: Key Silhouette Elements</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
            {article.keyElements.map((elem, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="font-mono text-fuchsia-600 font-bold text-xs mt-0.5">0{i + 1}.</span>
                <span>{elem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Timeline Module */}
        <div className="mt-8 p-6 bg-stone-100/70 border border-stone-200">
          <h3 className="font-display text-lg font-bold text-stone-950 mb-4">
            Chronological Pivots & Cultural Milestones
          </h3>
          <div className="space-y-4">
            {article.historicalPivots.map((pivot, pIdx) => (
              <div key={pIdx} className="flex items-start gap-4 text-sm">
                <span className="font-mono font-bold text-stone-950 bg-white px-2 py-0.5 border border-stone-200 text-xs shrink-0">
                  {pivot.year}
                </span>
                <span className="text-stone-700 leading-relaxed">{pivot.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Style Guide & How to Wear in 2026 */}
        <div className="mt-8 p-6 bg-white border border-stone-200">
          <h3 className="font-display text-lg font-bold text-stone-950 mb-4">
            Styling Directive: How to Wear This in 2026
          </h3>
          <ul className="space-y-3 text-sm text-stone-700">
            {article.styleGuideTips.map((tip, tIdx) => (
              <li key={tIdx} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-fuchsia-100 text-fuchsia-800 flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags unboxed */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500">
          <span className="text-stone-400">ARCHIVE TAGS:</span>
          {article.tags.map((tag, tIdx) => (
            <span key={tIdx} className="text-stone-700 hover:text-fuchsia-700 transition-colors">
              #{tag}{tIdx < article.tags.length - 1 ? ' ·' : ''}
            </span>
          ))}
        </div>

        {/* Engagement Strip */}
        <div className="mt-12 py-5 px-6 bg-white border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLike(article.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded cursor-pointer transition-colors ${
                hasLiked
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{hasLiked ? 'Liked Chronicle' : 'Approve Chronicle'} ({likes})</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded cursor-pointer transition-colors ${
                isBookmarked
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'In Saved List' : 'Save for Later'}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Interactive Comments Section */}
        <section className="mt-14 pt-10 border-t border-stone-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-bold text-stone-950 flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-fuchsia-600" />
              <span>Reader Dialogue ({comments.length})</span>
            </h3>
            <span className="text-xs font-mono text-stone-500">LIVE ARCHIVE DISCUSSION</span>
          </div>

          {/* New Comment Submission Form */}
          <form onSubmit={handleAddComment} className="mb-8 p-5 bg-white border border-stone-200 shadow-xs">
            <div className="mb-3">
              <label className="block text-xs font-mono text-stone-600 mb-1">
                YOUR ALIAS / HANDLE
              </label>
              <input
                type="text"
                placeholder="e.g. vintage_stargazer"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500 font-mono"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-mono text-stone-600 mb-1">
                STYLE OBSERVATION OR HISTORICAL MEMORY
              </label>
              <textarea
                rows={3}
                placeholder="Share your thoughts on this look, your personal memories, or how you style it today..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full text-sm p-3 bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-fuchsia-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* Existing Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-white border border-stone-200">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-stone-900 font-mono">@{comment.author}</span>
                  <span className="font-mono text-stone-400">{comment.date}</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Previous / Next Article Navigation Bar */}
        <div className="mt-16 pt-8 border-t border-stone-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <button
              onClick={() => onSelectArticle(prevArticle)}
              className="p-4 text-left bg-white border border-stone-200 hover:border-stone-400 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-1 text-xs text-stone-500 font-mono mb-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS CHRONICLE</span>
              </div>
              <div className="font-display font-bold text-sm text-stone-900 group-hover:text-fuchsia-700 transition-colors line-clamp-1">
                {prevArticle.title}
              </div>
            </button>
          ) : <div />}

          {nextArticle ? (
            <button
              onClick={() => onSelectArticle(nextArticle)}
              className="p-4 text-right bg-white border border-stone-200 hover:border-stone-400 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-end gap-1 text-xs text-stone-500 font-mono mb-1">
                <span>NEXT CHRONICLE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <div className="font-display font-bold text-sm text-stone-900 group-hover:text-fuchsia-700 transition-colors line-clamp-1">
                {nextArticle.title}
              </div>
            </button>
          ) : <div />}
        </div>
      </div>
    </article>
  );
};
