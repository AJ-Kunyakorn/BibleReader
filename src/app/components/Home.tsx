import { useNavigate } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { getDailyVerse } from "../data/bibleData";
import { BookOpen, Highlighter, FileText, Search, ArrowRight } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function Home() {
  const navigate = useNavigate();
  const { readingProgress, highlights, notes, darkMode } = useBible();
  const dailyVerse = getDailyVerse();

  const highlightCount = highlights.size;
  const noteCount = notes.length;

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <OfflineBanner />
        
        {/* Header */}
        <header className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white pt-12 pb-8 px-6">
          <h1 className="text-3xl mb-2">Bible App</h1>
          <p className="text-blue-100 text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="px-6 -mt-4">
          {/* Search Bar */}
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3 text-left transition-transform active:scale-98"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">Search verses, books...</span>
          </button>

          {/* Continue Reading Card */}
          {readingProgress && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Continue Reading</h2>
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {readingProgress.book} {readingProgress.chapter}:{readingProgress.verse}
              </p>
              <button
                onClick={() => navigate('/read')}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Continue Reading
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Daily Verse */}
          <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-md p-5 border border-amber-100 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-400 mb-3 uppercase tracking-wide">
              Verse of the Day
            </h2>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
              "{dailyVerse.text}"
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-500 font-medium">
              {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/highlights')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-left border border-gray-100 dark:border-gray-700 transition-transform active:scale-95"
            >
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-3">
                <Highlighter className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Highlights</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{highlightCount} verses</p>
            </button>

            <button
              onClick={() => navigate('/notes')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-left border border-gray-100 dark:border-gray-700 transition-transform active:scale-95"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Notes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{noteCount} notes</p>
            </button>
          </div>

          {/* Start Reading CTA (if no reading progress) */}
          {!readingProgress && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 text-center">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Your Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Begin reading the Bible today
              </p>
              <button
                onClick={() => navigate('/read')}
                className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Start Reading
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}