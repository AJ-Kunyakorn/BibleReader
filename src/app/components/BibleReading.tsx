import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { getVerses } from "../data/bibleData";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Maximize2, 
  Minimize2,
  Highlighter,
  MessageSquare,
  BookOpen,
  X
} from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function BibleReading() {
  const navigate = useNavigate();
  const { 
    highlights, 
    notes,
    darkMode, 
    focusMode, 
    addHighlight, 
    removeHighlight,
    addNote,
    updateReadingProgress,
    toggleDarkMode, 
    toggleFocusMode 
  } = useBible();

  const [currentBook] = useState('John');
  const [currentChapter, setCurrentChapter] = useState(3);
  const [verses, setVerses] = useState(getVerses('John', 3));
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showBookSelector, setShowBookSelector] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const newVerses = getVerses(currentBook, currentChapter);
    setVerses(newVerses);
    if (newVerses.length > 0) {
      updateReadingProgress(currentBook, currentChapter, newVerses[0].verse);
    }
  }, [currentBook, currentChapter, updateReadingProgress]);

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < 21) { // John has 21 chapters
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        handleNextChapter();
      } else {
        handlePreviousChapter();
      }
    }
  };

  const handleVerseClick = (verseId: string) => {
    setSelectedVerse(verseId);
  };

  const handleHighlight = (verseId: string) => {
    if (highlights.has(verseId)) {
      removeHighlight(verseId);
    } else {
      addHighlight(verseId, 'yellow');
    }
    setSelectedVerse(null);
  };

  const handleAddNote = (verseId: string) => {
    setSelectedVerse(verseId);
    const existingNote = notes.find(n => n.verseId === verseId);
    setNoteText(existingNote?.text || '');
    setShowNoteDialog(true);
  };

  const handleSaveNote = () => {
    if (selectedVerse && noteText.trim()) {
      addNote(selectedVerse, noteText);
      setShowNoteDialog(false);
      setNoteText('');
      setSelectedVerse(null);
    }
  };

  const getVerseNote = (verseId: string) => {
    return notes.find(n => n.verseId === verseId);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen pb-20">
        <OfflineBanner />

        {/* Header - Hidden in Focus Mode */}
        {!focusMode && (
          <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                aria-label="Back to home"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setShowBookSelector(!showBookSelector)}
                className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>{currentBook} {currentChapter}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={toggleFocusMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle focus mode"
                >
                  <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="flex items-center justify-between px-4 pb-3">
              <button
                onClick={handlePreviousChapter}
                disabled={currentChapter === 1}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 disabled:text-gray-300 dark:disabled:text-gray-700 disabled:cursor-not-allowed py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Chapter {currentChapter - 1}</span>
              </button>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Swipe to navigate
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapter === 21}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 disabled:text-gray-300 dark:disabled:text-gray-700 disabled:cursor-not-allowed py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:hover:bg-transparent"
              >
                <span className="text-sm">Chapter {currentChapter + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </header>
        )}

        {/* Focus Mode Exit Button */}
        {focusMode && (
          <button
            onClick={toggleFocusMode}
            className="fixed top-4 right-4 z-50 bg-gray-900/80 dark:bg-gray-100/80 text-white dark:text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
            aria-label="Exit focus mode"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

        {/* Bible Text */}
        <main
          className="max-w-2xl mx-auto px-6 py-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="space-y-4">
            {verses.map((verse) => {
              const isHighlighted = highlights.has(verse.id);
              const verseNote = getVerseNote(verse.id);
              const isSelected = selectedVerse === verse.id;

              return (
                <div
                  key={verse.id}
                  onClick={() => handleVerseClick(verse.id)}
                  className={`
                    relative group cursor-pointer transition-all duration-200
                    ${isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                    ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                    ${!focusMode ? 'p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900' : 'py-2'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 min-w-[2rem] pt-1">
                      {verse.verse}
                    </span>
                    <p className="flex-1 text-gray-900 dark:text-gray-100 leading-relaxed text-lg">
                      {verse.text}
                    </p>
                  </div>

                  {verseNote && !focusMode && (
                    <div className="mt-2 ml-11 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-3 rounded">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{verseNote.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - Hidden in Focus Mode */}
                  {isSelected && !focusMode && (
                    <div className="mt-3 ml-11 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHighlight(verse.id);
                        }}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${isHighlighted 
                            ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }
                        `}
                      >
                        <Highlighter className="w-4 h-4" />
                        {isHighlighted ? 'Remove' : 'Highlight'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddNote(verse.id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {verseNote ? 'Edit Note' : 'Add Note'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* Note Dialog */}
        {showNoteDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Note</h2>
                <button
                  onClick={() => {
                    setShowNoteDialog(false);
                    setNoteText('');
                    setSelectedVerse(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your note here..."
                  className="w-full h-32 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-3 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  autoFocus
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                    className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteDialog(false);
                      setNoteText('');
                      setSelectedVerse(null);
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!focusMode && <BottomNav />}
    </div>
  );
}
