import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/shared/Sidebar';
import { Tasks } from './pages/Tasks';
import { Notes } from './pages/Notes';
import { Toaster } from './components/ui/sonner';
import './styles/app.css';

export default function App() {
  return (
    <HashRouter>
      <div className="flex h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        {/* Sidebar is fixed on the right */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden">
          <Routes>
            <Route path="/" element={
              <div className="h-full flex items-center justify-center pt-8 pr-[250px] pb-8">
                <h1 className="text-3xl text-text-muted">لوحة التحكم (قيد التطوير)</h1>
              </div>
            } />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />
            
            {/* Placeholders for other routes */}
            <Route path="/maintenance" element={<Placeholder title="الصيانة" />} />
            <Route path="/clients" element={<Placeholder title="العملاء" />} />
            <Route path="/visits" element={<Placeholder title="الزيارات" />} />
            <Route path="/technicians" element={<Placeholder title="الفنيون" />} />
            <Route path="/calls" element={<Placeholder title="سجل الاتصالات" />} />
            <Route path="/settings" element={<Placeholder title="الإعدادات" />} />
          </Routes>
        </main>
        
        <Toaster position="bottom-right" richColors />
      </div>
    </HashRouter>
  );
}

const Placeholder = ({ title }: { title: string }) => (
  <div className="h-full flex items-center justify-center pr-[250px]">
    <h1 className="text-3xl text-text-muted">{title} (قيد التطوير)</h1>
  </div>
);
