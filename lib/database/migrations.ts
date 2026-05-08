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
      created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at   TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at   TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at       TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at       TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at      TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
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
      created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
};
