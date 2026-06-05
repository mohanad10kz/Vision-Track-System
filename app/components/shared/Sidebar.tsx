import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare,
  Archive,
  StickyNote,
  Users, 
  CalendarDays,
  Phone,
  Settings,
  HardHat,
  BarChart3
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  indent?: boolean;
  end?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'لوحة التحكم',    path: '/',              end: true },
  { icon: CheckSquare,     label: 'المهام',           path: '/tasks',         end: true },
  { icon: Archive,         label: 'أرشيف المهام',     path: '/tasks/archive', indent: true },
  { icon: StickyNote,      label: 'الملاحظات',        path: '/notes',         end: true },
  { icon: Archive,         label: 'أرشيف الملاحظات',  path: '/notes/archive', indent: true },
  { icon: CalendarDays,    label: 'الزيارات',         path: '/visits',        end: true },
  { icon: Archive,         label: 'أرشيف الزيارات',   path: '/visits/archive',indent: true },
  { icon: Users,           label: 'العملاء',           path: '/clients'        },
  { icon: HardHat,         label: 'الفنيون',           path: '/technicians'    },
  { icon: BarChart3,       label: 'التقارير',          path: '/reports'        },
  { icon: Phone,           label: 'سجل الاتصالات',    path: '/calls'          },
];

export const Sidebar = () => {
  return (
    <aside className="w-[240px] bg-[var(--color-sidebar-bg)] border-l border-[var(--color-sidebar-border)] flex flex-col h-full fixed right-0 top-0 z-30">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--color-sidebar-border)]">
        <h1 className="text-xl font-bold text-[var(--color-brand)] flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-brand)]/10 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-[var(--color-brand)] rounded-sm rotate-45" />
          </div>
          VisionTrack
        </h1>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono uppercase tracking-wider">
          Industrial Precision
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                item.indent ? 'mr-4 py-2 px-3 text-xs' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-r-2 border-[var(--color-brand)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            <item.icon className={item.indent ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'} size={item.indent ? 14 : 18} />
            <span className={item.indent ? 'opacity-80' : ''}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-[var(--color-sidebar-border)]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)] border-r-2 border-[var(--color-brand)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
            }`
          }
        >
          <Settings size={18} />
          الإعدادات
        </NavLink>
      </div>
    </aside>
  );
};
