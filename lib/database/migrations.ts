import { Database } from 'better-sqlite3';

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
      archived_at TEXT DEFAULT NULL,               -- null = نشطة، تاريخ = مؤرشفة
      created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      archived_at TEXT DEFAULT NULL,               -- null = نشطة، تاريخ = مؤرشفة
      created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // جدول مجموعات الفنيين
  db.exec(`
    CREATE TABLE IF NOT EXISTS tech_groups (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      group_id   INTEGER REFERENCES tech_groups(id) ON DELETE SET NULL,
      last_install_assigned_at TEXT DEFAULT NULL,
      last_maint_assigned_at   TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);


  // جدول الزيارات الميدانية — موحد لجميع الأنواع
  db.exec(`
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
      archived_at      TEXT DEFAULT NULL,
      created_at       TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at       TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at        TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
};

// Migrations — تُشغَّل بعد createTables لإضافة أعمدة جديدة بأمان
export const runMigrations = (db: Database) => {

  // Migration 001 — إضافة archived_at لجدول tasks
  const tasksColumns = db.pragma('table_info(tasks)') as { name: string }[];
  const hasArchivedAtTasks = tasksColumns.some(col => col.name === 'archived_at');
  if (!hasArchivedAtTasks) {
    db.exec(`ALTER TABLE tasks ADD COLUMN archived_at TEXT DEFAULT NULL;`);
    console.log('[Migration] tasks: archived_at column added');
  }

  // Migration 002 — إضافة archived_at لجدول notes
  const notesColumns = db.pragma('table_info(notes)') as { name: string }[];
  const hasArchivedAtNotes = notesColumns.some(col => col.name === 'archived_at');
  if (!hasArchivedAtNotes) {
    db.exec(`ALTER TABLE notes ADD COLUMN archived_at TEXT DEFAULT NULL;`);
    console.log('[Migration] notes: archived_at column added');
  }

  // Migration 003 — إضافة client_phone لجدول visits إذا لم يكن موجوداً
  const visitsColumns = db.pragma('table_info(visits)') as { name: string }[];
  const hasClientPhone = visitsColumns.some(col => col.name === 'client_phone');
  if (!hasClientPhone) {
    db.exec(`ALTER TABLE visits ADD COLUMN client_phone TEXT NOT NULL DEFAULT '';`);
    console.log('[Migration] visits: client_phone column added');
  }

  // Migration 004 — إضافة الأعمدة المفصّلة للزيارات إذا لم تكن موجودة
  const visitColNames = visitsColumns.map(c => c.name);
  if (!visitColNames.includes('problem_type')) {
    db.exec(`ALTER TABLE visits ADD COLUMN problem_type TEXT;`);
  }
  if (!visitColNames.includes('problem_desc')) {
    db.exec(`ALTER TABLE visits ADD COLUMN problem_desc TEXT;`);
  }
  if (!visitColNames.includes('camera_count')) {
    db.exec(`ALTER TABLE visits ADD COLUMN camera_count INTEGER;`);
  }
  if (!visitColNames.includes('system_type')) {
    db.exec(`ALTER TABLE visits ADD COLUMN system_type TEXT;`);
  }
  if (!visitColNames.includes('priority')) {
    db.exec(`ALTER TABLE visits ADD COLUMN priority TEXT DEFAULT 'medium';`);
  }
  if (!visitColNames.includes('resolution_notes')) {
    db.exec(`ALTER TABLE visits ADD COLUMN resolution_notes TEXT;`);
  }
  if (!visitColNames.includes('technician_name')) {
    db.exec(`ALTER TABLE visits ADD COLUMN technician_name TEXT;`);
  }
  if (!visitColNames.includes('archived_at')) {
    db.exec(`ALTER TABLE visits ADD COLUMN archived_at TEXT DEFAULT NULL;`);
    console.log('[Migration] visits: archived_at column added');
  }

  // Migration 005 — إضافة أعمدة المجموعات والطابور لجدول technicians
  const techColumns = db.pragma('table_info(technicians)') as { name: string }[];
  const techColNames = techColumns.map(c => c.name);
  if (!techColNames.includes('group_id')) {
    db.exec(`ALTER TABLE technicians ADD COLUMN group_id INTEGER REFERENCES tech_groups(id) ON DELETE SET NULL;`);
    console.log('[Migration] technicians: group_id column added');
  }
  if (!techColNames.includes('last_install_assigned_at')) {
    db.exec(`ALTER TABLE technicians ADD COLUMN last_install_assigned_at TEXT DEFAULT NULL;`);
    console.log('[Migration] technicians: last_install_assigned_at column added');
  }
  if (!techColNames.includes('last_maint_assigned_at')) {
    db.exec(`ALTER TABLE technicians ADD COLUMN last_maint_assigned_at TEXT DEFAULT NULL;`);
    console.log('[Migration] technicians: last_maint_assigned_at column added');
  }
};
