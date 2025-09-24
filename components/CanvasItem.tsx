import React, { useState, useRef, useEffect } from 'react';
import { CanvasItem, EnrichedPaper, WebSearchResult } from '../types';
import PaperCard from './PaperCard';
import WebResultCard from './WebResultCard';

interface CanvasItemProps {
  item: CanvasItem;
  onMove: (itemId: string, newPosition: { x: number; y: number }) => void;
  onRemove: (itemId: string) => void;
}

const TextCard: React.FC<{ content: { text: string } }> = ({ content }) => (
    <div className="bg-yellow-100 p-4 rounded-lg shadow-md border-l-4 border-yellow-400">
        <p className="text-slate-800 whitespace-pre-wrap">{content.text}</p>
    </div>
);

const CanvasItemComponent: React.FC<CanvasItemProps> = ({ item, onMove, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    const parentRect = dragRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;
    
    let newX = e.clientX - parentRect.left - offset.current.x;
    let newY = e.clientY - parentRect.top - offset.current.y;
    
    // Constrain within parent bounds
    newX = Math.max(0, Math.min(newX, parentRect.width - dragRef.current.offsetWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - dragRef.current.offsetHeight));

    dragRef.current.style.left = `${newX}px`;
    dragRef.current.style.top = `${newY}px`;
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    setIsDragging(false);
    const newX = parseFloat(dragRef.current.style.left);
    const newY = parseFloat(dragRef.current.style.top);
    onMove(item.id, { x: newX, y: newY });
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Fix: Removed unnecessary type assertions now that CanvasItem is a discriminated union.
  const renderContent = () => {
    switch (item.type) {
      case 'paper':
        return <PaperCard paper={item.content} isDraggable={true} />;
      case 'web':
        return <WebResultCard result={item.content} isDraggable={true} />;
      case 'text':
        return <TextCard content={item.content} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={dragRef}
      className="absolute p-2 rounded-lg bg-white/50 backdrop-blur-sm shadow-2xl"
      style={{ left: `${item.position.x}px`, top: `${item.position.y}px`, width: `${item.size.width}px` }}
    >
        <div 
            onMouseDown={handleMouseDown}
            className="cursor-move p-2 bg-slate-200 rounded-t-md flex justify-between items-center"
        >
            <span className="font-bold text-slate-600 text-sm capitalize">{item.type} Note</span>
            <button 
                onClick={() => onRemove(item.id)}
                className="text-slate-400 hover:text-red-500"
                aria-label="Remove item"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-1">
             {renderContent()}
        </div>
    </div>
  );
};

export default CanvasItemComponent;