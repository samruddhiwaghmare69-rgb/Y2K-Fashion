import React from 'react';
import { X, Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import { Article } from '../data/articles';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-fuchsia-600" />
            <h2 className="font-display font-bold text-lg text-stone-950">
              Saved Chronicles ({bookmarkedArticles.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 cursor-pointer p-1"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
          {bookmarkedArticles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <Bookmark className="w-10 h-10 text-stone-300 mb-3" />
              <p className="font-display font-semibold text-stone-800 mb-1">
                Your Reading List is Empty
              </p>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
                Click the bookmark icon on any of the 10 Y2K fashion chronicles to save them here for offline reference.
              </p>
            </div>
          ) : (
            bookmarkedArticles.map((article) => (
              <div key={article.id} className="py-4 first:pt-0 last:pb-0 flex gap-3 group">
                <div className="w-20 h-16 shrink-0 bg-stone-100 overflow-hidden border border-stone-200">
                  <img
                    src={article.image.src}
                    alt={article.image.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-fuchsia-700 font-semibold mb-0.5">
                    {article.category}
                  </div>
                  <a
                    href={`/${article.slug}`}
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        onSelectArticle(article);
                        onClose();
                      }
                    }}
                    className="font-display font-bold text-sm text-stone-900 hover:text-fuchsia-700 transition-colors cursor-pointer line-clamp-1 block text-inherit no-underline"
                  >
                    {article.title}
                  </a>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 font-mono">
                    <span>{article.readTime} · {article.image.fileSize}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveBookmark(article.id)}
                        className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`/${article.slug}`}
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey) {
                            e.preventDefault();
                            onSelectArticle(article);
                            onClose();
                          }
                        }}
                        className="text-stone-900 hover:text-fuchsia-700 font-semibold flex items-center gap-0.5 cursor-pointer text-inherit no-underline"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedArticles.length > 0 && (
          <div className="p-4 border-t border-stone-200 flex items-center justify-between bg-stone-50 text-xs">
            <button
              onClick={onClearAll}
              className="text-stone-500 hover:text-rose-600 font-mono cursor-pointer"
            >
              Clear all bookmarks
            </button>
            <span className="font-mono text-stone-400">
              {bookmarkedArticles.length} / 10 Articles
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
