import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  StickyNote, 
  Users, 
  Wrench, 
  CalendarDays,
  PhoneCall,
  Settings
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/' },
  { icon: CheckSquare, label: 'المهام', path: '/tasks' },
  { icon: StickyNote, label: 'الملاحظات', path: '/notes' },
  { icon: Users, label: 'العملاء', path: '/clients' },
  { icon: Wrench, label: 'الصيانة', path: '/maintenance' },
  { icon: CalendarDays, label: 'الزيارات', path: '/visits' },
  { icon: Users, label: 'الفنيون', path: '/technicians' }, // Reusing Users icon for now
  { icon: PhoneCall, label: 'سجل الاتصالات', path: '/calls' },
];

export const Sidebar = () => {
  return (
    <aside className="w-[250px] bg-[var(--color-sidebar-bg)] border-l border-[var(--color-sidebar-border)] flex flex-col h-full fixed right-0 top-0">
      <div className="p-6 border-b border-[var(--color-sidebar-border)]">
        <h1 className="text-xl font-bold text-brand flex items-center gap-2">
          <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-brand rounded-sm rotate-45"></div>
          </div>
          VisionTrack
        </h1>
        <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-wider">Industrial Precision</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[var(--color-sidebar-active)] text-brand border-r-2 border-brand'
                  : 'text-text-secondary hover:bg-[var(--color-bg-hover)] hover:text-text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--color-sidebar-border)]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[var(--color-sidebar-active)] text-brand border-r-2 border-brand'
                : 'text-text-secondary hover:bg-[var(--color-bg-hover)] hover:text-text-primary'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          الإعدادات
        </NavLink>
      </div>
    </aside>
  );
};
