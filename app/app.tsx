import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/shared/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Notes } from './pages/Notes';
import { TaskArchive } from './pages/TaskArchive';
import { NoteArchive } from './pages/NoteArchive';
import { Visits } from './pages/Visits';
import { Clients } from './pages/Clients';
import { Technicians } from './pages/Technicians';
import { CallLog } from './pages/CallLog';
import { Settings } from './pages/Settings';
import { Toaster } from './components/ui/sonner';
import './styles/app.css';

export default function App() {
  return (
    <HashRouter>
      <div className="flex h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        {/* Sidebar — fixed right, 240px wide */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/archive" element={<TaskArchive />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/archive" element={<NoteArchive />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/calls" element={<CallLog />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        <Toaster position="bottom-right" richColors />
      </div>
    </HashRouter>
  );
}

