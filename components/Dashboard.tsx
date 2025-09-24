import React, { useState, useCallback } from 'react';
import { searchPapers } from '../services/semanticScholar';
import { summarizeAbstract, searchWeb } from '../services/geminiService';
// Fix: Import SemanticScholarPaper to use as a correct type for formatCitation
import { EnrichedPaper, WebSearchResult, Project, SemanticScholarPaper } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Header from './Header';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import Spinner from './Spinner';
import HomeScreen from './HomeScreen';
import ProjectView from './ProjectView';

// Fix: Changed parameter type to SemanticScholarPaper as the function is called with it before it's enriched.
const formatCitation = (paper: SemanticScholarPaper): string => {
    const authors = paper.authors.slice(0, 3).map(a => a.name.split(' ').pop()).join(', ');
    const etAl = paper.authors.length > 3 ? ' et al.' : '';
    const year = paper.year || 'n.d.';
    const title = paper.title || 'Untitled';
    const venue = paper.venue || 'No venue';
  
    return `${authors}${etAl} (${year}). ${title}. *${venue}*.`;
};

const Dashboard: React.FC = () => {
  const [view, setView] = useState<'home' | 'search' | 'project'>('home');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [academicResults, setAcademicResults] = useState<EnrichedPaper[]>([]);
  const [webResults, setWebResults] = useState<WebSearchResult[]>([]);
  const [webSearchSummary, setWebSearchSummary] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);

  const handleSearch = useCallback(async (query: string, type: 'academic' | 'web') => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setAcademicResults([]);
    setWebResults([]);
    setWebSearchSummary('');
    setHasSearched(true);
    setView('search');

    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }

    try {
      if (type === 'academic') {
        const papers = await searchPapers(query);
        if (papers.length === 0) {
          setIsLoading(false);
          return;
        }
        // Fix: Added explicit return type Promise<EnrichedPaper> to help TypeScript infer the correct type for the returned object.
        const enrichedPapersPromises = papers.map(async (paper): Promise<EnrichedPaper> => {
          const summary = await summarizeAbstract(paper.abstract || '');
          // Fix: Removed incorrect type cast
          const citation = formatCitation(paper);
          return { ...paper, summary, citation, contentStatus: 'idle', textContent: undefined };
        });
        const enrichedPapers = await Promise.all(enrichedPapersPromises);
        setAcademicResults(enrichedPapers);
      } else { // Web search
        const response = await searchWeb(query);
        setWebSearchSummary(response.summary);
        setWebResults(response.results.map(r => ({ title: r.title, link: r.uri, snippet: '', contentStatus: 'idle', textContent: undefined })));
      }
    } catch (err) {
      setError('Failed to fetch results. Please check your connection or try a different query.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchHistory, setSearchHistory]);

  const navigateToProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setView('project');
  };
  
  const navigateToHome = () => {
    setActiveProjectId(null);
    setView('home');
  }

  const renderContent = () => {
    switch (view) {
      case 'project':
        return <ProjectView projectId={activeProjectId!} projects={projects} setProjects={setProjects} />;
      case 'home':
        return <HomeScreen projects={projects} setProjects={setProjects} onOpenProject={navigateToProject} />;
      case 'search':
      default:
        return (
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold text-slate-700 mb-2">Search Academic Papers & Web</h2>
              <p className="text-slate-500 mb-6">Enter a topic to find research and get AI-powered summaries.</p>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
              {searchHistory.length > 0 && (
                <div className="mt-4 text-sm text-slate-500">
                  Recent: {searchHistory.map(h => (
                    <button key={h} onClick={() => handleSearch(h, 'academic')} className="underline hover:text-indigo-600 mr-2">{h}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-12">
              {isLoading && <Spinner />}
              {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}
              {!isLoading && !error && hasSearched && academicResults.length === 0 && webResults.length === 0 && (
                <div className="text-center text-slate-500"><p className="text-xl">No results found.</p></div>
              )}
              {!isLoading && !error && (academicResults.length > 0 || webResults.length > 0) && (
                <ResultsList 
                  academicPapers={academicResults} 
                  webResults={webResults} 
                  webSearchSummary={webSearchSummary}
                  projects={projects}
                  setProjects={setProjects}
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header setView={setView} onHomeClick={navigateToHome} />
      <main className="flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;