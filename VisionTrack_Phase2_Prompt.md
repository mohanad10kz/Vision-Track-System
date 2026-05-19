# VisionTrack — Phase 2 Prompt
> تهيئة الأرشفة + صفحتا الأرشيف + المرحلة الثانية كاملة

---

## ⚠️ السياق الحالي

- صفحتا المهام والملاحظات (Kanban) مكتملتان وتعملان
- قاعدة البيانات موجودة لكن **بدون عمود `archived_at`** في جدولي `tasks` و`notes`
- يجب إضافة العمود بأمان بدون حذف البيانات الموجودة

---

## الخطوة 1: Migration — إضافة عمود archived_at

### في ملف `lib/database/migrations.ts`

لا تحذف الجداول الموجودة. أضف دالة migration منفصلة تُشغَّل بعد `createTables`:

```typescript
// أضف هذه الدالة في نهاية migrations.ts
export const runMigrations = (db: Database) => {

  // Migration 001 — إضافة archived_at لجدول tasks
  const tasksColumns = db.pragma('table_info(tasks)') as { name: string }[]
  const hasArchivedAtTasks = tasksColumns.some(col => col.name === 'archived_at')
  if (!hasArchivedAtTasks) {
    db.exec(`ALTER TABLE tasks ADD COLUMN archived_at TEXT DEFAULT NULL;`)
    console.log('[Migration] tasks: archived_at column added')
  }

  // Migration 002 — إضافة archived_at لجدول notes
  const notesColumns = db.pragma('table_info(notes)') as { name: string }[]
  const hasArchivedAtNotes = notesColumns.some(col => col.name === 'archived_at')
  if (!hasArchivedAtNotes) {
    db.exec(`ALTER TABLE notes ADD COLUMN archived_at TEXT DEFAULT NULL;`)
    console.log('[Migration] notes: archived_at column added')
  }
}
```

### في ملف `lib/database/db.ts`

استدعِ `runMigrations` بعد `createTables` مباشرة:

```typescript
import { createTables, runMigrations } from './migrations'

const initDatabase = () => {
  const db = getDb()
  createTables(db)
  runMigrations(db)   // ← أضف هذا السطر
  return db
}
```

---

## الخطوة 2: منطق الأرشفة التلقائية

### في `lib/database/repositories/tasks.repo.ts`

أضف هاتين الدالتين:

```typescript
// تأرشف المهام المكتملة التي مضى عليها أكثر من 7 أيام
export const archiveOldDoneTasks = (db: Database): number => {
  const result = db.prepare(`
    UPDATE tasks
    SET archived_at = datetime('now')
    WHERE status = 'done'
      AND archived_at IS NULL
      AND updated_at < datetime('now', '-7 days')
  `).run()
  return result.changes
}

// جلب المهام النشطة فقط (غير المؤرشفة)
export const getActiveTasks = (db: Database): Task[] => {
  return db.prepare(`
    SELECT * FROM tasks
    WHERE archived_at IS NULL
    ORDER BY position ASC, created_at DESC
  `).all() as Task[]
}

// جلب المهام المؤرشفة مع فلترة بالتاريخ
export const getArchivedTasks = (
  db: Database,
  filter: { from?: string; to?: string; search?: string }
): Task[] => {
  let query = `SELECT * FROM tasks WHERE archived_at IS NOT NULL`
  const params: string[] = []

  if (filter.from) {
    query += ` AND created_at >= ?`
    params.push(filter.from)
  }
  if (filter.to) {
    query += ` AND created_at <= ?`
    params.push(filter.to + ' 23:59:59')
  }
  if (filter.search) {
    query += ` AND title LIKE ?`
    params.push(`%${filter.search}%`)
  }

  query += ` ORDER BY archived_at DESC`
  return db.prepare(query).all(...params) as Task[]
}
```

### نفس الدوال بالضبط في `lib/database/repositories/notes.repo.ts` — غيّر `tasks` بـ `notes`

### في `lib/database/db.ts` أو `lib/main/app.ts`

