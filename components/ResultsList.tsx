import React, { useState } from 'react';
import { EnrichedPaper, WebSearchResult, Project, CanvasItem } from '../types';
import { fetchUrlContent } from '../services/contentFetcher';
import PaperCard from './PaperCard';
import WebResultCard from './WebResultCard';

interface ResultsListProps {
  academicPapers: EnrichedPaper[];
  webResults: WebSearchResult[];
  webSearchSummary: string;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ResultsList: React.FC<ResultsListProps> = ({ academicPapers, webResults, webSearchSummary, projects, setProjects }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleAddToProject = (project: Project, itemContent: EnrichedPaper | WebSearchResult, type: 'paper' | 'web') => {
    const newItemId = `${type}_${Date.now()}`;
    // Fix: Used type assertion to safely access properties on a union type.
    const urlToFetch = type === 'paper' ? (itemContent as EnrichedPaper).url : (itemContent as WebSearchResult).link;

    let newItem: CanvasItem;
    if (type === 'paper') {
      newItem = {
        id: newItemId,
        type: 'paper',
        content: { ...(itemContent as EnrichedPaper), contentStatus: 'loading' },
        position: { x: Math.random() * 200, y: Math.random() * 200 },
        size: { width: 400, height: 'auto' },
      };
    } else {
      newItem = {
        id: newItemId,
        type: 'web',
        content: { ...(itemContent as WebSearchResult), contentStatus: 'loading' },
        position: { x: Math.random() * 200, y: Math.random() * 200 },
        size: { width: 400, height: 'auto' },
      };
    }

    const updatedProjects = projects.map(p => {
      if (p.id === project.id) {
        return { ...p, items: [...p.items, newItem] };
      }
      return p;
    });

    setProjects(updatedProjects);
    setActiveDropdown(null);

    // Asynchronously fetch content
    if (urlToFetch) {
      (async () => {
        try {
          const textContent = await fetchUrlContent(urlToFetch);
          // FIX: The original `||` operator caused type inference issues with the spread operator on `item.content` which is a union type.
          // Splitting the check allows TypeScript to correctly narrow the type of `item.content` in each branch.
          setProjects(prev => prev.map(p => {
            if (p.id === project.id) {
              return {
                ...p,
                items: p.items.map(item => {
                  if (item.id !== newItemId) return item;
                  if (item.type === 'paper') {
                    return { ...item, content: { ...item.content, textContent, contentStatus: 'loaded' } };
                  }
                  if (item.type === 'web') {
                    return { ...item, content: { ...item.content, textContent, contentStatus: 'loaded' } };
                  }
                  return item;
                })
              };
            }
            return p;
          }));
        } catch (error) {
          console.error(`Failed to fetch content for ${urlToFetch}:`, error);
          // FIX: The original `||` operator caused type inference issues with the spread operator on `item.content` which is a union type.
          // Splitting the check allows TypeScript to correctly narrow the type of `item.content` in each branch.
          setProjects(prev => prev.map(p => {
            if (p.id === project.id) {
              return {
                ...p,
                items: p.items.map(item => {
                  if (item.id !== newItemId) return item;
                  if (item.type === 'paper') {
                    return { ...item, content: { ...item.content, contentStatus: 'error', textContent: 'Failed to load content.' } };
                  }
                  if (item.type === 'web') {
                    return { ...item, content: { ...item.content, contentStatus: 'error', textContent: 'Failed to load content.' } };
                  }
                  return item;
                })
              };
            }
            return p;
          }));
        }
      })();
    } else {
        // If no URL, immediately set status to error.
        // FIX: The original `||` operator caused type inference issues with the spread operator on `item.content` which is a union type.
        // Splitting the check allows TypeScript to correctly narrow the type of `item.content` in each branch.
        setProjects(prev => prev.map(p => {
            if (p.id === project.id) {
                return {
                    ...p,
                    items: p.items.map(item => {
                        if (item.id !== newItemId) return item;
                        if (item.type === 'paper') {
                            return { ...item, content: { ...item.content, contentStatus: 'error', textContent: 'No URL available to fetch.' } };
                        }
                        if (item.type === 'web') {
                            return { ...item, content: { ...item.content, contentStatus: 'error', textContent: 'No URL available to fetch.' } };
                        }
                        return item;
                    })
                };
            }
            return p;
        }));
    }
  };


  const renderDropdown = (item: EnrichedPaper | WebSearchResult, type: 'paper' | 'web') => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <div className="py-1">
        {projects.length > 0 ? projects.map(p => (
          <button
            key={p.id}
            onClick={() => handleAddToProject(p, item, type)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {p.name}
          </button>
        )) : (
          <div className="px-4 py-2 text-sm text-gray-500">No projects yet.</div>
        )}
      </div>
    </div>
  );
  
  const isAcademicSearch = academicPapers.length > 0;

  return (
    <div className="space-y-6">
      {!isAcademicSearch && webSearchSummary && (
        <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h3 className="font-bold text-indigo-800 mb-2">Web Search Summary</h3>
            <p className="text-indigo-900">{webSearchSummary}</p>
        </div>
      )}
      {isAcademicSearch ? 
        academicPapers.map((paper) => (
            <div key={paper.paperId} className="relative">
                <PaperCard paper={paper} />
                <button
                    onClick={() => setActiveDropdown(activeDropdown === paper.paperId ? null : paper.paperId)}
                    className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full p-2"
                    aria-label="Add to project"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                {activeDropdown === paper.paperId && renderDropdown(paper, 'paper')}
            </div>
        ))
        :
        webResults.map((result) => (
             <div key={result.link} className="relative">
                <WebResultCard result={result} />
                 <button
                    onClick={() => setActiveDropdown(activeDropdown === result.link ? null : result.link)}
                    className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full p-2"
                    aria-label="Add to project"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                {activeDropdown === result.link && renderDropdown(result, 'web')}
            </div>
        ))
      }
    </div>
  );
};

export default ResultsList;