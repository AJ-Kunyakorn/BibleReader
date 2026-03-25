import { useNavigate } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { john3Verses } from "../data/bibleData";
import { ChevronLeft, Trash2, Highlighter as HighlighterIcon } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function Highlights() {
  const navigate = useNavigate();
  const { highlights, removeHighlight, darkMode } = useBible();

  // Get actual highlighted verses
  const highlightedVerses = Array.from(highlights.values()).map(highlight => {
    const verse = john3Verses.find(v => v.id === highlight.verseId);
    return { ...highlight, verse };
  }).filter(h => h.verse);

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <OfflineBanner />

        {/* Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Highlights</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-6">
          {highlightedVerses.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <HighlighterIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Highlights Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start highlighting verses as you read to save them here
              </p>
              <button
                onClick={() => navigate('/read')}
                className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Start Reading
              </button>
            </div>
          ) : (
            /* Highlights List */
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {highlightedVerses.length} {highlightedVerses.length === 1 ? 'verse' : 'verses'} highlighted
              </p>
              
              {highlightedVerses.map(({ verseId, verse, timestamp }) => (
                <div
                  key={verseId}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[2rem]">
                          {verse!.verse}
                        </span>
                        <p className="flex-1 text-gray-900 dark:text-gray-100 leading-relaxed">
                          {verse!.text}
                        </p>
                      </div>
                      <div className="ml-11 flex items-center justify-between">
                        <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">
                          {verse!.book} {verse!.chapter}:{verse!.verse}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeHighlight(verseId)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                      aria-label="Remove highlight"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}