شغّل الأرشفة التلقائية عند بدء التطبيق:

```typescript
import { archiveOldDoneTasks } from './database/repositories/tasks.repo'
import { archiveOldDoneNotes } from './database/repositories/notes.repo'

// بعد initDatabase():
const archived = archiveOldDoneTasks(db)
const archivedNotes = archiveOldDoneNotes(db)
console.log(`[Startup] Archived ${archived} tasks, ${archivedNotes} notes`)
```

---

## الخطوة 3: تحديث الـ Repository والـ Hook الموجودَين

### تحديث `tasks.repo.ts` — دالة getAll الموجودة

```typescript
// غيّر الدالة الموجودة لتجلب النشطة فقط
export const getAllTasks = (db: Database): Task[] => {
  return db.prepare(`
    SELECT * FROM tasks
    WHERE archived_at IS NULL
    ORDER BY position ASC, created_at DESC
  `).all() as Task[]
}
```

### تحديث `app/hooks/use-tasks.ts`

أضف في الـ return:
```typescript
// Done يعرض آخر 7 أيام فقط في الـ Kanban
done: tasks.filter(t =>
  t.status === 'done' &&
  differenceInDays(new Date(), new Date(t.updated_at)) <= 7
),
```

---

## الخطوة 4: صفحة أرشيف المهام

**المسار**: `/tasks/archive`
**الملف**: `app/pages/TaskArchive.tsx`

### التخطيط الكامل:

```
┌─────────────────────────────────────────────────────┐
│  📁 أرشيف المهام              [← العودة للمهام]     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [هذا الأسبوع] [هذا الشهر] [3 أشهر] [كل الوقت]    │
│                                                      │
│  من [__/__/__] إلى [__/__/__]   [بحث بالعنوان...]   │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  12 مهمة مؤرشفة                                     │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✓  شراء كاميرات من المستودع    [مكتمل]       │  │
│  │    أُنشئت: 2 مايو 2026   أُنجزت: 8 مايو 2026 │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ ✓  التواصل مع الشركة بخصوص الشحنة  [مكتمل]  │  │
│  │    أُنشئت: 1 مايو 2026   أُنجزت: 5 مايو 2026 │  │
│  └──────────────────────────────────────────────┘  │
│  ...                                                │
└─────────────────────────────────────────────────────┘
```

### الكود الكامل للصفحة:

