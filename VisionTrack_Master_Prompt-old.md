# VisionTrack — Master Build Prompt
> نظام إدارة متكامل لوكيل كاميرات المراقبة | Electron + React + TypeScript

---

## 🎯 نظرة عامة على المشروع

أنت تبني تطبيق Desktop يسمى **VisionTrack** باستخدام القالب الجاهز `electron-react-app` من `guasam/electron-react-app`.

هذا النظام مخصص لـ **وكيل بيع وصيانة كاميرات المراقبة** يعمل كوسيط بين الشركة الأم (في مدينة أخرى) وعملاء المنطقة. النظام يُشغَّل محلياً على جهاز المحل بدون إنترنت، والبيانات تُحفظ في SQLite.

---

## 🛠 التقنيات المستخدمة

| التقنية | الإصدار | الغرض |
|---|---|---|
| Electron | v40+ | Desktop shell |
| React | v19 | واجهة المستخدم |
| TypeScript | v5.9+ | Type safety |
| TailwindCSS | v4 | التنسيق |
| Shadcn/UI | latest | مكونات UI جاهزة |
| better-sqlite3 | latest | قاعدة البيانات المحلية |
| @dnd-kit/core + @dnd-kit/sortable | latest | Drag & Drop |
| zustand | latest | إدارة الحالة |
| recharts | latest | الرسوم البيانية |
| react-router-dom | v6 | التنقل بين الصفحات |
| date-fns | latest | معالجة التواريخ |
| xlsx | latest | تصدير Excel |
| framer-motion | موجود في القالب | الحركات والانتقالات |
| zod | موجود مع Conveyor | التحقق من البيانات |

---

## 🎨 هوية التصميم البصري (Design Identity)

### الاتجاه الجمالي
**Industrial Precision** — تصميم احترافي صارم يعكس بيئة العمل التقنية. ليس باردًا ومعقدًا، بل واضح وموثوق وسريع الاستخدام.

### نظام الألوان
```css
:root {
  /* Primary Brand */
  --color-brand: #0EA5E9;          /* Sky Blue — اللون الرئيسي */
  --color-brand-dark: #0284C7;
  --color-brand-light: #E0F2FE;

  /* Backgrounds (Dark Mode أساسي) */
  --color-bg-base: #0D1117;        /* خلفية رئيسية داكنة جداً */
  --color-bg-surface: #161B22;     /* سطح البطاقات */
  --color-bg-elevated: #21262D;    /* عناصر مرتفعة */
  --color-bg-hover: #30363D;       /* hover states */

  /* Sidebar */
  --color-sidebar-bg: #0D1117;
  --color-sidebar-active: #1C2128;
  --color-sidebar-border: #21262D;

  /* Text */
  --color-text-primary: #E6EDF3;   /* نص رئيسي */
  --color-text-secondary: #8B949E; /* نص ثانوي */
  --color-text-muted: #484F58;     /* نص خافت */

  /* Status Colors */
  --color-pending: #F59E0B;        /* برتقالي — معلق */
  --color-inprogress: #3B82F6;     /* أزرق — جارٍ */
  --color-done: #10B981;           /* أخضر — مكتمل */
  --color-urgent: #EF4444;         /* أحمر — عاجل */

  /* Borders */
  --color-border: #30363D;
  --color-border-subtle: #21262D;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
}
```

### الخطوط
```css
/* في index.css — استورد من Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* العربية تستخدم IBM Plex Sans Arabic */
/* الأرقام والكود تستخدم JetBrains Mono */

body {
  font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
  direction: rtl; /* النظام بالكامل RTL */
}
```

### قواعد التصميم العامة
- **RTL بالكامل**: كل الواجهة من اليمين لليسار
- **Dark Mode افتراضي**: الوضع الداكن هو الأساس
- **Sidebar ثابت** على اليمين بعرض 220px
- **Micro-animations**: استخدم framer-motion لكل تحول بين الصفحات
- **No shadows**: استخدم borders بدلاً من shadows في Dark theme
- **Consistent spacing**: 8px grid system (8, 16, 24, 32, 48)

---

## 📁 هيكل الملفات الكامل

