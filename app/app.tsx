import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/shared/Sidebar';
import { Tasks } from './pages/Tasks';
import { Notes } from './pages/Notes';
import { TaskArchive } from './pages/TaskArchive';
import { NoteArchive } from './pages/NoteArchive';
import { Visits } from './pages/Visits';
import { Clients } from './pages/Clients';
import { Technicians } from './pages/Technicians';
import { CallLog } from './pages/CallLog';
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
            <Route path="/" element={<DashboardPlaceholder />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/archive" element={<TaskArchive />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/archive" element={<NoteArchive />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/calls" element={<CallLog />} />
            <Route path="/settings" element={<Placeholder title="الإعدادات" />} />
          </Routes>
        </main>
        
        <Toaster position="bottom-right" richColors />
      </div>
    </HashRouter>
  );
}

const DashboardPlaceholder = () => (
  <div className="h-full flex flex-col items-center justify-center gap-4">
    <div className="text-6xl opacity-20">📊</div>
    <h1 className="text-2xl font-bold text-[var(--color-text-muted)]">لوحة التحكم</h1>
    <p className="text-[var(--color-text-muted)] text-sm">قيد التطوير — المرحلة الثالثة</p>
  </div>
);

const Placeholder = ({ title }: { title: string }) => (
  <div className="h-full flex items-center justify-center">
    <h1 className="text-3xl text-[var(--color-text-muted)]">{title} (قيد التطوير)</h1>
  </div>
);
