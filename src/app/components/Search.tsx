import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { john3Verses, bibleBooks } from "../data/bibleData";
import { Search as SearchIcon, X, Book, TrendingUp } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function Search() {
  const navigate = useNavigate();
  const { darkMode } = useBible();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof john3Verses>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Popular searches
  const popularSearches = [
    'Love',
    'Faith',
    'Hope',
    'God so loved',
    'Jesus',
  ];

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay (in real app, this would be an API call)
    const timer = setTimeout(() => {
      const results = john3Verses.filter(verse =>
        verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.book.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <OfflineBanner />

        {/* Search Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verses, books..."
                className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-6">
          {!searchQuery && (
            <>
              {/* Popular Searches */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((query) => (
                    <button
                      key={query}
                      onClick={() => handlePopularSearch(query)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </section>

              {/* Browse Books */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Book className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Browse Books</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {bibleBooks.slice(0, 8).map((book) => (
                    <button
                      key={book.id}
                      onClick={() => navigate('/read')}
                      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{book.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{book.chapters} chapters</p>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div>
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-4">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </p>
                  <div className="space-y-3">
                    {searchResults.map((verse) => (
                      <div
                        key={verse.id}
                        onClick={() => navigate('/read')}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                      >
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                          {verse.book} {verse.chapter}:{verse.verse}
                        </p>
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                          {verse.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try searching for different keywords
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
