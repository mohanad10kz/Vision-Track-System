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

  /* Visit Type Colors */
  --color-installation: #8B5CF6;   /* بنفسجي — تركيب */
  --color-maintenance: #F59E0B;    /* برتقالي — صيانة */
  --color-survey: #06B6D4;         /* سماوي — مسح ميداني */
  --color-followup: #6B7280;       /* رمادي — متابعة */

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

body {
  font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
  direction: rtl; /* النظام بالكامل RTL */
}
/* الأرقام والتواريخ تستخدم JetBrains Mono */
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
electron-react-app/
│
├── app/                              ← React Renderer Process
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── ui/                       ← Shadcn components (لا تعدّل)
│   │   ├── window/                   ← Titlebar و Menus (من القالب)
│   │   └── shared/                   ← مكوناتك المشتركة
│   │       ├── Sidebar.tsx
│   │       ├── PageHeader.tsx
│   │       ├── KanbanBoard.tsx
│   │       ├── KanbanColumn.tsx
│   │       ├── KanbanCard.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── VisitTypeBadge.tsx
│   │       ├── PriorityBadge.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── SearchInput.tsx
│   │       ├── DataTable.tsx
│   │       └── FormModal.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── TaskArchive.tsx           ← أرشيف المهام المكتملة
│   │   ├── Notes.tsx
│   │   ├── NoteArchive.tsx           ← أرشيف الملاحظات المكتملة
│   │   ├── Visits.tsx                ← يشمل: تركيب + صيانة + مسح + متابعة
│   │   ├── Clients.tsx               ← مبسّطة: اسم + هاتف + ملاحظات
│   │   ├── Technicians.tsx
│   │   ├── CallLog.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/
│   │   ├── use-conveyor.ts           ← موجود في القالب
│   │   ├── use-tasks.ts
│   │   ├── use-notes.ts
│   │   ├── use-visits.ts
│   │   ├── use-clients.ts
│   │   ├── use-technicians.ts
│   │   └── use-calls.ts
│   │
│   ├── store/
│   │   ├── app.store.ts
│   │   └── ui.store.ts
│   │
│   ├── types/
│   │   ├── task.types.ts
│   │   ├── note.types.ts
│   │   ├── visit.types.ts            ← يشمل جميع أنواع الزيارات
│   │   ├── client.types.ts
│   │   ├── technician.types.ts
│   │   ├── call.types.ts
│   │   └── index.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── lib/                              ← Electron Main Process
│   ├── conveyor/
│   │   ├── schemas/
│   │   │   ├── app-schema.ts         ← موجود
│   │   │   ├── db-schema.ts          ← أنشئه
│   │   │   └── window-schema.ts      ← موجود
│   │   ├── api/
│   │   │   ├── app-api.ts            ← موجود
│   │   │   ├── db-api.ts             ← أنشئه
│   │   │   └── window-api.ts         ← موجود
│   │   └── handlers/
│   │       ├── app-handler.ts        ← موجود
│   │       ├── db-handler.ts         ← أنشئه
│   │       └── window-handler.ts     ← موجود
│   │
│   ├── database/
│   │   ├── db.ts
│   │   ├── migrations.ts
│   │   └── repositories/
│   │       ├── tasks.repo.ts
│   │       ├── notes.repo.ts
│   │       ├── visits.repo.ts        ← repo موحد لجميع أنواع الزيارات
│   │       ├── clients.repo.ts
│   │       ├── technicians.repo.ts
│   │       └── calls.repo.ts
│   │
│   ├── main/
│   │   ├── app.ts
│   │   └── shared.ts
│   └── preload/
│       └── index.ts
│
└── resources/build/
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
      status      TEXT NOT NULL DEFAULT 'pending',  -- pending | inprogress | done
      priority    TEXT NOT NULL DEFAULT 'medium',   -- low | medium | high | urgent
      position    INTEGER NOT NULL DEFAULT 0,        -- للـ Drag & Drop
      due_date    TEXT,
      archived_at TEXT,                              -- null = نشطة، تاريخ = مؤرشفة
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
      status      TEXT NOT NULL DEFAULT 'pending',  -- pending | inprogress | done
      color       TEXT DEFAULT '#0EA5E9',
      position    INTEGER NOT NULL DEFAULT 0,
      archived_at TEXT,                              -- null = نشطة، تاريخ = مؤرشفة
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول العملاء — مبسّط (دفتر عناوين للربط مع الزيارات)
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      address    TEXT,
      notes      TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول الفنيين
  db.exec(`
    CREATE TABLE IF NOT EXISTS technicians (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      specialty  TEXT,   -- installation | maintenance | programming | all
      status     TEXT DEFAULT 'available', -- available | busy | off
      notes      TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول الزيارات الميدانية — موحد لجميع الأنواع
  // هذا الجدول يغطي: التركيب + الصيانة + المسح الميداني + المتابعة
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,

      -- بيانات العميل (مرتبطة أو يدوية)
      client_id        INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      client_name      TEXT NOT NULL,   -- نسخة مستقلة دائماً
      client_phone     TEXT NOT NULL,
      client_address   TEXT,

      -- نوع الزيارة — هذا العمود هو قلب التمييز بين الأنواع
      visit_type       TEXT NOT NULL,
      -- القيم المسموحة:
      -- 'installation'  → تركيب جديد
      -- 'maintenance'   → صيانة وإصلاح
      -- 'survey'        → مسح ميداني (لتقدير عرض سعر أو تصميم نظام)
      -- 'followup'      → متابعة بعد تركيب أو صيانة سابقة

      -- بيانات الزيارة
      visit_date       TEXT NOT NULL,
      visit_time       TEXT,
      technician_id    INTEGER REFERENCES technicians(id) ON DELETE SET NULL,
      technician_name  TEXT,            -- نسخة مستقلة

      -- الحالة
      status           TEXT DEFAULT 'scheduled',
      -- القيم: scheduled | completed | cancelled | postponed

      -- حقول خاصة بنوع الزيارة
      -- تُستخدم فقط عند الحاجة حسب visit_type
      problem_type     TEXT,            -- لـ maintenance: camera|dvr|cables|power|other
      problem_desc     TEXT,            -- لـ maintenance: وصف المشكلة
      camera_count     INTEGER,         -- لـ installation/survey: عدد الكاميرات
      system_type      TEXT,            -- لـ installation/survey: DVR|NVR|IP|Hybrid
      priority         TEXT DEFAULT 'medium', -- لـ maintenance: low|medium|high|urgent

      -- ملاحظات الزيارة والنتيجة
      notes            TEXT,            -- ملاحظات قبل الزيارة
      resolution_notes TEXT,            -- ما تم تنفيذه (يُعبأ بعد الزيارة)

      created_at       TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // جدول سجل الاتصالات
  db.exec(`
    CREATE TABLE IF NOT EXISTS call_logs (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_name      TEXT NOT NULL,
      contact_type      TEXT NOT NULL,   -- client | company | supplier | other
      phone             TEXT,
      direction         TEXT NOT NULL,   -- incoming | outgoing
      subject           TEXT NOT NULL,
      summary           TEXT,
      requires_followup INTEGER DEFAULT 0,
      followup_date     TEXT,
      followup_done     INTEGER DEFAULT 0,
      created_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
};
```

---

## 🔄 منطق الأرشفة للمهام والملاحظات

المهام والملاحظات **لا تُحذف** من قاعدة البيانات — بل تُؤرشف.

```
منطق العرض في صفحة المهام/الملاحظات (Kanban):
  → اعرض فقط: archived_at IS NULL
  → عمود Done يعرض: status='done' AND archived_at IS NULL AND updated_at >= 7 أيام

منطق الأرشفة التلقائية (تُشغَّل عند فتح التطبيق):
  → أرشف: status='done' AND archived_at IS NULL AND updated_at < تاريخ قبل 7 أيام
  → الأرشفة = UPDATE tasks SET archived_at = datetime('now') WHERE ...

صفحة الأرشيف:
  → تعرض: archived_at IS NOT NULL
  → مفلترة بـ: [هذا الأسبوع | هذا الشهر | 3 أشهر | كل الوقت]
  → + date range picker + بحث بالعنوان
```

---

## 🔄 نمط تدفق البيانات

```
[React Page/Component]
        ↓  استدعاء custom hook
[Custom Hook]
        ↓  يستدعي useConveyor()
[Conveyor API - db-api.ts]
        ↓  IPC عبر Electron
[DB Handler - db-handler.ts]
        ↓  يستدعي Repository
[Repository]
        ↓  SQL query
[SQLite Database - visiontrack.db]
```

### مثال — Hook للزيارات
```typescript
// app/hooks/use-visits.ts
export function useVisits(typeFilter?: VisitType) {
  const { getVisits, createVisit, updateVisit, deleteVisit, updateVisitStatus } = useConveyor('db')
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await getVisits({ type: typeFilter })
    setVisits(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [typeFilter])

  return {
    visits,
    loading,
    scheduled: visits.filter(v => v.status === 'scheduled'),
    completed: visits.filter(v => v.status === 'completed'),
    today: visits.filter(v => isToday(new Date(v.visit_date))),
    create: async (input: CreateVisitInput) => { await createVisit(input); await load() },
    update: async (id: number, input: UpdateVisitInput) => { await updateVisit(id, input); await load() },
    remove: async (id: number) => { await deleteVisit(id); await load() },
    changeStatus: async (id: number, status: Visit['status'], resolutionNotes?: string) => {
      await updateVisitStatus(id, status, resolutionNotes)
      await load()
    }
  }
}
```

### مثال — Hook للمهام مع الأرشفة
```typescript
// app/hooks/use-tasks.ts
export function useTasks() {
  const conveyor = useConveyor('db')
  const [tasks, setTasks] = useState<Task[]>([])

  const load = async () => {
    // يجلب فقط المهام غير المؤرشفة
    const data = await conveyor.getActiveTasks()
    setTasks(data)
  }

  return {
    tasks,
    pending:    tasks.filter(t => t.status === 'pending'),
    inProgress: tasks.filter(t => t.status === 'inprogress'),
    // Done يعرض آخر 7 أيام فقط
    done: tasks.filter(t =>
      t.status === 'done' &&
      differenceInDays(new Date(), new Date(t.updated_at)) <= 7
    ),
    ...
  }
}
```

---

## 🧩 المكونات المشتركة

### 1. `Sidebar.tsx`
```
عناصر القائمة:
  icon: LayoutDashboard  label: 'لوحة التحكم'    path: '/'
  icon: CheckSquare      label: 'المهام'           path: '/tasks'
  icon: Archive          label: 'أرشيف المهام'     path: '/tasks/archive'
  icon: FileText         label: 'الملاحظات'        path: '/notes'
  icon: Archive          label: 'أرشيف الملاحظات'  path: '/notes/archive'
  icon: Calendar         label: 'الزيارات'         path: '/visits'
  icon: Users            label: 'العملاء'           path: '/clients'
  icon: HardHat          label: 'الفنيون'           path: '/technicians'
  icon: Phone            label: 'سجل الاتصالات'    path: '/calls'
  --- فاصل ---
  icon: Settings         label: 'الإعدادات'         path: '/settings'

التصميم:
- عرض 220px ثابت على اليمين
- الخلفية: var(--color-sidebar-bg)
- في الأعلى: شعار VisionTrack
- Active: خلفية var(--color-brand) مع border-radius
- أرشيف المهام والملاحظات: indent بمقدار 12px تحت المهام/الملاحظات
  وبخط أصغر لتوضيح أنها فرع
```

### 2. `KanbanBoard.tsx` / `KanbanColumn.tsx` / `KanbanCard.tsx`
```
dnd-kit setup:
- DndContext يحيط بـ KanbanBoard
- كل column هي Droppable
- كل card هي Draggable
- onDragEnd → يحدد الـ column الجديد → يستدعي moveStatus()

تصميم KanbanCard:
- الخلفية: var(--color-bg-elevated)
- hover: translateY(-2px) انتقال 150ms
- يعرض:
    ⠿ drag handle (GripVertical icon)
    عنوان المهمة/الملاحظة
    وصف مختصر (2 سطر max, text-ellipsis)
    [أولوية badge]  [created_at relative]  [due_date إن وجد]
    قائمة ··· (تعديل / حذف)
- عند السحب: opacity:0.5 + rotate(1.5deg)
```

### 3. `VisitTypeBadge.tsx`
```typescript
const configs = {
  installation: { label: 'تركيب',       color: 'var(--color-installation)', icon: Hammer    },
  maintenance:  { label: 'صيانة',        color: 'var(--color-maintenance)',  icon: Wrench    },
  survey:       { label: 'مسح ميداني',  color: 'var(--color-survey)',       icon: MapPin    },
  followup:     { label: 'متابعة',       color: 'var(--color-followup)',     icon: RefreshCw },
}
```

### 4. `StatusBadge.tsx`
```typescript
const configs = {
  pending:    { label: 'معلق',      bg: 'bg-amber-500/15',   text: 'text-amber-400'   },
  inprogress: { label: 'جارٍ',      bg: 'bg-blue-500/15',    text: 'text-blue-400'    },
  done:       { label: 'مكتمل',    bg: 'bg-green-500/15',   text: 'text-green-400'   },
  scheduled:  { label: 'مجدولة',   bg: 'bg-sky-500/15',     text: 'text-sky-400'     },
  completed:  { label: 'مكتملة',   bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  cancelled:  { label: 'ملغاة',    bg: 'bg-red-500/15',     text: 'text-red-400'     },
  postponed:  { label: 'مؤجلة',    bg: 'bg-orange-500/15',  text: 'text-orange-400'  },
  urgent:     { label: 'عاجل',      bg: 'bg-red-500/15',     text: 'text-red-400'     },
}
```

### 5. `FormModal.tsx`
```
- Modal في المنتصف مع overlay داكن
- انتقال: scale(0.95)→scale(1) مع opacity (framer-motion)
- الرأس: عنوان + زر X
- المحتوى: slots للـ form fields
- الأسفل: [إلغاء] [حفظ]
- عرض: max-w-lg
```

---

## 📄 تفاصيل كل صفحة

---

### صفحة 1: Dashboard — لوحة التحكم
**المسار**: `/`

```
┌─────────────────────────────────────────────────────┐
│  📊 لوحة التحكم          الثلاثاء، 20 مايو 2026    │
├─────────────────────────────────────────────────────┤
│ [زيارات اليوم]  [صيانة مجدولة]  [مهام معلقة]  [عملاء]│
│   stat card       stat card       stat card   stat  │
├──────────────────────┬──────────────────────────────┤
│  الزيارات الأسبوعية  │  زيارات اليوم                │
│  [Bar Chart]         │  [قائمة مرتبة بالوقت]        │
├──────────────────────┼──────────────────────────────┤
│  مهام عاجلة (أولى 5) │  آخر اتصالات تحتاج متابعة   │
│  [قائمة]             │  [قائمة]                     │
└──────────────────────┴──────────────────────────────┘
```

**البيانات المطلوبة**:
```typescript
interface DashboardData {
  todayVisitsCount: number
  scheduledMaintenanceCount: number   // visits WHERE type='maintenance' AND status='scheduled'
  pendingTasksCount: number
  totalClientsCount: number
  weeklyVisitsChart: { day: string; count: number; type: VisitType }[]
  todayVisits: Visit[]
  urgentTasks: Task[]
  pendingFollowupCalls: CallLog[]     // requires_followup=1 AND followup_done=0
}
```

**Stat Cards**: أرقام تعدّ من 0 عند التحميل (counter animation بـ framer-motion)

---

### صفحة 2: Tasks — المهام
**المسار**: `/tasks`

```
┌─────────────────────────────────────────────────────┐
│  ✅ المهام                       [+ مهمة جديدة]    │
├─────────────────────────────────────────────────────┤
│  [بحث...]  [الأولوية ▼]  [📁 الأرشيف ←]            │
├────────────────┬───────────────┬────────────────────┤
│  معلقة   (3)  │  جارية  (2)  │  مكتملة   (5)      │
│  ──────────── │  ──────────── │  ────────────────  │
│  [بطاقة]      │  [بطاقة]      │  [بطاقة]            │
│  [+ إضافة]    │  [+ إضافة]    │                    │
└────────────────┴───────────────┴────────────────────┘
```

**بطاقة المهمة**:
```
┌──────────────────────────────┐
│ ⠿  عنوان المهمة               │
│    وصف مختصر (2 سطر max)...   │
│                               │
│  [🔴 عاجل]  منذ 3 أيام  ···  │
└──────────────────────────────┘
```

**نموذج مهمة جديدة**:
```
- العنوان*
- الوصف
- الأولوية*: (منخفضة | متوسطة | عالية | عاجلة)
- تاريخ الاستحقاق
```

---

### صفحة 3: TaskArchive — أرشيف المهام
**المسار**: `/tasks/archive`

```
┌─────────────────────────────────────────────────────┐
│  📁 أرشيف المهام                [← العودة للمهام]   │
├─────────────────────────────────────────────────────┤
│  [هذا الأسبوع] [هذا الشهر] [3 أشهر] [كل الوقت]    │
│  من [__/__/__] إلى [__/__/__]    [بحث بالعنوان...]  │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐  │
│  │ ✓  عنوان المهمة    [مكتمل]  أُنشئت: 2 مايو  │  │
│  │    وصف مختصر...              أُنجزت: 8 مايو  │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**الفلترة في SQL**:
```sql
SELECT * FROM tasks
WHERE archived_at IS NOT NULL
AND created_at >= ?   -- حسب الفلتر المختار
ORDER BY archived_at DESC
```

---

### صفحة 4: Notes — الملاحظات
**المسار**: `/notes`

مطابقة لصفحة المهام في البنية مع فروق:
- البطاقة تعرض محتوى أطول (3 أسطر)
- يمكن اختيار لون للبطاقة من 6 ألوان
- لا يوجد حقل "أولوية"

---

### صفحة 5: NoteArchive — أرشيف الملاحظات
**المسار**: `/notes/archive`
مطابقة تماماً لصفحة أرشيف المهام.

---

### صفحة 6: Visits — الزيارات الميدانية ⭐ الصفحة الرئيسية
**المسار**: `/visits`

**هذه الصفحة تجمع كل أنواع الزيارات في مكان واحد مع tabs للتصفية.**

```
┌─────────────────────────────────────────────────────┐
│  📅 الزيارات                    [+ زيارة جديدة]     │
├─────────────────────────────────────────────────────┤
│ [الكل] [تركيب 🔨] [صيانة 🔧] [مسح ميداني 📍] [متابعة 🔄]│
├─────────────────────────────────────────────────────┤
│ [بحث باسم العميل...]  [الحالة ▼]  [الفني ▼]  [تاريخ]│
├─────────────────────────────────────────────────────┤
│                                                      │
│  اليوم — الثلاثاء 20 مايو (3 زيارات)               │
│  ┌──────────────────────────────────────────────┐  │
│  │ ⏰ 09:00 │ [🔨 تركيب]  │ أحمد العمري        │  │
│  │          │             │ محمد الفني  [مجدولة]│  │
│  │          │  📍 شارع الجمهورية، بنغازي   ···  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ ⏰ 11:30 │ [🔧 صيانة]  │ خالد البشير        │  │
│  │          │ كاميرا لا تعمل  │ علي  [🔴 عاجل] │  │
│  │          │  📍 حي السلماني              ···  │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  الغد — الأربعاء 21 مايو (1 زيارة)                 │
│  ┌──────────────────────────────────────────────┐  │
│  │ ⏰ 10:00 │ [📍 مسح]    │ شركة النور          │  │
│  │          │ تقدير 8 كاميرات │ أحمد  [مجدولة] │  │
│  │          │  📍 المنطقة الصناعية          ···  │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**بطاقة الزيارة** تعرض معلومات مختلفة حسب النوع:
```
تركيب:      [نوع الزيارة] اسم العميل | عدد الكاميرات + نوع النظام | الفني | الحالة
صيانة:      [نوع الزيارة] اسم العميل | نوع المشكلة + الأولوية     | الفني | الحالة
مسح ميداني: [نوع الزيارة] اسم العميل | الهدف من المسح              | الفني | الحالة
متابعة:     [نوع الزيارة] اسم العميل | ملاحظة مختصرة               | الفني | الحالة
```

**نموذج زيارة جديدة** — يتغير حسب النوع المختار:

```
الحقول الثابتة (لجميع الأنواع):
  - نوع الزيارة*: (تركيب | صيانة | مسح ميداني | متابعة)
  - العميل: Combobox يبحث في جدول clients أو إدخال يدوي
  - اسم العميل*: auto-fill أو يدوي
  - رقم الهاتف*: auto-fill أو يدوي
  - العنوان: auto-fill أو يدوي
  - الفني*: select من جدول technicians
  - التاريخ*: date picker
  - الوقت: time picker
  - ملاحظات

حقول إضافية لـ "تركيب":
  - عدد الكاميرات
  - نوع النظام: (DVR | NVR | IP | Hybrid)

حقول إضافية لـ "صيانة":
  - نوع المشكلة*: (كاميرا | DVR/NVR | أسلاك | طاقة | برمجة | أخرى)
  - وصف المشكلة
  - الأولوية*: (منخفضة | متوسطة | عالية | عاجلة)

حقول إضافية لـ "مسح ميداني":
  - عدد الكاميرات المقدّر
  - نوع النظام المقترح
```

**تغيير الحالة**:
- كل بطاقة فيها زر حالة inline → dropdown: (مجدولة | مكتملة | ملغاة | مؤجلة)
- عند اختيار "مكتملة": يظهر textarea لإدخال `resolution_notes`

---

### صفحة 7: Clients — العملاء (مبسّطة)
**المسار**: `/clients`

**الهدف**: دفتر عناوين بسيط للربط السريع مع الزيارات.

```
┌─────────────────────────────────────────────────────┐
│  👥 العملاء                      [+ عميل جديد]      │
├─────────────────────────────────────────────────────┤
│  [بحث باسم أو رقم هاتف...]                          │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐  │
│  │ 👤 أحمد العمري   │ 📞 0922-XXX-XXX   ✎  ✕  │  │
│  │    📍 شارع الجمهورية، بنغازي                 │  │
│  │    📝 عميل قديم، نظام Hikvision 8 كاميرا    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**نموذج عميل جديد**:
```
- الاسم*
- رقم الهاتف*
- العنوان
- ملاحظات (نوع النظام، تفاصيل مهمة...)
```

**ملاحظة مهمة**: عند إضافة زيارة جديدة، يمكن البحث عن العميل من هذا الجدول مباشرة عبر Combobox في نموذج الزيارة للـ auto-fill.

---

### صفحة 8: Technicians — الفنيون
**المسار**: `/technicians`

```
┌─────────────────────────────────────────────────────┐
│  👷 الفنيون                      [+ فني جديد]       │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │    👤    │  │    👤    │  │    👤    │          │
│  │  محمد    │  │   علي    │  │  أحمد    │          │
│  │  تركيب  │  │  صيانة   │  │  برمجة   │          │
│  │ [🟢 متاح]│  │[🟡 مشغول]│  │[🟢 متاح] │          │
│  │ 📞 ...   │  │ 📞 ...   │  │ 📞 ...   │          │
│  │ زيارات اليوم: 2│ زيارات اليوم: 1│ 0    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

**البطاقة تعرض**:
- الحرف الأول من الاسم كـ avatar مع لون فريد
- الاسم + التخصص
- الحالة: select مباشر على البطاقة للتغيير السريع
- عدد زيارات اليوم (من جدول visits)
- رقم الهاتف

**نموذج فني جديد**:
```
- الاسم*
- رقم الهاتف*
- التخصص: (تركيب | صيانة | برمجة | الكل)
- ملاحظات
```

---

### صفحة 9: CallLog — سجل الاتصالات
**المسار**: `/calls`

```
┌─────────────────────────────────────────────────────┐
│  📞 سجل الاتصالات               [+ تسجيل اتصال]    │
├─────────────────────────────────────────────────────┤
│  [بحث...]  [النوع ▼]  [الاتجاه ▼]  [⚠️ تحتاج متابعة]│
├─────────────────────────────────────────────────────┤
│  الثلاثاء، 20 مايو 2026                             │
│  ┌──────────────────────────────────────────────┐  │
│  │ 📞↗  الشركة الأم  11:30 ص                   │  │
│  │    موضوع: الشحنة القادمة                      │  │
│  │    ملخص: تسليم الخميس القادم                  │  │
│  │    [🔔 متابعة: الخميس]              ✎  ✕    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**نموذج تسجيل اتصال**:
```
- اسم جهة الاتصال*
- نوع جهة الاتصال*: (عميل | الشركة | مورد | أخرى)
- رقم الهاتف
- الاتجاه*: (وارد ↙ | صادر ↗)
- الموضوع*
- ملخص المحادثة
- يحتاج متابعة؟ checkbox
    إذا نعم → تاريخ المتابعة: date picker
```

---

### صفحة 10: Settings — الإعدادات
**المسار**: `/settings`

```
الأقسام:
1. معلومات المحل
   - اسم المحل، العنوان، رقم الهاتف

2. الإعدادات العامة
   - المظهر: [داكن] [فاتح] [تلقائي]

3. قاعدة البيانات
   - مسار ملف DB (readonly)
   - [نسخ احتياطي الآن] ← يحفظ نسخة .db بتاريخ اليوم
   - [استعادة من نسخة احتياطية]

4. عن التطبيق
   - الإصدار: v1.0.0
```

---

## 🏗 تعليمات البناء — خطوة بخطوة

### الخطوة 1: تهيئة المشروع
```bash
npm install better-sqlite3 @types/better-sqlite3
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install zustand recharts date-fns
npm install react-router-dom @types/react-router-dom
```

### الخطوة 2: قاعدة البيانات
1. `lib/database/db.ts` — الاتصال + مسار الملف
2. `lib/database/migrations.ts` — إنشاء الجداول
3. `lib/database/repositories/` — ملف لكل جدول

### الخطوة 3: طبقة Conveyor
1. `lib/conveyor/schemas/db-schema.ts`
2. `lib/conveyor/api/db-api.ts`
3. `lib/conveyor/handlers/db-handler.ts`
4. سجّل الـ handlers في `lib/main/app.ts`
5. أضف منطق الأرشفة التلقائية هنا (يُشغَّل عند بدء التطبيق)

### الخطوة 4: Types والـ Store
```typescript
// app/types/visit.types.ts
export type VisitType = 'installation' | 'maintenance' | 'survey' | 'followup'
export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | 'postponed'

export interface Visit {
  id: number
  client_id?: number
  client_name: string
  client_phone: string
  client_address?: string
  visit_type: VisitType
  visit_date: string
  visit_time?: string
  technician_id?: number
  technician_name?: string
  status: VisitStatus
  // حقول اختيارية حسب النوع
  problem_type?: string
  problem_desc?: string
  camera_count?: number
  system_type?: string
  priority?: string
  notes?: string
  resolution_notes?: string
  created_at: string
  updated_at: string
}
```

### الخطوة 5: المكونات المشتركة
Sidebar → KanbanBoard → KanbanCard → StatusBadge → VisitTypeBadge → FormModal

### الخطوة 6: الصفحات
Dashboard → Tasks → TaskArchive → Notes → NoteArchive → Visits → Clients → Technicians → CallLog → Settings

### الخطوة 7: Router
```typescript
// app/App.tsx — HashRouter أفضل مع Electron
<HashRouter>
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
</HashRouter>
```

---

## ⚠️ قواعد مهمة

1. **كل قراءة/كتابة SQLite** تمر عبر Conveyor فقط
2. **RTL بالكامل** — ضع `dir="rtl"` على `<html>`
3. **استخدم Shadcn components** — Dialog, Select, Input, Badge, Button
4. **TypeScript strict** — لا `any` إطلاقاً
5. **Form validation** — تحقق من الحقول المطلوبة قبل الحفظ
6. **Error states** — رسالة واضحة عند فشل أي عملية
7. **Empty states** — رسالة + أيقونة + زر إضافة عند القوائم الفارغة
8. **Loading states** — skeleton أو spinner عند جلب البيانات
9. **تأكيد الحذف** — ConfirmDialog قبل أي حذف
10. **التواريخ** — استخدم `date-fns/ar` لعرض التواريخ بالعربية
11. **الأرشفة التلقائية** — تُشغَّل عند بدء التطبيق بدون تدخل المستخدم

---

## 🎯 أولويات التطوير

```
المرحلة 1 — الجوهر:
  ✅ قاعدة البيانات + Conveyor
  ✅ Layout + Sidebar + Router
  ✅ المهام (Kanban + أرشيف)
  ✅ الملاحظات (Kanban + أرشيف)

المرحلة 2 — العمليات الميدانية:
  ✅ الزيارات (الصفحة الرئيسية الموحدة)
  ✅ العملاء (مبسّطة)
  ✅ الفنيون

المرحلة 3 — التكامل:
  ✅ لوحة التحكم Dashboard
  ✅ سجل الاتصالات
  ✅ الإعدادات
```

---

*VisionTrack v1.1 — نظام إدارة وكيل كاميرات المراقبة*
*آخر تحديث: دمج الصيانة والتركيب والمسح الميداني في صفحة الزيارات الموحدة + تبسيط صفحة العملاء + إضافة نظام الأرشفة*
