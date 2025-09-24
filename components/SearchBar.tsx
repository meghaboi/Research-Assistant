import React, { useState } from 'react';

type SearchType = 'academic' | 'web';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('academic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, searchType);
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="flex gap-2 shadow-lg rounded-full bg-white p-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchType === 'academic' ? "e.g., 'machine learning in healthcare'" : "e.g., 'latest advancements in AI'"}
                className="w-full bg-transparent px-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                    </>
                ) : (
                'Search'
                )}
            </button>
        </form>
         <div className="flex justify-center mt-4">
            <div className="flex items-center bg-slate-200 rounded-full p-1 text-sm font-semibold">
                <button 
                    onClick={() => setSearchType('academic')}
                    className={`px-4 py-1 rounded-full ${searchType === 'academic' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500'}`}
                >
                    Academic
                </button>
                <button 
                    onClick={() => setSearchType('web')}
                    className={`px-4 py-1 rounded-full ${searchType === 'web' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500'}`}
                >
                    Web
                </button>
            </div>
        </div>
    </div>
  );
};

export default SearchBar;
