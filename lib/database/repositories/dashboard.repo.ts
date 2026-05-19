import { getDb } from '../db';

export const dashboardRepo = {
  getDashboardData: () => {
    const db = getDb();
    // 1. Today Visits Count
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = db.prepare('SELECT count(*) as count FROM visits WHERE date(visit_date) = ?').get(today) as { count: number };

    // 2. Scheduled Maintenance Count
    const scheduledMaintenance = db.prepare('SELECT count(*) as count FROM visits WHERE visit_type = ? AND status = ?').get('maintenance', 'scheduled') as { count: number };

    // 3. Pending Tasks Count
    const pendingTasks = db.prepare('SELECT count(*) as count FROM tasks WHERE status = ? AND archived_at IS NULL').get('pending') as { count: number };

    // 4. Total Clients Count
    const totalClients = db.prepare('SELECT count(*) as count FROM clients').get() as { count: number };

    // 5. Weekly Visits Chart (Last 7 Days)
    const weeklyVisitsChart = db.prepare(`
      SELECT date(visit_date) as day, visit_type as type, count(*) as count 
      FROM visits 
      WHERE date(visit_date) >= date('now', '-7 days') 
      GROUP BY date(visit_date), visit_type
      ORDER BY date(visit_date) ASC
    `).all();

    // 6. Today Visits
    const todayVisitsList = db.prepare('SELECT * FROM visits WHERE date(visit_date) = ? ORDER BY visit_time ASC').all(today);

    // 7. Urgent Tasks
    const urgentTasks = db.prepare('SELECT * FROM tasks WHERE status != ? AND priority = ? AND archived_at IS NULL LIMIT 5').all('done', 'urgent');

    // 8. Pending Followup Calls
    const pendingFollowupCalls = db.prepare('SELECT * FROM call_logs WHERE requires_followup = 1 AND followup_done = 0 ORDER BY followup_date ASC LIMIT 5').all();

    return {
      todayVisitsCount: todayVisits.count,
      scheduledMaintenanceCount: scheduledMaintenance.count,
      pendingTasksCount: pendingTasks.count,
      totalClientsCount: totalClients.count,
      weeklyVisitsChart,
      todayVisits: todayVisitsList,
      urgentTasks,
      pendingFollowupCalls,
    };
  }
};