```tsx
// app/pages/TaskArchive.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, subDays, subMonths, startOfWeek } from 'date-fns'
import { ar } from 'date-fns/locale'
import { ArrowRight, Archive, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/app/components/shared/PageHeader'
import { SearchInput } from '@/app/components/shared/SearchInput'
import { EmptyState } from '@/app/components/shared/EmptyState'
import { useConveyor } from '@/app/hooks/use-conveyor'
import type { Task } from '@/app/types'

type DateFilter = 'week' | 'month' | '3months' | 'all'

export default function TaskArchive() {
  const navigate = useNavigate()
  const { getArchivedTasks } = useConveyor('db')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>('month')
  const [search, setSearch] = useState('')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const getDateRange = (filter: DateFilter) => {
    const now = new Date()
    switch (filter) {
      case 'week':    return { from: format(startOfWeek(now), 'yyyy-MM-dd'), to: '' }
      case 'month':   return { from: format(subDays(now, 30), 'yyyy-MM-dd'), to: '' }
      case '3months': return { from: format(subMonths(now, 3), 'yyyy-MM-dd'), to: '' }
      case 'all':     return { from: '', to: '' }
    }
  }

  const load = async () => {
    setLoading(true)
    const range = dateFilter === 'all' && customFrom
      ? { from: customFrom, to: customTo }
      : getDateRange(dateFilter)
    const data = await getArchivedTasks({ ...range, search })
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [dateFilter, search, customFrom, customTo])

  const filterButtons: { key: DateFilter; label: string }[] = [
    { key: 'week',    label: 'هذا الأسبوع' },
    { key: 'month',   label: 'هذا الشهر'   },
    { key: '3months', label: '3 أشهر'       },
    { key: 'all',     label: 'كل الوقت'    },
  ]

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <PageHeader
        title="أرشيف المهام"
        description="المهام المكتملة المؤرشفة"
        icon={<Archive size={20} />}
        action={
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight size={16} />
            العودة للمهام
          </button>
        }
      />

      {/* فلاتر التاريخ */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => setDateFilter(btn.key)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              dateFilter === btn.key
                ? 'bg-brand text-white'
                : 'bg-surface text-muted-foreground hover:bg-hover border border-border'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* date range + بحث */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>من</span>
          <input
            type="date"
            value={customFrom}
            onChange={e => { setCustomFrom(e.target.value); setDateFilter('all') }}
            className="bg-surface border border-border rounded-md px-2 py-1 text-sm"
          />
          <span>إلى</span>
          <input
            type="date"
            value={customTo}
            onChange={e => { setCustomTo(e.target.value); setDateFilter('all') }}
            className="bg-surface border border-border rounded-md px-2 py-1 text-sm"
          />
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="بحث بعنوان المهمة..."
          className="flex-1 max-w-xs"
        />
      </div>

      {/* العدد */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {tasks.length} مهمة مؤرشفة
        </p>
      )}

      {/* القائمة */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<Archive size={40} />}
          title="لا توجد مهام مؤرشفة"
          description="المهام المكتملة ستظهر هنا بعد 7 أيام من اكتمالها"
        />
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg hover:border-brand/30 transition-colors"
            >
              <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-mono">
                  <span>
                    أُنشئت: {format(new Date(task.created_at), 'd MMM yyyy', { locale: ar })}
                  </span>
                  <span>·</span>
                  <span>
                    أُنجزت: {format(new Date(task.updated_at), 'd MMM yyyy', { locale: ar })}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 shrink-0">
                مكتمل
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## الخطوة 5: صفحة أرشيف الملاحظات

**المسار**: `/notes/archive`
**الملف**: `app/pages/NoteArchive.tsx`

مطابقة تماماً لـ `TaskArchive.tsx` مع هذه الفروق فقط:

```typescript
// غيّر:
const { getArchivedNotes } = useConveyor('db')     // بدلاً من getArchivedTasks
const [notes, setNotes] = useState<Note[]>([])      // بدلاً من Task[]

// العنوان: "أرشيف الملاحظات"
// navigate('/notes') بدلاً من navigate('/tasks')
// رسالة EmptyState: "الملاحظات المكتملة ستظهر هنا بعد 7 أيام"

// في بطاقة الملاحظة أضف نقطة ملونة بلون الملاحظة:
<div
  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
  style={{ backgroundColor: note.color }}
/>
```

---

## الخطوة 6: تحديث Router و Sidebar

### في `app/App.tsx` — أضف المسارين:
```tsx
<Route path="/tasks/archive" element={<TaskArchive />} />
<Route path="/notes/archive" element={<NoteArchive />} />
```

### في `app/components/shared/Sidebar.tsx` — حدّث قائمة التنقل:
```typescript
const navItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم',     path: '/'              },
  { icon: CheckSquare,     label: 'المهام',            path: '/tasks'         },
  { icon: Archive,         label: 'أرشيف المهام',      path: '/tasks/archive', indent: true },
  { icon: FileText,        label: 'الملاحظات',         path: '/notes'         },
  { icon: Archive,         label: 'أرشيف الملاحظات',   path: '/notes/archive', indent: true },
  { icon: Calendar,        label: 'الزيارات',          path: '/visits'        },
  { icon: Users,           label: 'العملاء',            path: '/clients'       },
  { icon: HardHat,         label: 'الفنيون',            path: '/technicians'   },
  { icon: Phone,           label: 'سجل الاتصالات',     path: '/calls'         },
]