```
electron-react-app/          ← المجلد الجذري (القالب الجاهز)
│
├── app/                     ← React Renderer Process (واجهة المستخدم)
│   ├── assets/
│   │   ├── logo.svg
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── ui/              ← Shadcn components (لا تعدّل عليها)
│   │   ├── window/          ← Titlebar و Menus (من القالب)
│   │   │
│   │   └── shared/          ← مكوناتك المشتركة (أنشئها)
│   │       ├── Sidebar.tsx
│   │       ├── PageHeader.tsx
│   │       ├── KanbanBoard.tsx
│   │       ├── KanbanColumn.tsx
│   │       ├── KanbanCard.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── PriorityBadge.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── SearchInput.tsx
│   │       ├── DataTable.tsx
│   │       └── FormModal.tsx
│   │
│   ├── pages/               ← صفحة لكل قسم (أنشئها)
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── Notes.tsx
│   │   ├── Maintenance.tsx
│   │   ├── Clients.tsx
│   │   ├── Visits.tsx
│   │   ├── Technicians.tsx
│   │   ├── CallLog.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/               ← Custom React Hooks
│   │   ├── use-conveyor.ts  ← موجود في القالب
│   │   ├── use-tasks.ts
│   │   ├── use-notes.ts
│   │   ├── use-maintenance.ts
│   │   ├── use-clients.ts
│   │   ├── use-visits.ts
│   │   ├── use-technicians.ts
│   │   └── use-calls.ts
│   │
│   ├── store/               ← Zustand Global State
│   │   ├── app.store.ts     ← الصفحة الحالية + إعدادات عامة
│   │   └── ui.store.ts      ← حالة UI (modals, filters, search)
│   │
│   ├── types/               ← TypeScript Interfaces
│   │   ├── task.types.ts
│   │   ├── note.types.ts
│   │   ├── maintenance.types.ts
│   │   ├── client.types.ts
│   │   ├── visit.types.ts
│   │   ├── technician.types.ts
│   │   ├── call.types.ts
│   │   └── index.ts         ← re-export الكل
│   │
│   ├── lib/
│   │   └── utils.ts         ← helper functions
│   │
│   ├── App.tsx              ← Layout الرئيسي + Router
│   ├── main.tsx
│   └── index.css
│
├── lib/                     ← Electron Main Process
│   ├── conveyor/            ← IPC System (من القالب)
│   │   ├── schemas/
│   │   │   ├── app-schema.ts      ← موجود
│   │   │   ├── db-schema.ts       ← أنشئه (schemas لكل الجداول)
│   │   │   └── window-schema.ts   ← موجود
│   │   ├── api/
│   │   │   ├── app-api.ts         ← موجود
│   │   │   ├── db-api.ts          ← أنشئه (API methods للـ DB)
│   │   │   └── window-api.ts      ← موجود
│   │   └── handlers/
│   │       ├── app-handler.ts     ← موجود
│   │       ├── db-handler.ts      ← أنشئه (DB operations)
│   │       └── window-handler.ts  ← موجود
│   │
│   ├── database/            ← SQLite Layer (أنشئه بالكامل)
│   │   ├── db.ts            ← تهيئة الاتصال + مسار الملف
│   │   ├── migrations.ts    ← إنشاء الجداول
│   │   └── repositories/
│   │       ├── tasks.repo.ts
│   │       ├── notes.repo.ts
│   │       ├── maintenance.repo.ts
│   │       ├── clients.repo.ts
│   │       ├── visits.repo.ts
│   │       ├── technicians.repo.ts
│   │       └── calls.repo.ts
│   │
│   ├── main/                ← من القالب
│   │   ├── app.ts
│   │   └── shared.ts
│   │
│   └── preload/             ← من القالب
│       └── index.ts
│
└── resources/build/         ← icons للتطبيق
```

---

## 🗄 قاعدة البيانات — SQLite Schema

