import { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { getVerses, bibleBooks, bibleMap } from "../data/bibleData";
import { ChevronLeft, ChevronRight, Sun, Moon, Maximize2, X, BookOpen } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";
import { saveLastReading, getLastReading } from "../data/reading";

export function BibleReading() {
  const navigate = useNavigate();
  const { bookId, chapter, verse } = useParams();
  const bible = useBible();

  if (!bible) {
    return <p className="text-center p-4">BibleProvider not found. Wrap App in <strong>BibleProvider</strong></p>;
  }

  const {
    highlights,
    notes,
    darkMode,
    focusMode,
    addHighlight,
    removeHighlight,
    addNote,
    updateNote,
    deleteNote,
    toggleDarkMode,
    toggleFocusMode,
  } = bible;

  const lastReading = useMemo(() => getLastReading(), []);
  const currentBook = (bookId ?? lastReading?.book ?? "gn").toLowerCase();
  const currentChapter = chapter ? Number(chapter) : lastReading?.chapter || 1;

  const bibleBookIndexMap = useMemo(() => new Map(bibleBooks.map((b, i) => [b.id, i])), []);
  const currentBookIndex = useMemo(() => bibleBookIndexMap.get(currentBook) ?? 0, [currentBook, bibleBookIndexMap]);
  const currentBookInfo = bibleMap.get(currentBook) ?? { name: "Unknown", chapters: 1 };
  const maxChapters = currentBookInfo.chapters.length;
  const verses = getVerses(currentBook, currentChapter) ?? [];

  const targetVerse = Number(verse);

  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  console.log("PARAM: ", {bookId, currentBook, chapter, maxChapters});

  const goTo = (bookId: string, chapterNum: number) => navigate(`/read/${bookId}/${chapterNum}`);

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      goTo(currentBook, currentChapter - 1);
    } else if (currentBookIndex > 0) {
      const prevBook = bibleBooks[currentBookIndex - 1];
      goTo(prevBook.id, prevBook.chapters);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < maxChapters) {
      goTo(currentBook, currentChapter + 1);
    } else if (currentBookIndex < bibleBooks.length - 1) {
      const nextBook = bibleBooks[currentBookIndex + 1];
      goTo(nextBook.id, 1);
    }
  };

  const handleBookChange = (bookId: string) => {
    goTo(bookId, 1);
    setShowBookSelector(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? handleNextChapter() : handlePreviousChapter();
  };

  useEffect(() => {
    saveLastReading({ book: currentBook, chapter: currentChapter });
  }, [currentBook, currentChapter]);

  useEffect(() => {
    if (!verse) return;
    const verseNum = Number(verse);
    setHighlightedVerse(verseNum);
    setSelectedVerse(`${currentBook}-${currentChapter}-${verseNum}`);
    const el = document.getElementById(`verse-${verse}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setHighlightedVerse(null), 2000);
    return () => clearTimeout(timer);
  }, [verse, currentBook, currentChapter]);

  const handleHighlight = (verseId: string, color = "yellow") => {
    const current = highlights.get(verseId);
    if (!current || current.color !== color) addHighlight(verseId, color);
    else removeHighlight(verseId);
    setSelectedVerse(null);
  };

  const handleAddNote = (verseId: string) => {
    setSelectedVerse(verseId);
    const existing = notes.find(n => n.verseId === verseId);
    setNoteText(existing?.text || "");
    setShowNoteDialog(true);
  };

  const getVerseNote = (verseId: string) => notes.find(n => n.verseId === verseId);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen pb-20">
        <OfflineBanner />

        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="bg-black/70 text-white p-2 rounded-full shadow-lg"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleFocusMode}
            className="bg-black/60 backdrop-blur text-white p-2 rounded-full shadow-lg hover:scale-105 transition"
          >
            {focusMode ? <X size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {!focusMode && (
          <header className="sticky top-0 bg-white dark:bg-gray-900 border-b z-40">
            <div className="relative flex items-center justify-between p-4">
              <button onClick={() => navigate("/")} className="z-10">
                <ChevronLeft />
              </button>
              <button onClick={() => setShowBookSelector(true)} className="flex items-center gap-1">
                <BookOpen />
                <span>
                  {currentBookInfo.name} {currentChapter}
                </span>
              </button>
              <div className="flex gap-2" />
            </div>

            <div className="px-4 pb-3">
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm">

                {/* Prev */}
                <button
                  onClick={handlePreviousChapter}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <ChevronLeft size={18} /> <span className="text-sm">Prev</span>
                </button>
                <button
                  onClick={() => setShowChapterSelector(true)}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-gray-800 dark:text-gray-100 font-semibold shadow hover:bg-blue-500/40 hover:scale-105 active:scale-95 transition"
                >
                  Chapter {currentChapter}
                </button>

                {/* Next */}
                <button
                  onClick={handleNextChapter}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <span className="text-sm">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
              {/* <div className="text-center text-xs text-gray-500 mt-1">
                Tap chapter to jump
              </div> */}
            </div>
          </header>
        )}

        <main
          className={`mx-auto transition-all duration-300 ${
            focusMode ? "px-4 py-2 w-full" : "max-w-2xl px-6 py-8"
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest(".verse-box")) setSelectedVerse(null);
          }}
        >
          {/* Note Dialog */}
          {showNoteDialog && selectedVerse && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-white dark:bg-gray-900 p-4 rounded-lg w-80"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="font-bold mb-2">
                  {getVerseNote(selectedVerse) ? "Edit Note" : "Add Note"}
                </h2>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full border p-2 rounded mb-3 dark:bg-gray-800"
                  rows={4}
                  placeholder="Write something to remind you..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowNoteDialog(false);
                      setSelectedVerse(null);
                      setNoteText("");
                    }}
                    className="px-3 py-1"
                  >
                    Cancel
                  </button>
                  {getVerseNote(selectedVerse) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const existing = getVerseNote(selectedVerse);
                        if (existing) deleteNote(existing.id);
                        setShowNoteDialog(false);
                        setSelectedVerse(null);
                        setNoteText("");
                      }}
                      className="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectedVerse) return;
                      if (noteText.trim()) {
                        const existing = getVerseNote(selectedVerse);
                        existing
                          ? updateNote(existing.id, noteText)
                          : addNote(selectedVerse, noteText);
                        setShowNoteDialog(false);
                        setNoteText("");
                        setSelectedVerse(null);
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verses */}
          {verses.length === 0 && (
            <p className="text-center text-gray-500">No data in this chapter.</p>
          )}
          {verses.map((v) => {
            const highlightColor = highlights.get(v.id)?.color;
            const note = getVerseNote(v.id);
            return (
              <div
                key={v.verse}
                id={`verse-${v.verse}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVerse(v.id);
                }}
                className={`verse-box p-4 rounded-xl mb-3 transition-all duration-200 cursor-pointer border
                     ${v.verse === highlightedVerse ? "bg-amber-200/10 dark:bg-amber-700 animate-pulse ring-2 ring-amber-400 scale-[1.03]" : ""}
                     ${highlightColor === "yellow" ? "bg-yellow-100 dark:bg-yellow-900 border-yellow-300"
                     : highlightColor === "green" ? "bg-green-100 dark:bg-green-900 border-green-300"
                     : highlightColor === "pink" ? "bg-pink-100 dark:bg-pink-900 border-pink-300" : ""}
                     ${selectedVerse === v.id ? "ring-2 ring-blue-400 scale-[1.02]" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                <span className="text-sm text-gray-500 mr-2">{v.verse}</span>
                <p className="inline">{v.text}</p>
                {note && (
                  <div className="mt-2 text-sm text-blue-500 flex justify-between items-start">
                    <span>{note.text}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {selectedVerse === v.id && (
                  <div className="flex gap-2 mt-3">
                    <div className="flex gap-2">
                      {["yellow", "green", "pink"].map((color) => (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHighlight(v.id, color);
                          }}
                          className={`w-6 h-6 rounded-full border transform transition-transform hover:scale-110 ${
                            color === "yellow"
                              ? "bg-yellow-400"
                              : color === "green"
                              ? "bg-green-400"
                              : "bg-pink-400"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNote(v.id);
                      }}
                      className="bg-blue-400 px-2 py-1 rounded text-sm text-white"
                    >
                      {note ? "Edit Note" : "Add Note"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </main>

        {/* Book Selector */}
        {showBookSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h2 className="font-bold text-lg">Choose Book</h2>
                <button onClick={() => setShowBookSelector(false)}>
                  <X />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bibleBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookChange(book.id)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        currentBook === book.id
                          ? "bg-blue-600 text-white shadow"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="font-semibold">{book.name}</div>
                      <div className="text-xs opacity-70">{book.chapters} chapters</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Selector */}
        {showChapterSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h2 className="font-bold text-lg">{currentBookInfo.name}</h2>
                <button onClick={() => setShowChapterSelector(false)}>
                  <X />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map((chap) => (
                    <button
                      key={chap}
                      onClick={() => {
                        goTo(currentBook, chap);
                        setShowChapterSelector(false);
                      }}
                      className={`p-3 rounded-xl text-center transition ${
                        chap === currentChapter
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {chap}
                    </button>
                  ))}
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