// عناصر indent تظهر بـ: mr-4 text-xs opacity-75
// وبخط أرفع من عناصر القائمة الرئيسية
```

---

## ======================================================
## المرحلة الثانية — بناء صفحات العمليات الميدانية
## ======================================================

---

## صفحة الزيارات — Visits ⭐

**المسار**: `/visits`
**الملف**: `app/pages/Visits.tsx`

### الجدول في قاعدة البيانات

إذا لم يكن موجوداً، أضفه في `migrations.ts`:

```sql
CREATE TABLE IF NOT EXISTS visits (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id        INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  client_name      TEXT NOT NULL,
  client_phone     TEXT NOT NULL,
  client_address   TEXT,
  visit_type       TEXT NOT NULL,
  -- 'installation' | 'maintenance' | 'survey' | 'followup'
  visit_date       TEXT NOT NULL,
  visit_time       TEXT,
  technician_id    INTEGER REFERENCES technicians(id) ON DELETE SET NULL,
  technician_name  TEXT,
  status           TEXT DEFAULT 'scheduled',
  -- 'scheduled' | 'completed' | 'cancelled' | 'postponed'
  problem_type     TEXT,
  problem_desc     TEXT,
  camera_count     INTEGER,
  system_type      TEXT,
  priority         TEXT DEFAULT 'medium',
  notes            TEXT,
  resolution_notes TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Repository — `lib/database/repositories/visits.repo.ts`

```typescript
// جلب كل الزيارات مع فلترة اختيارية
export const getVisits = (
  db: Database,
  filter?: { type?: string; status?: string; technicianId?: number; from?: string; to?: string }
): Visit[] => {
  let query = `SELECT * FROM visits WHERE 1=1`
  const params: (string | number)[] = []

  if (filter?.type)         { query += ` AND visit_type = ?`;       params.push(filter.type)         }
  if (filter?.status)       { query += ` AND status = ?`;           params.push(filter.status)       }
  if (filter?.technicianId) { query += ` AND technician_id = ?`;    params.push(filter.technicianId) }
  if (filter?.from)         { query += ` AND visit_date >= ?`;      params.push(filter.from)         }
  if (filter?.to)           { query += ` AND visit_date <= ?`;      params.push(filter.to)           }

  query += ` ORDER BY visit_date ASC, visit_time ASC`
  return db.prepare(query).all(...params) as Visit[]
}

export const createVisit   = (db: Database, data: CreateVisitInput): Visit => { ... }
export const updateVisit   = (db: Database, id: number, data: UpdateVisitInput): Visit => { ... }
export const deleteVisit   = (db: Database, id: number): void => { ... }
export const updateVisitStatus = (
  db: Database,
  id: number,
  status: string,
  resolutionNotes?: string
): void => {
  db.prepare(`
    UPDATE visits
    SET status = ?, resolution_notes = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(status, resolutionNotes ?? null, id)
}
```

### Hook — `app/hooks/use-visits.ts`

```typescript
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

  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  return {
    visits,
    loading,
    today:    visits.filter(v => v.visit_date === today),
    tomorrow: visits.filter(v => v.visit_date === tomorrow),
    upcoming: visits.filter(v => v.visit_date > tomorrow),
    create:   async (input: CreateVisitInput) => { await createVisit(input); await load() },
    update:   async (id: number, input: UpdateVisitInput) => { await updateVisit(id, input); await load() },
    remove:   async (id: number) => { await deleteVisit(id); await load() },
    changeStatus: async (id: number, status: VisitStatus, notes?: string) => {
      await updateVisitStatus(id, status, notes)
      await load()
    }
  }
}
```

### تخطيط الصفحة:

```
┌─────────────────────────────────────────────────────┐
│  📅 الزيارات                    [+ زيارة جديدة]     │
├─────────────────────────────────────────────────────┤
│  [الكل] [🔨 تركيب] [🔧 صيانة] [📍 مسح] [🔄 متابعة]│  ← Type Tabs
├─────────────────────────────────────────────────────┤
│  [بحث...]  [الحالة ▼]  [الفني ▼]                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ◉ اليوم — الثلاثاء 20 مايو  (3 زيارات)            │  ← مُبرز
│  ┌──────────────────────────────────────────────┐  │
│  │ ⏰ 09:00  [🔨 تركيب]  أحمد العمري            │  │
│  │           نظام IP — 6 كاميرات                │  │
│  │           👷 محمد   📍 حي السلماني  [مجدولة] │  │
│  │                                     [···]    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ ⏰ 11:30  [🔧 صيانة]  خالد البشير  [🔴 عاجل]│  │
│  │           كاميرا لا تعمل                     │  │
│  │           👷 علي    📍 شارع الحرية  [مجدولة] │  │
│  │                                     [···]    │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  الغد — الأربعاء 21 مايو  (1 زيارة)                │
│  ┌──────────────────────────────────────────────┐  │
│  │ ⏰ 10:00  [📍 مسح]  شركة النور               │  │
│  │           تقدير 8 كاميرات — NVR              │  │
│  │           👷 أحمد  📍 المنطقة الصناعية       │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  لاحقاً  (2 زيارة)                                  │
│  [...]                                              │
└─────────────────────────────────────────────────────┘
```

### نموذج زيارة جديدة (FormModal ديناميكي):

```
الحقول الثابتة:
  نوع الزيارة*   → [تركيب 🔨] [صيانة 🔧] [مسح 📍] [متابعة 🔄]  ← segmented control
  العميل         → Combobox يبحث في جدول clients
  اسم العميل*    → auto-fill أو يدوي
  رقم الهاتف*    → auto-fill أو يدوي
  العنوان        → auto-fill أو يدوي
  الفني*         → Select من جدول technicians
  التاريخ*       → Date picker
  الوقت          → Time picker
  ملاحظات        → Textarea

