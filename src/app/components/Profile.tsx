import { useNavigate } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { Sun, Moon, BookOpen, Highlighter, FileText, ChevronRight, Info } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function Profile() {
  const navigate = useNavigate();
  const { 
    darkMode, 
    toggleDarkMode, 
    highlights, 
    notes, 
    readingProgress 
  } = useBible();

  const stats = [
    { label: 'Highlights', value: highlights.size, icon: Highlighter, color: 'text-yellow-600 dark:text-yellow-500' },
    { label: 'Notes', value: notes.length, icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
  ];

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <OfflineBanner />

        {/* Header */}
        <header className="bg-gradient-to-b from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white pt-12 pb-16 px-6">
          <h1 className="text-3xl mb-2">Profile</h1>
          <p className="text-blue-100 text-sm">Manage your Bible reading experience</p>
        </header>

        <main className="max-w-2xl mx-auto px-6 -mt-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700"
                >
                  <Icon className={`w-8 h-8 mb-3 ${stat.color}`} />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Reading Progress */}
          {readingProgress && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Current Reading</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {readingProgress.book} {readingProgress.chapter}:{readingProgress.verse}
              </p>
              <button
                onClick={() => navigate('/read')}
                className="mt-4 w-full bg-blue-600 dark:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Continue Reading
              </button>
            </div>
          )}

          {/* Settings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Settings</h2>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-gray-900 dark:text-white">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform m-0.5 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">About</h2>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">Bible App v1.0</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
                A modern, accessible Bible reading application designed for students and general users.
              </p>
            </div>

            <button className="w-full flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-gray-900 dark:text-white">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-gray-900 dark:text-white">Terms of Service</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
