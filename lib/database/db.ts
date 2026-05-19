import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import { createTables, runMigrations } from './migrations';

let db: Database.Database | null = null;

export const initDb = () => {
  if (db) return db;

  // Use the user data path to ensure the db is preserved across updates
  const dbPath = path.join(app.getPath('userData'), 'visiontrack.db');
  
  db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Run schema creation
  createTables(db);

  // Run safe migrations (adds new columns without deleting data)
  runMigrations(db);

  return db;
};

export const getDb = () => {
  if (!db) {
    return initDb();
  }
  return db;
};