حقول إضافية تظهر فقط عند اختيار "تركيب":
  عدد الكاميرات  → Number input
  نوع النظام     → Select: DVR | NVR | IP | Hybrid

حقول إضافية تظهر فقط عند اختيار "صيانة":
  نوع المشكلة*   → Select: كاميرا | DVR/NVR | أسلاك | طاقة | برمجة | أخرى
  وصف المشكلة    → Textarea
  الأولوية*      → Select: منخفضة | متوسطة | عالية | عاجلة

حقول إضافية تظهر فقط عند اختيار "مسح ميداني":
  عدد الكاميرات المقدّر → Number input
  نوع النظام المقترح    → Select: DVR | NVR | IP | Hybrid
```

### تغيير الحالة — Inline:

```
زر [···] بجانب كل زيارة يفتح dropdown:
  ○ مجدولة
  ● مكتملة   ← عند الاختيار يظهر textarea: "ما تم تنفيذه"
  ○ مؤجلة
  ○ ملغاة
```

### VisitTypeBadge Component:

```typescript
const typeConfig = {
  installation: { label: 'تركيب',      icon: Hammer,     color: '#8B5CF6' },
  maintenance:  { label: 'صيانة',       icon: Wrench,     color: '#F59E0B' },
  survey:       { label: 'مسح ميداني', icon: MapPin,     color: '#06B6D4' },
  followup:     { label: 'متابعة',      icon: RefreshCw,  color: '#6B7280' },
}
// يعرض: pill ملون بـ background-color مع opacity 15% وtext بنفس اللون
```

---

## صفحة العملاء — Clients (مبسّطة)

**المسار**: `/clients`
**الملف**: `app/pages/Clients.tsx`

### الجدول:
```sql
CREATE TABLE IF NOT EXISTS clients (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  address    TEXT,
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### التخطيط:
```
┌─────────────────────────────────────────────────────┐
│  👥 العملاء                      [+ عميل جديد]      │
├─────────────────────────────────────────────────────┤
│  [بحث باسم أو رقم هاتف...]                          │
├─────────────────────────────────────────────────────┤
│  23 عميل                                            │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ 👤 أحمد العمري                               │  │
│  │    📞 0922-XXX-XXX                           │  │
│  │    📍 شارع الجمهورية، بنغازي                 │  │
│  │    📝 نظام Hikvision 8 كاميرا IP             │  │
│  │                                    ✎    ✕   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### نموذج عميل جديد:
```
- الاسم*
- رقم الهاتف*
- العنوان
- ملاحظات (نوع النظام، تفاصيل مهمة...)
```

**ملاحظة**: البحث يعمل على الاسم ورقم الهاتف معاً — SQL `LIKE %search%` على كلا الحقلين.

---

## صفحة الفنيون — Technicians

**المسار**: `/technicians`
**الملف**: `app/pages/Technicians.tsx`

### الجدول:
```sql
CREATE TABLE IF NOT EXISTS technicians (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  specialty  TEXT,   -- installation | maintenance | programming | all
  status     TEXT DEFAULT 'available', -- available | busy | off
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### التخطيط:
```
┌─────────────────────────────────────────────────────┐
│  👷 الفنيون                      [+ فني جديد]       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────┐  ┌────────────────┐             │
│  │                │  │                │             │
│  │       م        │  │       ع        │  ← initial  │
│  │   (avatar)     │  │   (avatar)     │             │
│  │                │  │                │             │
│  │  محمد الزروق   │  │  علي العبيدي   │             │
│  │  تركيب         │  │  صيانة         │             │
│  │                │  │                │             │
│  │  ┌──────────┐  │  │  ┌──────────┐  │             │
│  │  │ 🟢 متاح  │  │  │  │🟡 مشغول  │  │  ← select  │
│  │  └──────────┘  │  │  └──────────┘  │             │
│  │                │  │                │             │
│  │  📞 0922...    │  │  📞 0921...    │             │
│  │  زيارات اليوم:2│  │  زيارات اليوم:1│             │
│  │                │  │                │             │
│  │  [تعديل]       │  │  [تعديل]       │             │
│  └────────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────┘
```

**Avatar**: حرف أول من الاسم، لون خلفية فريد لكل فني (من قائمة 8 ألوان ثابتة بناءً على الـ id).

**زيارات اليوم**: `SELECT COUNT(*) FROM visits WHERE technician_id=? AND visit_date=today`

**نموذج فني جديد**:
```
- الاسم*
- رقم الهاتف*
- التخصص: تركيب | صيانة | برمجة | الكل
- ملاحظات
```

---

## قواعد خاصة بالمرحلة الثانية

1. **Combobox العملاء** في نموذج الزيارة — عند الكتابة يبحث في `clients` ويُعبئ الحقول تلقائياً، لكن يسمح بالإدخال اليدوي لو العميل غير مسجل
2. **النموذج الديناميكي للزيارات** — استخدم conditional rendering بناءً على `visitType` المختار، والحقول الإضافية تظهر بـ animation (framer-motion)
3. **تجميع الزيارات** — الصفحة تعرض الزيارات مجمّعة حسب التاريخ (اليوم / الغد / لاحقاً) وليس كقائمة مسطحة
4. **تحديث حالة الفني تلقائياً** — عند إضافة زيارة بتاريخ اليوم يتغير status الفني إلى 'busy' تلقائياً
5. **empty state للتصفية** — إذا لم تجد نتائج للـ tab المختار، اعرض رسالة تخص هذا النوع تحديداً

---

## ترتيب التنفيذ للمرحلة الثانية

```
1. runMigrations (إضافة archived_at) ← أول خطوة لازمة
2. تحديث getActiveTasks و getActiveNotes في الـ repositories
3. إضافة الدوال archive* في الـ repositories
4. تحديث Conveyor (handlers + api + schemas) للدوال الجديدة
5. تحديث use-tasks و use-notes hooks
6. بناء TaskArchive.tsx
7. بناء NoteArchive.tsx
8. تحديث Router و Sidebar
9. إنشاء جداول visits و clients و technicians (إذا غير موجودة)
10. بناء visits.repo.ts + clients.repo.ts + technicians.repo.ts
11. تحديث Conveyor للـ repositories الجديدة
12. بناء use-visits + use-clients + use-technicians hooks
13. بناء Visits.tsx (الأكبر والأهم)
14. بناء Clients.tsx
15. بناء Technicians.tsx
```

---

*VisionTrack Phase 2 — الأرشفة + الزيارات + العملاء + الفنيون*
