export interface Book {
  id: string;
  name: string;
  chapters: number;
}

export const bibleBooks: Book[] = [
  { id: 'genesis', name: 'Genesis', chapters: 50 },
  { id: 'exodus', name: 'Exodus', chapters: 40 },
  { id: 'matthew', name: 'Matthew', chapters: 28 },
  { id: 'mark', name: 'Mark', chapters: 16 },
  { id: 'luke', name: 'Luke', chapters: 24 },
  { id: 'john', name: 'John', chapters: 21 },
  { id: 'acts', name: 'Acts', chapters: 28 },
  { id: 'romans', name: 'Romans', chapters: 16 },
];

export interface VerseData {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Sample Bible verses (John 3)
export const john3Verses: VerseData[] = [
  {
    id: 'john-3-1',
    book: 'John',
    chapter: 3,
    verse: 1,
    text: 'Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council.',
  },
  {
    id: 'john-3-2',
    book: 'John',
    chapter: 3,
    verse: 2,
    text: 'He came to Jesus at night and said, "Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him."',
  },
  {
    id: 'john-3-3',
    book: 'John',
    chapter: 3,
    verse: 3,
    text: 'Jesus replied, "Very truly I tell you, no one can see the kingdom of God unless they are born again."',
  },
  {
    id: 'john-3-16',
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  },
  {
    id: 'john-3-17',
    book: 'John',
    chapter: 3,
    verse: 17,
    text: 'For God did not send his Son into the world to condemn the world, but to save the world through him.',
  },
  {
    id: 'john-3-18',
    book: 'John',
    chapter: 3,
    verse: 18,
    text: 'Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God\'s one and only Son.',
  },
];

// Sample verses for other chapters (mock data)
export const john2Verses: VerseData[] = [
  {
    id: 'john-2-1',
    book: 'John',
    chapter: 2,
    verse: 1,
    text: 'On the third day a wedding took place at Cana in Galilee. Jesus\' mother was there.',
  },
  {
    id: 'john-2-2',
    book: 'John',
    chapter: 2,
    verse: 2,
    text: 'And Jesus and his disciples had also been invited to the wedding.',
  },
];

export const john4Verses: VerseData[] = [
  {
    id: 'john-4-1',
    book: 'John',
    chapter: 4,
    verse: 1,
    text: 'Now Jesus learned that the Pharisees had heard that he was gaining and baptizing more disciples than John.',
  },
  {
    id: 'john-4-2',
    book: 'John',
    chapter: 4,
    verse: 2,
    text: 'Although in fact it was not Jesus who baptized, but his disciples.',
  },
];

export function getVerses(book: string, chapter: number): VerseData[] {
  // Mock implementation - in real app, this would fetch from API or database
  if (book === 'John') {
    if (chapter === 2) return john2Verses;
    if (chapter === 3) return john3Verses;
    if (chapter === 4) return john4Verses;
  }
  return john3Verses; // Default
}

// Daily verses (rotating)
export const dailyVerses: VerseData[] = [
  {
    id: 'psalm-23-1',
    book: 'Psalm',
    chapter: 23,
    verse: 1,
    text: 'The Lord is my shepherd, I lack nothing.',
  },
  {
    id: 'proverbs-3-5',
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the Lord with all your heart and lean not on your own understanding.',
  },
  john3Verses[3], // John 3:16
];

export function getDailyVerse(): VerseData {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return dailyVerses[dayOfYear % dailyVerses.length];
}
