import bibleJson from './bible.json';

// Bible JSON structure
interface BibleBook {
  abbrev: string;
  author?: string;
  chapters: string[][];
  group?: string;
  name?: string;
  version?: string;
}

// Book name mapping from abbreviations to full names
const bookNameMap: Record<string, string> = {
  'gn': 'Genesis',
  'ex': 'Exodus',
  'lv': 'Leviticus',
  'nm': 'Numbers',
  'dt': 'Deuteronomy',
  'js': 'Joshua',
  'jg': 'Judges',
  'rt': 'Ruth',
  '1sm': '1 Samuel',
  '2sm': '2 Samuel',
  '1kg': '1 Kings',
  '2kg': '2 Kings',
  '1ch': '1 Chronicles',
  '2ch': '2 Chronicles',
  'ezr': 'Ezra',
  'ne': 'Nehemiah',
  'et': 'Esther',
  'jb': 'Job',
  'ps': 'Psalms',
  'pv': 'Proverbs',
  'ec': 'Ecclesiastes',
  'sng': 'Song of Solomon',
  'is': 'Isaiah',
  'jr': 'Jeremiah',
  'lm': 'Lamentations',
  'ezk': 'Ezekiel',
  'dn': 'Daniel',
  'ho': 'Hosea',
  'jl': 'Joel',
  'am': 'Amos',
  'ob': 'Obadiah',
  'jnh': 'Jonah',
  'mc': 'Micah',
  'na': 'Nahum',
  'hk': 'Habakkuk',
  'zp': 'Zephaniah',
  'hg': 'Haggai',
  'zc': 'Zechariah',
  'ml': 'Malachi',
  'mt': 'Matthew',
  'mk': 'Mark',
  'lk': 'Luke',
  'jn': 'John',
  'act': 'Acts',
  'rm': 'Romans',
  '1co': '1 Corinthians',
  '2co': '2 Corinthians',
  'gl': 'Galatians',
  'eph': 'Ephesians',
  'php': 'Philippians',
  'cl': 'Colossians',
  '1th': '1 Thessalonians',
  '2th': '2 Thessalonians',
  '1tm': '1 Timothy',
  '2tm': '2 Timothy',
  'tt': 'Titus',
  'phm': 'Philemon',
  'hb': 'Hebrews',
  'jm': 'James',
  '1pe': '1 Peter',
  '2pe': '2 Peter',
  '1jn': '1 John',
  '2jn': '2 John',
  '3jn': '3 John',
  'jude': 'Jude',
  'rv': 'Revelation',
};

// Cast the imported JSON to the proper type
const bibleData = bibleJson as BibleBook[];

export const bibleMap = new Map(
  bibleData.map(book => [book.abbrev.toLowerCase(), book])
);

export interface Book {
  id: string;
  name: string;
  chapters: number;
}

// Generate list of all books from the bible.json
export const bibleBooks: Book[] = bibleData.map((book) => ({
id: `${book.abbrev}`,
  name: book.name || bookNameMap[book.abbrev] || book.abbrev.toUpperCase(),
  chapters: book.chapters.length,
}));

export interface VerseData {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

// Find book by name (case-insensitive)


// Get verses for a specific book and chapter
export function getVerses(bookId: string, chapter: number): VerseData[] {
  const book = getBook(bookId);

  if (!book) return [];

  const chapterIndex = chapter - 1;
  if (chapterIndex < 0 || chapterIndex >= book.chapters.length) return [];

  const verses = book.chapters[chapterIndex];

  const displayBookName =
    book.name || bookNameMap[book.abbrev] || book.abbrev.toUpperCase();

  return verses.map((text, i) => ({
    id: `${book.abbrev}-${chapter}-${i + 1}`,
    bookId: book.abbrev,
    bookName: displayBookName,
    chapter,
    verse: i + 1,
    text,
  }));
}

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function getDailyVerse(): VerseData {
  const today = new Date();

  const seed =
    today.getFullYear() * 1000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const rand = seededRandom(seed);

  // random book
  const book = bibleData[Math.floor(rand * bibleData.length)];

  // random chapter
  const chapter =
    Math.floor(seededRandom(seed + 1) * book.chapters.length) + 1;

  const verses = book.chapters[chapter - 1];

  // random verse
  const verseIndex =
    Math.floor(seededRandom(seed + 2) * verses.length);

  const displayBookName =
    book.name || bookNameMap[book.abbrev] || book.abbrev.toUpperCase();

  return {
    id: book.abbrev,
    bookId: book.abbrev,
    bookName: displayBookName,
    chapter,
    verse: verseIndex + 1,
    text: verses[verseIndex],
  };
}

export function getBook(bookId: string) {
  return bibleMap.get(bookId.toLowerCase());
}

// Search through all Bible verses
export function searchVerses(query: string, limit: number = 50): VerseData[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results: VerseData[] = [];

  // Search through all books
  for (const book of bibleData) {
    const displayBookName = book.name || bookNameMap[book.abbrev] || book.abbrev.toUpperCase();
    
    // Check if searching for book name
    const bookNameMatch = displayBookName.toLowerCase().includes(searchTerm);
    
    // Search through chapters
    for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
      const chapter = book.chapters[chapterIndex];
      
      // Search through verses
      for (let verseIndex = 0; verseIndex < chapter.length; verseIndex++) {
        const verseText = chapter[verseIndex];
        
        // Check if verse text matches or book name matches
        if (verseText.toLowerCase().includes(searchTerm) || bookNameMatch) {
          results.push({
            id: `${book.abbrev}-${chapterIndex + 1}-${verseIndex + 1}`,
            bookId: book.abbrev,
            bookName: displayBookName,
            chapter: chapterIndex + 1,
            verse: verseIndex + 1,
            text: verseText,
          });
          
          // Stop if we've reached the limit
          if (results.length >= limit) {
            return results;
          }
        }
      }
    }
  }

  return results;
}

// Get a specific verse by ID (format: "abbrev-chapter-verse" e.g., "jn-3-16")
export function getVerseById(verseId: string): VerseData | null {
  try {
    const parts = verseId.split('-');
    if (parts.length < 3) return null;

    const verse = parseInt(parts[parts.length - 1]);
    const chapter = parseInt(parts[parts.length - 2]);
    const bookAbbrev = parts.slice(0, -2).join('-');

    const book = bibleMap.get(bookAbbrev.toLowerCase());

    if (!book || chapter < 1 || chapter > book.chapters.length) {
      return null;
    }

    const chapterVerses = book.chapters[chapter - 1];
    if (verse < 1 || verse > chapterVerses.length) {
      return null;
    }

    const displayBookName =
      book.name || bookNameMap[book.abbrev] || book.abbrev.toUpperCase();

    return {
      id: verseId,
      bookId: bookAbbrev,
      bookName: displayBookName,
      chapter,
      verse,
      text: chapterVerses[verse - 1],
    };
  } catch (error) {
    console.error('Error getting verse by ID:', error);
    return null;
  }
}

//get the first chapter of bible
export function getFirstChapter() {
  if (!bibleData.length) return null;

  const firstBook = bibleData[0];
  const displayBookName =
    firstBook.name ||
    bookNameMap[firstBook.abbrev] ||
    firstBook.abbrev.toUpperCase();

  return {
    bookId: firstBook.abbrev,
    chapter: 1,
  };
}