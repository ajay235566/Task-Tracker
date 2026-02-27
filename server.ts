import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Database setup
const db = new Database('tasks.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    reminderSent INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0
  );
`);

// Initialize user profile if not exists
const profile = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
if (!profile) {
  db.prepare('INSERT INTO user_profile (id, name, email) VALUES (1, ?, ?)').run('Ajay', 'ajay@example.com');
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// API Routes
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all();
  res.json(tasks.map((t: any) => ({ ...t, reminderSent: !!t.reminderSent })));
});

app.post('/api/tasks', (req, res) => {
  const { id, title, description, status, priority, dueDate, createdAt } = req.body;
  db.prepare(`
    INSERT INTO tasks (id, title, description, status, priority, dueDate, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, description, status, priority, dueDate, createdAt);
  res.status(201).json({ success: true });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?
    WHERE id = ?
  `).run(title, description, status, priority, dueDate, id);
  res.json({ success: true });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ success: true });
});

app.get('/api/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const { name, email, level, xp } = req.body;
  db.prepare('UPDATE user_profile SET name = ?, email = ?, level = ?, xp = ? WHERE id = 1')
    .run(name, email, level, xp);
  res.json({ success: true });
});

app.post('/api/test-email', async (req, res) => {
  const profile = db.prepare('SELECT email, name FROM user_profile WHERE id = 1').get() as any;
  
  if (!profile || !profile.email) {
    return res.status(400).json({ error: 'No profile email found' });
  }

  if (!process.env.SMTP_USER) {
    return res.status(400).json({ error: 'SMTP not configured in .env' });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Vibrant Tasker" <reminders@example.com>',
      to: profile.email,
      subject: 'Test Reminder from Vibrant Tasker',
      text: `Hi ${profile.name},\n\nThis is a test email to verify your reminder settings.\n\nHappy tasking!`,
      html: `<h1>Test Reminder</h1><p>Hi ${profile.name},</p><p>This is a test email to verify your reminder settings.</p>`,
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Background job for reminders
setInterval(async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Find tasks due today or tomorrow that haven't had a reminder sent
    const tasksToRemind = db.prepare(`
      SELECT * FROM tasks 
      WHERE dueDate <= ? AND status != 'done' AND reminderSent = 0
    `).all(tomorrowStr);

    const profile = db.prepare('SELECT email, name FROM user_profile WHERE id = 1').get() as any;

    if (tasksToRemind.length > 0 && profile && profile.email && process.env.SMTP_USER) {
      for (const task of tasksToRemind as any) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Vibrant Tasker" <reminders@example.com>',
            to: profile.email,
            subject: `Reminder: Task "${task.title}" is due soon!`,
            text: `Hi ${profile.name},\n\nThis is a reminder that your task "${task.title}" is due on ${task.dueDate}.\n\nDescription: ${task.description}\nPriority: ${task.priority}\n\nKeep up the great work!\n- Vibrant Tasker`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 4px solid #0f172a; border-radius: 12px;">
                <h1 style="margin-top: 0;">Task Reminder</h1>
                <p>Hi <strong>${profile.name}</strong>,</p>
                <p>This is a reminder that your task <strong>"${task.title}"</strong> is due on <strong>${task.dueDate}</strong>.</p>
                <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Description:</strong> ${task.description}</p>
                  <p style="margin: 5px 0 0 0;"><strong>Priority:</strong> ${task.priority.toUpperCase()}</p>
                </div>
                <p>Keep up the great work!</p>
                <p style="color: #64748b; font-size: 12px;">- Vibrant Tasker Team</p>
              </div>
            `,
          });

          db.prepare('UPDATE tasks SET reminderSent = 1 WHERE id = ?').run(task.id);
          console.log(`Reminder sent for task: ${task.title} to ${profile.email}`);
        } catch (mailError) {
          console.error('Failed to send email:', mailError);
        }
      }
    }
  } catch (err) {
    console.error('Reminder job error:', err);
  }
}, 60000); // Check every minute

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
