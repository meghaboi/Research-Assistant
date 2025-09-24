import React from 'react';

interface HeaderProps {
  setView: (view: 'home' | 'search') => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, onHomeClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onHomeClick}
          role="button"
          aria-label="Home"
        >
          AI Research Assistant
        </div>
        <nav className="flex items-center gap-4">
          <button 
            onClick={onHomeClick}
            className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Projects
          </button>
          <button 
            onClick={() => setView('search')}
            className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Search
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
