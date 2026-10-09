import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { Article, ARTICLES } from '../data/articles';

interface StyleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

interface Question {
  title: string;
  options: {
    label: string;
    description: string;
    targetArticleId: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    title: "1. What is the soundtrack powering your walk through the city?",
    options: [
      {
        label: "Max Martin Pop Royalty",
        description: "Britney, Christina & *NSYNC blasting through hot pink wired headphones.",
        targetArticleId: "velour-tracksuits",
      },
      {
        label: "Suburban Skate & Pop-Punk",
        description: "Avril Lavigne, Blink-182 & Sum 41 echoing across the local skate park.",
        targetArticleId: "trucker-hats",
      },
      {
        label: "Liquid Gold R&B Perfection",
        description: "Aaliyah, Destiny's Child & TLC harmonizing with deep sub-bass grooves.",
        targetArticleId: "cargo-pants",
      },
      {
        label: "Techno-Club Millennium Countdown",
        description: "Eurodance, Daft Punk & chemical brothers preparing for the Y2K digital dawn.",
        targetArticleId: "cyber-metallics",
      },
    ],
  },
  {
    title: "2. Your non-negotiable daytime silhouette is:",
    options: [
      {
        label: "Low-Slung Flare Denim & Baby Tee",
        description: "Whiskered wash, grommet belt, and exposed midriff framing a butterfly chain.",
        targetArticleId: "low-rise-denim",
      },
      {
        label: "Pleated Tartan Mini & Stompers",
        description: "Razor-short pleated skirt with knee-high platform combat boots.",
        targetArticleId: "pleated-micro-minis",
      },
      {
        label: "Plush Monochromatic Velour",
        description: "Bubblegum pink zip-up hoodie and matching flare pants with rhinestone flair.",
        targetArticleId: "velour-tracksuits",
      },
      {
        label: "Baggy Parachute Cargos & Bandeau",
        description: "Multi-pocket nylon volume contrasted against a minimal tight tube top.",
        targetArticleId: "cargo-pants",
      },
    ],
  },
  {
    title: "3. Choose your ultimate signature accessory:",
    options: [
      {
        label: "Frameless Tinted Shield Sunglasses",
        description: "Oversized champagne gradient lenses with pavé rhinestone temples.",
        targetArticleId: "shield-sunglasses",
      },
      {
        label: "Pastel Translucent Butterfly Hair Clips",
        description: "Dozens of tiny spring-loaded acrylic wings fluttering through crimped tendrils.",
        targetArticleId: "butterfly-clips",
      },
      {
        label: "Sky-Blue Patent Baguette Bag",
        description: "Slim rectangular purse tucked snug under the shoulder next to a flip phone.",
        targetArticleId: "baguette-bags",
      },
      {
        label: "Thick Foam Platform Thong Sandals",
        description: "Sculptural 3-inch black EVA slides that make a satisfying thud on asphalt.",
        targetArticleId: "platform-sandals",
      },
    ],
  },
];

export const StyleQuizModal: React.FC<StyleQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [resultArticle, setResultArticle] = useState<Article | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (targetArticleId: string) => {
    const updated = [...selectedAnswers, targetArticleId];
    setSelectedAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tally or select matching article
      const chosenId = updated[updated.length - 1] || 'velour-tracksuits';
      const matched = ARTICLES.find((a) => a.id === chosenId) || ARTICLES[0];
      setResultArticle(matched);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setResultArticle(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-300 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 cursor-pointer p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!resultArticle ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-fuchsia-700 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STEP 0{currentStep + 1} OF 03 · Y2K PERSONA MATCHER</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-950 mb-6">
              {QUESTIONS[currentStep].title}
            </h2>

            <div className="space-y-3">
              {QUESTIONS[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.targetArticleId)}
                  className="w-full text-left p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-400 transition-all cursor-pointer group"
                >
                  <div className="font-display font-bold text-base text-stone-900 group-hover:text-fuchsia-800 transition-colors">
                    {opt.label}
                  </div>
                  <div className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {opt.description}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-stone-400 font-mono">
              <span>ANSWER TO ADVANCE AUTOMATICALLY</span>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-stone-600 hover:text-stone-900 underline cursor-pointer"
                >
                  Previous step
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-12 h-12 bg-fuchsia-100 text-fuchsia-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-fuchsia-700 font-semibold block mb-1">
              YOUR MILLENNIUM ARCHETYPE MATCH
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-950 mb-3">
              {resultArticle.title}
            </h2>

            <p className="text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
              {resultArticle.excerpt}
            </p>

            <div className="relative aspect-4/3 max-w-sm mx-auto mb-6 border border-stone-200 overflow-hidden bg-stone-100 shadow-sm">
              <img
                src={resultArticle.image.src}
                alt={resultArticle.image.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[11px] font-mono px-2 py-0.5">
                {resultArticle.image.fileSize} · WebP
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/${resultArticle.slug}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    onSelectArticle(resultArticle);
                    onClose();
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-stone-950 hover:bg-fuchsia-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors text-inherit no-underline"
              >
                <span>Read Full Chronicle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