### ملف `lib/database/migrations.ts`
```typescript
export const createTables = (db: Database) => {

  // جدول المهام
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT,
      status      TEXT NOT NULL DEFAULT 'pending', -- pending | inprogress | done
      priority    TEXT NOT NULL DEFAULT 'medium',  -- low | medium | high | urgent
      position    INTEGER NOT NULL DEFAULT 0,       -- للـ Drag & Drop
      due_date    TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول الملاحظات
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      content     TEXT,
      status      TEXT NOT NULL DEFAULT 'pending', -- pending | inprogress | done
      color       TEXT DEFAULT '#0EA5E9',           -- لون البطاقة
      position    INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول العملاء
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      phone        TEXT NOT NULL,
      address      TEXT,
      city         TEXT,
      camera_type  TEXT,            -- نوع الكاميرا عنده
      system_type  TEXT,            -- نظام الـ DVR/NVR/IP
      notes        TEXT,
      status       TEXT DEFAULT 'active', -- active | potential | inactive
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول الفنيين
  db.exec(`
    CREATE TABLE IF NOT EXISTS technicians (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      phone        TEXT NOT NULL,
      specialty    TEXT,             -- installation | maintenance | programming | all
      status       TEXT DEFAULT 'available', -- available | busy | off
      notes        TEXT,
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول طلبات الصيانة
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id        INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      client_name      TEXT NOT NULL,             -- نسخة مستقلة في حال حُذف العميل
      client_phone     TEXT NOT NULL,
      problem_type     TEXT NOT NULL,             -- camera | dvr | cables | power | other
      problem_desc     TEXT,
      priority         TEXT DEFAULT 'medium',     -- low | medium | high | urgent
      status           TEXT DEFAULT 'new',        -- new | inprogress | waiting_part | resolved | closed
      technician_id    INTEGER REFERENCES technicians(id) ON DELETE SET NULL,
      visit_date       TEXT,
      resolution_notes TEXT,
      created_at       TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول الزيارات الميدانية
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id       INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      client_name     TEXT NOT NULL,
      client_address  TEXT,
      technician_id   INTEGER REFERENCES technicians(id) ON DELETE SET NULL,
      technician_name TEXT,
      visit_type      TEXT NOT NULL,    -- installation | maintenance | inspection | followup
      visit_date      TEXT NOT NULL,
      visit_time      TEXT,
      status          TEXT DEFAULT 'scheduled', -- scheduled | completed | cancelled | postponed
      notes           TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول سجل الاتصالات
  db.exec(`
    CREATE TABLE IF NOT EXISTS call_logs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_name  TEXT NOT NULL,      -- اسم المتصل/المتصل به
      contact_type  TEXT NOT NULL,      -- client | company | supplier | other
      phone         TEXT,
      direction     TEXT NOT NULL,      -- incoming | outgoing
      subject       TEXT NOT NULL,
      summary       TEXT,
      requires_followup INTEGER DEFAULT 0, -- boolean
      followup_date TEXT,
      followup_done INTEGER DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
};
```

---

## 🔄 نمط تدفق البيانات (Data Flow Pattern)

يجب الالتزام بهذا النمط في **كل** الوحدات:

```
[React Page/Component]
        ↓  استدعاء custom hook
[Custom Hook - use-tasks.ts]
        ↓  يستدعي useConveyor()
[Conveyor API - db-api.ts]
        ↓  IPC عبر Electron
[DB Handler - db-handler.ts]
        ↓  يستدعي Repository
[Repository - tasks.repo.ts]
        ↓  SQL query
[SQLite Database - visiontrack.db]
```

### مثال عملي — Hook للمهام
```typescript
// app/hooks/use-tasks.ts
import { useConveyor } from '@/app/hooks/use-conveyor'
import { useState, useEffect } from 'react'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/app/types'

export function useTasks() {
  const { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } = useConveyor('db')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await getTasks()
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return {
    tasks,
    loading,
    pending: tasks.filter(t => t.status === 'pending'),
    inProgress: tasks.filter(t => t.status === 'inprogress'),
    done: tasks.filter(t => t.status === 'done'),
    create: async (input: CreateTaskInput) => { await createTask(input); await load() },
    update: async (id: number, input: UpdateTaskInput) => { await updateTask(id, input); await load() },
    remove: async (id: number) => { await deleteTask(id); await load() },
    moveStatus: async (id: number, status: Task['status'], position: number) => {
      await updateTaskStatus(id, status, position)
      await load()
    }
  }
}
```

---

## 🧩 المكونات المشتركة (Shared Components)

### 1. `Sidebar.tsx` — شريط التنقل الجانبي

```
التصميم:
- عرض: 220px ثابت
- الخلفية: var(--color-sidebar-bg) — #0D1117
- الحدود: border-left: 1px solid var(--color-border)  (لأن RTL)
- يظهر على اليمين دائماً
- في الأعلى: Logo + اسم التطبيق "VisionTrack"
- قائمة التنقل في الوسط
- في الأسفل: الإعدادات + اسم المستخدم

عناصر القائمة (nav items):
{
  icon: LayoutDashboard,  label: 'لوحة التحكم',  path: '/'
  icon: CheckSquare,      label: 'المهام',         path: '/tasks'
  icon: FileText,         label: 'الملاحظات',      path: '/notes'
  icon: Wrench,           label: 'الصيانة',         path: '/maintenance'
  icon: Users,            label: 'العملاء',          path: '/clients'
  icon: Calendar,         label: 'الزيارات',        path: '/visits'
  icon: HardHat,          label: 'الفنيون',          path: '/technicians'
  icon: Phone,            label: 'سجل الاتصالات',   path: '/calls'
}

Active state: خلفية var(--color-brand) مع border-radius وبرودة خط بارز على اليسار
Hover state: خلفية var(--color-bg-hover) انتقال سلس 150ms
```

### 2. `KanbanBoard.tsx` + `KanbanColumn.tsx` + `KanbanCard.tsx`

```
الهيكل:
<KanbanBoard>
  ├── <KanbanColumn status="pending" title="معلقة" color="amber">
  │     ├── <KanbanCard item={...} />
  │     ├── <KanbanCard item={...} />
  │     └── [+ إضافة بطاقة]
  ├── <KanbanColumn status="inprogress" title="جارية" color="blue">
  └── <KanbanColumn status="done" title="مكتملة" color="green">

تصميم Column:
- عرض: flex-1 (يملأ المساحة بالتساوي)
- الرأس: اسم العمود + عدد البطاقات badge
- الخلفية: var(--color-bg-surface) مع border رفيع
- border-top ملون حسب الحالة (amber/blue/green)

تصميم KanbanCard:
- خلفية: var(--color-bg-elevated)
- hover: رفع طفيف بـ transform translateY(-2px)
- يظهر: العنوان + الأولوية badge + التاريخ
- Drag handle: أيقونة GripVertical على اليسار
- عند السحب: opacity 50% + rotate(2deg) + shadow

dnd-kit setup:
- DndContext يحيط بـ KanbanBoard
- كل column هي droppable zone
- كل card هي draggable item
- onDragEnd: تحديد الـ column الجديد واستدعاء moveStatus()
```

### 3. `StatusBadge.tsx`

```typescript
// Props: status: 'pending' | 'inprogress' | 'done' | 'new' | 'resolved' | ...
// تعيد pill صغير ملون حسب الحالة
const configs = {
  pending:    { label: 'معلق',     bg: 'bg-amber-500/15',  text: 'text-amber-400'  },
  inprogress: { label: 'جارٍ',     bg: 'bg-blue-500/15',   text: 'text-blue-400'   },
  done:       { label: 'مكتمل',   bg: 'bg-green-500/15',  text: 'text-green-400'  },
  urgent:     { label: 'عاجل',     bg: 'bg-red-500/15',    text: 'text-red-400'    },
  new:        { label: 'جديد',     bg: 'bg-sky-500/15',    text: 'text-sky-400'    },
  resolved:   { label: 'محلول',   bg: 'bg-emerald-500/15',text: 'text-emerald-400'},
}
```

### 4. `FormModal.tsx` — نافذة الإضافة/التعديل

```
تصميم:
- Modal يظهر في المنتصف مع overlay داكن
- الرأس: عنوان النموذج + زر X للإغلاق
- المحتوى: slots للـ form fields
- الأسفل: [إلغاء] [حفظ]
- انتقال: scale(0.95) → scale(1) مع opacity عند الظهور (framer-motion)
- عرض: max-w-lg
```

### 5. `PageHeader.tsx`

```
يستقبل:
- title: string — عنوان الصفحة
- description?: string — وصف مختصر
- action?: ReactNode — زر الإضافة أو أي action

التصميم:
- صف أفقي: العنوان على اليمين، الـ action على اليسار
- خط فاصل تحته
- العنوان: text-xl font-semibold
- الوصف: text-sm text-muted
```

---

## 📄 تفاصيل كل صفحة

---

### صفحة 1: Dashboard — لوحة التحكم

**المسار**: `/`

**الهدف**: أول ما يراه المستخدم صباحاً — ملخص سريع لكل شيء.

**تخطيط الصفحة**:
```
┌─────────────────────────────────────────────────────┐
│  📊 لوحة التحكم          السبت، 10 مايو 2026       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [طلبات مفتوحة] [زيارات اليوم] [عملاء جدد] [مهام]  │
│     stat card      stat card    stat card  stat card │
│                                                      │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  الطلبات الأسبوعية   │  أحدث بلاغات الصيانة        │
│  [Bar Chart]         │  [قائمة 5 بلاغات]            │
│                      │                              │
├──────────────────────┼──────────────────────────────┤
│                      │                              │
│  زيارات اليوم        │  مهام معلقة (أولى 5)         │
│  [قائمة بالفنيين]    │  [قائمة مع أولوية]           │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

**Stat Cards** (4 بطاقات في صف):
- كل بطاقة: رقم كبير + عنوان + أيقونة + تغيير مقارنة بالأسبوع الماضي
- ألوان: brand/amber/green/purple لكل بطاقة
- انيميشن: الأرقام تعدّ من 0 إلى القيمة عند التحميل (counter animation)

**البيانات المطلوبة** (من قاعدة البيانات):
```typescript
interface DashboardData {
  openMaintenanceCount: number     // maintenance_requests WHERE status != 'closed'
  todayVisitsCount: number         // visits WHERE visit_date = today
  newClientsThisWeek: number       // clients WHERE created_at >= 7 days ago
  pendingTasksCount: number        // tasks WHERE status != 'done'
  weeklyMaintenanceChart: { day: string; count: number }[]
  recentMaintenance: MaintenanceRequest[]  // آخر 5
  todayVisits: Visit[]             // زيارات اليوم مع الفني
  urgentTasks: Task[]              // المهام العاجلة أولى 5
}
```

---

### صفحة 2: Tasks — المهام

**المسار**: `/tasks`

**الهدف**: Kanban board لإدارة المهام اليومية والأسبوعية.

**تخطيط الصفحة**:
```
┌─────────────────────────────────────────────────────┐
│  ✅ المهام                    [+ مهمة جديدة]        │
├─────────────────────────────────────────────────────┤
│ [بحث سريع...] [فلتر: الأولوية ▼] [فلتر: التاريخ ▼] │
├────────────────┬────────────────┬───────────────────┤
│   معلقة  (3)  │  جارية   (2)  │  مكتملة   (8)    │
│  ─────────── │  ─────────── │  ─────────────── │
│  [بطاقة]     │  [بطاقة]     │  [بطاقة]          │
│  [بطاقة]     │  [بطاقة]     │  [بطاقة]          │
│  [بطاقة]     │              │  [بطاقة]          │
│  [+ إضافة]   │  [+ إضافة]   │                   │
└────────────────┴────────────────┴───────────────────┘
```

**بطاقة المهمة (KanbanCard)**:
```
┌─────────────────────────────┐
│ ⠿  عنوان المهمة             │  ← drag handle + عنوان
│    وصف مختصر للمهمة...       │
│                              │
│  [🔴 عاجل]    📅 12 مايو    │  ← priority badge + تاريخ
│                [···]         │  ← قائمة خيارات (تعديل/حذف)
└─────────────────────────────┘
```

**نموذج إضافة/تعديل مهمة**:
```
الحقول:
- العنوان*: input text
- الوصف: textarea
- الأولوية*: select (منخفضة | متوسطة | عالية | عاجلة)
- تاريخ الاستحقاق: date picker
```

---

### صفحة 3: Notes — الملاحظات

**المسار**: `/notes`

**الهدف**: Kanban board للملاحظات — ملاحظات العمل، التعليمات، المعلومات المهمة.

**مطابق لصفحة المهام في البنية** مع فروق:
- بطاقة الملاحظة تُظهر محتوى أطول (3 أسطر)
- يمكن اختيار لون للبطاقة (6 ألوان مختلفة)
- لا يوجد حقل "أولوية" بل "لون" فقط

---

### صفحة 4: Maintenance — الصيانة

**المسار**: `/maintenance`

**الهدف**: تتبع بلاغات الصيانة من الفتح حتى الإغلاق.

**تخطيط الصفحة**:
```
┌─────────────────────────────────────────────────────┐
│  🔧 الصيانة                  [+ بلاغ جديد]          │
├─────────────────────────────────────────────────────┤
│ [بحث...] [الحالة ▼] [الأولوية ▼] [الفني ▼] [تاريخ] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  جديد (4)    جارٍ (2)    انتظار (1)    محلول (8)   │ ← Tabs أو فلتر سريع
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔴 أحمد العمري              [عاجل] [جارٍ]   │   │
│  │    كاميرا لا تعمل — نظام Hikvision           │   │
│  │    📅 12 مايو  👷 محمد (الفني)    ⋯ خيارات  │   │
│  └─────────────────────────────────────────────┘   │
│  (تكرر للبطاقات الأخرى...)                          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**بطاقة البلاغ** (List view — ليس Kanban):
```
┌─────────────────────────────────────────────────────────┐
│  [أيقونة المشكلة]  اسم العميل           [أولوية] [حالة] │
│                    نوع المشكلة + وصف مختصر              │
│                    📅 تاريخ البلاغ  👷 اسم الفني  ✎ ✕  │
└─────────────────────────────────────────────────────────┘
```

**نموذج بلاغ جديد** (FormModal):
```
الحقول:
- العميل*: Combobox يبحث في جدول clients (أو إدخال يدوي)
- اسم العميل*: auto-fill أو يدوي
- رقم الهاتف*: auto-fill أو يدوي
- نوع المشكلة*: select
    (كاميرا | DVR/NVR | أسلاك | طاقة | برمجة | أخرى)
- وصف المشكلة: textarea
- الأولوية*: select (منخفضة | متوسطة | عالية | عاجلة)
- الفني المسؤول: select من جدول technicians
- موعد الزيارة: date + time picker
```

**تغيير الحالة** (inline):
- زر صغير بجانب كل بطاقة يفتح dropdown لتغيير الحالة مباشرة
- عند الإغلاق: يُطلب ملاحظة الحل (resolution_notes)

---

### صفحة 5: Clients — العملاء

**المسار**: `/clients`

**الهدف**: قاعدة بيانات العملاء مع خط مبيعات بسيط.

**تخطيط الصفحة** (Tabs):
```
┌─────────────────────────────────────────────────────┐
│  👥 العملاء                  [+ عميل جديد]  [تصدير] │
├─────────────────────────────────────────────────────┤
│ [بحث عن عميل...]           [الحالة ▼] [المدينة ▼]  │
├─────────────────────────────────────────────────────┤
│  [جميع العملاء]  [محتملون]  [نشطون]  [غير نشطين]  │  ← Tabs
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ 👤 اسم العميل  |  📞 رقم  |  📍 المدينة     │  │
│  │    نوع الكاميرا/النظام   |  [نشط] |  ✎  ✕  │  │
│  └──────────────────────────────────────────────┘  │
│  (تكرر...)                                          │
└─────────────────────────────────────────────────────┘
```

**ملف العميل** (Drawer يفتح من اليسار عند النقر على العميل):
```
┌──────────────────────────────┐
│  ✕  ملف العميل               │
│  ─────────────────────────  │
│  👤  أحمد العمري             │
│  📞  0922-XXX-XXX            │
│  📍  الزاوية، ليبيا           │
│  📷  Hikvision IP 4CH        │
│                              │
│  ─── سجل الصيانة ───         │
│  [قائمة بلاغات هذا العميل]   │
│                              │
│  ─── سجل الزيارات ───        │
│  [قائمة زيارات هذا العميل]   │
└──────────────────────────────┘
```

**تصدير Excel**: زر يصدر جدول العملاء المفلترة بصيغة .xlsx

**نموذج عميل جديد**:
```
الحقول:
- الاسم*
- رقم الهاتف*
- العنوان
- المدينة
- نوع الكاميرا (Hikvision | Dahua | CP Plus | أخرى)
- نوع النظام (DVR | NVR | IP Cameras | Hybrid)
- الحالة (نشط | محتمل | غير نشط)
- ملاحظات
```

---

### صفحة 6: Visits — الزيارات الميدانية

**المسار**: `/visits`

**الهدف**: جدولة ومتابعة زيارات التركيب والصيانة.

**تخطيط الصفحة**:
```
┌─────────────────────────────────────────────────────┐
│  📅 الزيارات                   [+ زيارة جديدة]      │
├─────────────────────────────────────────────────────┤
│  [◀ الأسبوع السابق]  الأسبوع: 5-11 مايو  [▶]        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  اليوم (3 زيارات)  ← مُبرز بإطار خاص               │
│  ┌────────────────────────────────────────────┐    │
│  │ ⏰ 09:00  │ أحمد العمري - تركيب  │ محمد 🟢│    │
│  │ ⏰ 11:30  │ خالد البشير - صيانة  │ علي  🟡│    │
│  │ ⏰ 14:00  │ سالم النوير - تفقد   │ محمد 🟢│    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  الغد (1 زيارة)                                     │
│  ┌────────────────────────────────────────────┐    │
│  │ ⏰ 10:00  │ عمر السعيد - تثبيت   │ علي  🟡│    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**نموذج زيارة جديدة**:
```
الحقول:
- العميل: Combobox أو يدوي
- العنوان: auto-fill أو يدوي
- الفني*: select من جدول technicians
- نوع الزيارة*: (تركيب | صيانة | تفقد | متابعة)
- التاريخ*: date picker
- الوقت: time picker
- ملاحظات
```

---

### صفحة 7: Technicians — الفنيون

**المسار**: `/technicians`

**الهدف**: إدارة فريق الفنيين ومتابعة حالتهم.

**تخطيط الصفحة**:
```
┌─────────────────────────────────────────────────────┐
│  👷 الفنيون                    [+ فني جديد]          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │    👤    │  │    👤    │  │    👤    │          │
│  │  محمد    │  │   علي    │  │  أحمد    │          │
│  │ تركيب   │  │  صيانة   │  │  برمجة   │          │
│  │ [🟢 متاح]│  │[🟡 مشغول]│  │[🟢 متاح] │          │
│  │ 📞 ...   │  │ 📞 ...   │  │ 📞 ...   │          │
│  │ [تعديل] │  │ [تعديل] │  │ [تعديل] │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Cards Grid** (3 columns):
- كل بطاقة: صورة افتراضية (initial) + اسم + تخصص + حالة + هاتف
- تغيير الحالة: select مباشر على البطاقة
- إحصاء: عدد المهام المسندة اليوم/الأسبوع

---

### صفحة 8: CallLog — سجل الاتصالات

**المسار**: `/calls`

**الهدف**: توثيق المكالمات والتواصل مع العملاء والشركة.

**تخطيط الصفحة**:
```
┌─────────────────────────────────────────────────────┐
│  📞 سجل الاتصالات              [+ تسجيل اتصال]      │
├─────────────────────────────────────────────────────┤
│ [بحث...] [النوع ▼] [الاتجاه ▼] [تحتاج متابعة فقط] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  السبت، 10 مايو 2026                                │
│  ┌────────────────────────────────────────────┐    │
│  │ 📞↗  الشركة الأم - أبوبكر    11:30 ص       │    │
│  │    موضوع: استفسار عن الشحنة القادمة         │    │
│  │    ✅ تم الاتفاق على التسليم يوم الخميس     │    │
│  │    [🔔 تذكير: الخميس]              ✎  ✕    │    │
│  └────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────┐    │
│  │ 📞↙  عميل - خالد البشير     10:00 ص        │    │
│  │    موضوع: استفسار عن أسعار الكاميرات        │    │
│  │    تم إرسال عرض السعر                       │    │
│  │    [⚠️ يحتاج متابعة: 15 مايو]     ✎  ✕    │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**نموذج تسجيل اتصال**:
```
الحقول:
- اسم جهة الاتصال*
- نوع جهة الاتصال*: (عميل | الشركة | مورد | أخرى)
- رقم الهاتف
- اتجاه الاتصال*: (وارد | صادر)
- الموضوع*
- ملخص المحادثة
- يحتاج متابعة؟: checkbox
  - إذا نعم → تاريخ المتابعة: date picker
```

---

### صفحة 9: Settings — الإعدادات

**المسار**: `/settings`

**الهدف**: إعدادات التطبيق العامة.

**الأقسام**:
```
1. معلومات المحل
   - اسم المحل، العنوان، رقم الهاتف
   - اسم الوكيل (لأغراض الطباعة مستقبلاً)

2. الإعدادات العامة
   - المظهر: [داكن] [فاتح] [تلقائي]
   - اللغة: العربية (ثابت الآن)

3. قاعدة البيانات
   - مسار ملف قاعدة البيانات (readonly للعرض)
   - زر [نسخ احتياطي الآن] ← يحفظ نسخة .db بتاريخ اليوم
   - زر [استعادة من نسخة احتياطية]

4. عن التطبيق
   - الإصدار: v1.0.0
   - المطور: [اسمك]
```

---

## 🏗 تعليمات البناء — خطوة بخطوة

### الخطوة 1: تهيئة المشروع
```bash
# القالب جاهز، ثبّت الحزم الإضافية فقط
npm install better-sqlite3 @types/better-sqlite3
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install zustand recharts date-fns xlsx
npm install react-router-dom @types/react-router-dom
```

### الخطوة 2: قاعدة البيانات أولاً
1. أنشئ `lib/database/db.ts` — الاتصال وتحديد المسار
2. أنشئ `lib/database/migrations.ts` — الجداول كلها
3. أنشئ `lib/database/repositories/` — ملف لكل جدول

### الخطوة 3: طبقة Conveyor
1. أضف schemas في `lib/conveyor/schemas/db-schema.ts`
2. أضف API methods في `lib/conveyor/api/db-api.ts`
3. أضف handlers في `lib/conveyor/handlers/db-handler.ts`
4. سجّل الـ handlers في `lib/main/app.ts`

### الخطوة 4: Types والـ Store
1. عرّف كل الـ interfaces في `app/types/`
2. أنشئ Zustand stores في `app/store/`

### الخطوة 5: المكونات المشتركة
بالترتيب: Sidebar → KanbanBoard → KanbanCard → StatusBadge → FormModal

### الخطوة 6: الصفحات
بالترتيب: Dashboard → Tasks → Notes → Maintenance → Clients → Visits → Technicians → CallLog → Settings

### الخطوة 7: Router
```typescript
// app/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom'
// HashRouter يعمل بشكل أفضل مع Electron (لا يحتاج server)
```

---

## ⚠️ قواعد مهمة يجب الالتزام بها

1. **كل قراءة/كتابة من SQLite** يجب أن تمر عبر Conveyor — لا تتصل بـ SQLite مباشرة من الـ renderer
2. **RTL بالكامل** — كل div يحتاج `dir="rtl"` أو ضعها على الـ `<html>`
3. **استخدم Shadcn components** قدر الإمكان — Dialog, Select, Input, Badge, Button, etc.
4. **TypeScript strict** — لا `any` إطلاقاً
5. **كل form** يتحقق من البيانات قبل الإرسال (validation بسيطة على الأقل)
6. **Error states** — كل fetch يعرض رسالة خطأ واضحة إذا فشل
7. **Empty states** — كل قائمة فارغة تعرض رسالة مع أيقونة ودعوة للإضافة
8. **Loading states** — كل جلب بيانات يعرض skeleton أو spinner
9. **تأكيد الحذف** — استخدم ConfirmDialog قبل أي حذف
10. **Responsive** — التطبيق يعمل على أحجام نوافذ مختلفة (min-width: 900px)

---

## 🎯 أولويات التطوير

```
المرحلة 1 (الجوهر):
  ✅ قاعدة البيانات + Conveyor
  ✅ Layout + Sidebar + Router
  ✅ صفحة المهام (Kanban)
  ✅ صفحة الملاحظات (Kanban)

المرحلة 2 (العمليات):
  ✅ صفحة الصيانة
  ✅ صفحة العملاء
  ✅ صفحة الزيارات

المرحلة 3 (التكامل):
  ✅ لوحة التحكم (Dashboard)
  ✅ الفنيون
  ✅ سجل الاتصالات
  ✅ الإعدادات
```

---

*VisionTrack v1.0 — نظام إدارة وكيل كاميرات المراقبة*
