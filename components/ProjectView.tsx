import React, { useState, useCallback } from 'react';
// Fix: Removed unused CanvasItemType import.
import { Project, CanvasItem, EnrichedPaper, WebSearchResult } from '../types';
import CanvasItemComponent from './CanvasItem';
import ChatPanel from './ChatPanel';

interface ProjectViewProps {
  projectId: string;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectView: React.FC<ProjectViewProps> = ({ projectId, projects, setProjects }) => {
  const project = projects.find(p => p.id === projectId);
  const [noteInput, setNoteInput] = useState('');

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prevProjects =>
      prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p))
    );
  }, [setProjects]);

  const updateItem = (itemId: string, newPosition: { x: number; y: number }) => {
    if (!project) return;
    const updatedItems = project.items.map(item =>
      item.id === itemId ? { ...item, position: newPosition } : item
    );
    updateProject({ ...project, items: updatedItems });
  };

  const removeItem = (itemId: string) => {
    if (!project) return;
    if (window.confirm('Are you sure you want to remove this item from the whiteboard?')) {
        const updatedItems = project.items.filter(item => item.id !== itemId);
        updateProject({ ...project, items: updatedItems });
    }
  };

  const addNote = () => {
    if (!project || !noteInput.trim()) return;
    const newNote: CanvasItem = {
      id: `note_${Date.now()}`,
      type: 'text',
      content: { text: noteInput.trim() },
      position: { x: 50, y: 50 },
      size: { width: 250, height: 'auto' },
    };
    const updatedItems = [...project.items, newNote];
    updateProject({ ...project, items: updatedItems });
    setNoteInput('');
  };

  if (!project) {
    return <div className="p-8 text-center text-red-500">Project not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-68px)] overflow-hidden">
        <div className="flex-grow relative bg-slate-200 overflow-auto" id="canvas">
             <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-sm">
                <h2 className="text-xl font-bold text-slate-800 truncate">{project.name}</h2>
                <div className="flex gap-2 mt-3">
                    <input
                        type="text"
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        placeholder="Add a quick note..."
                        className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-1.5 text-sm"
                    />
                    <button onClick={addNote} className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 transition-colors">Add</button>
                </div>
            </div>

            {project.items.map(item => (
            <CanvasItemComponent key={item.id} item={item} onMove={updateItem} onRemove={removeItem} />
            ))}
        </div>
        <ChatPanel project={project} />
    </div>
  );
};

export default ProjectView;