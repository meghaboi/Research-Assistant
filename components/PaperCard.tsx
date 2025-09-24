import React from 'react';
import { EnrichedPaper } from '../types';

interface PaperCardProps {
  paper: EnrichedPaper;
  isDraggable?: boolean;
}

const StatusIndicator: React.FC<{ status: EnrichedPaper['contentStatus'] }> = ({ status }) => {
  let text = 'Content status: Idle';
  let color = 'text-slate-500';
  let icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;;

  switch (status) {
    case 'loading':
      text = 'Loading content...';
      color = 'text-blue-500';
      icon = <path d="M12 2v4m0 12v4m8-10h-4M4 12H0m15.657-4.343l-2.829 2.829m-8.484 8.484l-2.829 2.829M4.343 4.343l2.829 2.829m8.484 8.484l2.829 2.829" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="animate-spin origin-center" />;
      break;
    case 'loaded':
      text = 'Content ready for chat';
      color = 'text-green-600';
      icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
      break;
    case 'error':
      text = 'Failed to load content';
      color = 'text-red-500';
      icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />;
      break;
  }

  return (
    <div className={`flex items-center gap-2 text-xs ${color}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
        </svg>
      <span>{text}</span>
    </div>
  );
};

const PaperCard: React.FC<PaperCardProps> = ({ paper, isDraggable = false }) => {
  const cardClasses = `bg-white p-6 rounded-lg border border-slate-200 ${
    isDraggable ? 'shadow-none' : 'shadow-md hover:shadow-xl transition-shadow duration-300'
  }`;

  return (
    <div className={cardClasses}>
      <h3 className="text-xl font-bold text-indigo-700 mb-2">
        <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {paper.title}
        </a>
      </h3>
      
      <div className="mb-4">
        <p className="text-slate-600 text-sm">
          {paper.authors.map(a => a.name).join(', ')}
        </p>
        <p className="text-slate-500 text-sm">{paper.venue} - {paper.year}</p>
      </div>

      <div className="mb-4 p-4 bg-slate-50 rounded-md border-l-4 border-indigo-500">
        <h4 className="font-semibold text-slate-800 mb-1">AI Summary</h4>
        <p className="text-slate-700 text-sm leading-relaxed">{paper.summary}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-slate-800 mb-1">Citation</h4>
        <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded-md font-mono text-xs">{paper.citation}</p>
      </div>

      {isDraggable && paper.contentStatus && (
         <div className="mt-4 pt-3 border-t border-slate-200">
            <StatusIndicator status={paper.contentStatus} />
        </div>
      )}
    </div>
  );
};

export default PaperCard;