import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Highlight {
  verseId: string;
  color: string;
  timestamp: number;
}

export interface Note {
  id: string;
  verseId: string;
  text: string;
  timestamp: number;
}

interface ReadingProgress {
  book: string;
  chapter: number;
  verse: number;
  timestamp: number;
}

interface BibleContextType {
  highlights: Map<string, Highlight>;
  notes: Note[];
  readingProgress: ReadingProgress | null;
  darkMode: boolean;
  focusMode: boolean;
  addHighlight: (verseId: string, color: string) => void;
  removeHighlight: (verseId: string) => void;
  addNote: (verseId: string, text: string) => void;
  updateNote: (noteId: string, text: string) => void;
  deleteNote: (noteId: string) => void;
  updateReadingProgress: (book: string, chapter: number, verse: number) => void;
  toggleDarkMode: () => void;
  toggleFocusMode: () => void;
  isOnline: boolean;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  const [highlights, setHighlights] = useState<Map<string, Highlight>>(new Map());
  const [notes, setNotes] = useState<Note[]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load highlights
      const savedHighlights = localStorage.getItem('bible_highlights');
      if (savedHighlights) {
        const parsed = JSON.parse(savedHighlights) as Record<string, Highlight>;
        setHighlights(new Map(Object.entries(parsed)));
      }

      // Load notes
      const savedNotes = localStorage.getItem('bible_notes');
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch {
          setNotes([]);
        }
      }

      // Load reading progress
      const savedProgress = localStorage.getItem('reading_progress');
      if (savedProgress) {
        setReadingProgress(JSON.parse(savedProgress));
      }

      // Load dark mode preference
      const savedDarkMode = localStorage.getItem('dark_mode');
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addHighlight = (verseId: string, color: string) => {
    const newHighlights = new Map(highlights);
    const newHighlight: Highlight = { verseId, color, timestamp: Date.now() };
newHighlights.set(verseId, newHighlight);
    setHighlights(newHighlights);
    localStorage.setItem('bible_highlights', JSON.stringify(Object.fromEntries(newHighlights)));
  };

  const removeHighlight = (verseId: string) => {
    const newHighlights = new Map(highlights);
    newHighlights.delete(verseId);
    setHighlights(newHighlights);
    localStorage.setItem('bible_highlights', JSON.stringify(Object.fromEntries(newHighlights)));
  };

  const addNote = (verseId: string, text: string) => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      verseId,
      text,
      timestamp: Date.now(),
    };
  
    setNotes(prev => {
      const updated = [...prev, newNote];
      localStorage.setItem('bible_notes', JSON.stringify(updated));
      return updated;
    });
  };

  const updateNote = (noteId: string, text: string) => {
    setNotes(prev => {
      const updated = prev.map(note =>
        note.id === noteId
          ? { ...note, text, timestamp: Date.now() }
          : note
      );
      localStorage.setItem('bible_notes', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => {
      const updated = prev.filter(note => note.id !== noteId);
      localStorage.setItem('bible_notes', JSON.stringify(updated));
      return updated;
    });
  };

  const updateReadingProgress = useCallback((book: string, chapter: number, verse: number) => {
    const progress = { book, chapter, verse, timestamp: Date.now() };
    setReadingProgress(progress);
    localStorage.setItem('reading_progress', JSON.stringify(progress));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      localStorage.setItem('dark_mode', JSON.stringify(newDarkMode));
      return newDarkMode;
    });
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
  }, []);

  return (
    <BibleContext.Provider
      value={{
        highlights,
        notes,
        readingProgress,
        darkMode,
        focusMode,
        addHighlight,
        removeHighlight,
        addNote,
        updateNote,
        deleteNote,
        updateReadingProgress,
        toggleDarkMode,
        toggleFocusMode,
        isOnline,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}