import React from 'react';
import { WebSearchResult } from '../types';

// Fix: Added missing props interface definition.
interface WebResultCardProps {
  result: WebSearchResult;
  isDraggable?: boolean;
}

const StatusIndicator: React.FC<{ status: WebSearchResult['contentStatus'] }> = ({ status }) => {
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

const WebResultCard: React.FC<WebResultCardProps> = ({ result, isDraggable = false }) => {
  const cardClasses = `bg-white p-4 rounded-lg border border-slate-200 ${
    isDraggable ? 'shadow-none' : 'shadow-md hover:shadow-xl transition-shadow duration-300'
  }`;

  return (
    <div className={cardClasses}>
      <h3 className="text-lg font-bold text-indigo-700 mb-1">
        <a href={result.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {result.title}
        </a>
      </h3>
      <p className="text-sm text-slate-500 truncate">{result.link}</p>
       {isDraggable && result.contentStatus && (
         <div className="mt-3 pt-3 border-t border-slate-200">
            <StatusIndicator status={result.contentStatus} />
        </div>
      )}
    </div>
  );
};

export default WebResultCard;