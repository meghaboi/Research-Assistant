
export type ContentStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string | null;
  authors: { authorId: string | null; name: string }[];
  year: number | null;
  venue: string | null;
  url: string;
}

export interface EnrichedPaper extends SemanticScholarPaper {
  summary: string;
  citation: string;
  contentStatus?: ContentStatus;
  textContent?: string;
}

export interface WebSearchResult {
  title: string;
  link: string;
  snippet: string;
  contentStatus?: ContentStatus;
  textContent?: string;
}

// Fix: Refactored CanvasItem to a discriminated union for better type safety.
interface CanvasItemBase {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: 'auto' | number };
}

export interface PaperCanvasItem extends CanvasItemBase {
  type: 'paper';
  content: EnrichedPaper;
}

export interface WebCanvasItem extends CanvasItemBase {
  type: 'web';
  content: WebSearchResult;
}

export interface TextCanvasItem extends CanvasItemBase {
  type: 'text';
  content: { text: string };
}

export type CanvasItem = PaperCanvasItem | WebCanvasItem | TextCanvasItem;


export interface Project {
  id: string;
  name: string;
  createdAt: string;
  items: CanvasItem[];
}