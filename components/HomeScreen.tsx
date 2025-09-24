import React, { useState } from 'react';
import { Project } from '../types';

interface HomeScreenProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onOpenProject: (projectId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ projects, setProjects, onOpenProject }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');

  const handleCreateProject = () => {
    if (projects.length >= 5) {
      setError('You can create a maximum of 5 projects.');
      return;
    }
    if (!newProjectName.trim()) {
      setError('Project name cannot be empty.');
      return;
    }
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: newProjectName.trim(),
      createdAt: new Date().toISOString(),
      items: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setNewProjectName('');
    setError('');
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project and all its content?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-slate-700">Your Projects</h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="font-bold text-lg text-slate-800 mb-3">Create New Project</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full bg-slate-100 border border-slate-300 rounded-md px-4 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={50}
            />
            <button
              onClick={handleCreateProject}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:bg-indigo-300"
              disabled={projects.length >= 5 || !newProjectName.trim()}
            >
              Create
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
              <div>
                <h4 className="text-xl font-bold text-indigo-700 truncate mb-2">{project.name}</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </p>
                 <p className="text-sm text-slate-600 mb-4">
                  {project.items.length} item{project.items.length !== 1 ? 's' : ''} on whiteboard.
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onOpenProject(project.id)}
                  className="w-full py-2 px-4 bg-indigo-100 text-indigo-700 font-semibold rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-md transition-colors"
                  aria-label="Delete project"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
         {projects.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
              <p className="text-2xl">No projects yet.</p>
              <p>Create your first project to begin organizing your research.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default HomeScreen;
