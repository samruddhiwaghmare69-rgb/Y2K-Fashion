import React, { useState } from 'react';
import { Article } from '../data/articles';
import { ArrowUpRight, Heart, Bookmark, HardDrive, Info } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  index: number;
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  likes: number;
  onLike: (articleId: string) => void;
  hasLiked: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  index,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  likes,
  onLike,
  hasLiked,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <a
      href={`/${article.slug}`}
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          onSelect(article);
        }
      }}
      title={`Read complete 24-paragraph archival chronicle on ${article.title}`}
      aria-label={`Read complete 24-paragraph archival chronicle on ${article.title}`}
      className="group flex flex-col bg-white border border-stone-200/90 hover:border-stone-400/90 rounded-none transition-all duration-200 cursor-pointer overflow-hidden h-full shadow-xs hover:shadow-md text-inherit no-underline"
    >
      {/* Visual Media Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {/* Skeleton/Fallback */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
            <span className="text-xs font-mono text-stone-400">Loading asset...</span>
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 mb-2 font-mono text-xs">
              Y2K
            </div>
            <p className="text-xs font-medium text-stone-700">{article.title}</p>
          </div>
        ) : (
          <img
            src={article.image.src}
            alt={article.image.alt}
            title={`Image Description: ${article.image.alt} — ${article.image.caption}`}
            data-image-description={article.image.alt}
            data-image-caption={article.image.caption}
            data-image-specs={`${article.image.fileSize} · ${article.image.format} · ${article.image.dimensions}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Lightweight Asset Spec Watermark Overlay (Clean, unboxed) */}
        <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 flex items-center gap-1.5 pointer-events-none z-10">
          <HardDrive className="w-3 h-3 text-emerald-400" />
          <span>{article.image.fileSize}</span>
          <span className="text-stone-400">·</span>
          <span>WebP</span>
        </div>

        {/* Visual Image Description Overlay on Hover */}
        <div
          role="tooltip"
          aria-label="Image Description"
          className="absolute inset-x-0 bottom-0 p-3 pr-20 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end z-10"
        >
          <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-fuchsia-400 font-semibold mb-0.5">
            <Info className="w-3 h-3 text-fuchsia-400 shrink-0" />
            <span>Image Description</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-300 font-normal">{article.image.dimensions}</span>
          </div>
          <p className="text-xs text-stone-100 font-sans leading-snug line-clamp-3">
            {article.image.alt}
          </p>
        </div>

        {/* Action Shortcuts overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            aria-label="Bookmark article"
            className={`p-1.5 rounded bg-white/95 text-stone-800 shadow-sm hover:bg-stone-100 cursor-pointer transition-colors ${
              isBookmarked ? 'text-fuchsia-600' : ''
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(article.id);
            }}
            aria-label="Like article"
            className={`p-1.5 rounded bg-white/95 text-stone-800 shadow-sm hover:bg-stone-100 cursor-pointer transition-colors ${
              hasLiked ? 'text-rose-600' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Editorial Content Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata with subtle typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5 font-mono">
            <span className="text-fuchsia-700 font-semibold">{formattedIndex}</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span>{article.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Primary Editorial Headline */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900 group-hover:text-fuchsia-900 transition-colors leading-snug mb-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer / Read Affordance */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span>By {article.author.name}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-900 font-semibold group-hover:text-fuchsia-700 transition-colors">
            <span>Read Detailed Chronicle</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </a>
  );
};
