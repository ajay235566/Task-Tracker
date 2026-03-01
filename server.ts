import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'vibrant-tasker-jwt-secret-stable-123';

app.set('trust proxy', 1); // trust first proxy
app.use(express.json());

// Database setup
const db = new Database('tasks.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    reminderSent INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    summary TEXT,
    experiences TEXT, -- JSON string
    education TEXT, -- JSON string
    skills TEXT, -- JSON string
    projects TEXT, -- JSON string
    templateId TEXT NOT NULL,
    fontFamily TEXT NOT NULL,
    fontSize INTEGER NOT NULL,
    margin INTEGER NOT NULL,
    sectionSpacing INTEGER NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Migration: Add user_id to tasks if it doesn't exist (for existing databases)
const tableInfo = db.prepare("PRAGMA table_info(tasks)").all() as any[];
const hasUserId = tableInfo.some(col => col.name === 'user_id');
if (!hasUserId) {
  try {
    db.exec('ALTER TABLE tasks ADD COLUMN user_id TEXT');
    console.log('Migration: Added user_id column to tasks table');
  } catch (err) {
    console.error('Migration failed (user_id):', err);
  }
}

const hasReminderSent = tableInfo.some(col => col.name === 'reminderSent');
if (!hasReminderSent) {
  try {
    db.exec('ALTER TABLE tasks ADD COLUMN reminderSent INTEGER DEFAULT 0');
    console.log('Migration: Added reminderSent column to tasks table');
  } catch (err) {
    console.error('Migration failed (reminderSent):', err);
  }
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

// Auth Middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    db.prepare('INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(userId, name, email, hashedPassword, createdAt);
    
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ id: userId, name, email, token });
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ id: user.id, name: user.name, email: user.email, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/auth/me', (req: any, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.prepare('SELECT id, name, email, level, xp FROM users WHERE id = ?').get(decoded.userId) as any;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Task Routes (User Specific)
app.get('/api/tasks', isAuthenticated, (req: any, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY createdAt DESC').all(req.userId);
  res.json(tasks.map((t: any) => ({ ...t, reminderSent: !!t.reminderSent })));
});

app.post('/api/tasks', isAuthenticated, (req: any, res) => {
  const { id, title, description, status, priority, dueDate, createdAt } = req.body;
  db.prepare(`
    INSERT INTO tasks (id, user_id, title, description, status, priority, dueDate, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.userId, title, description, status, priority, dueDate, createdAt);
  res.status(201).json({ success: true });
});

app.put('/api/tasks/:id', isAuthenticated, (req: any, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?
    WHERE id = ? AND user_id = ?
  `).run(title, description, status, priority, dueDate, id, req.userId);
  res.json({ success: true });
});

app.delete('/api/tasks/:id', isAuthenticated, (req: any, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, req.userId);
  res.json({ success: true });
});

app.put('/api/profile', isAuthenticated, (req: any, res) => {
  const { name, email, level, xp } = req.body;
  db.prepare('UPDATE users SET name = ?, email = ?, level = ?, xp = ? WHERE id = ?')
    .run(name, email, level, xp, req.userId);
  res.json({ success: true });
});

// Resume Routes
app.get('/api/resumes', isAuthenticated, (req: any, res) => {
  const resumes = db.prepare('SELECT * FROM resumes WHERE user_id = ? ORDER BY updatedAt DESC').all(req.userId);
  res.json(resumes.map((r: any) => ({
    ...r,
    experiences: JSON.parse(r.experiences || '[]'),
    education: JSON.parse(r.education || '[]'),
    skills: JSON.parse(r.skills || '[]'),
    projects: JSON.parse(r.projects || '[]')
  })));
});

app.post('/api/resumes', isAuthenticated, (req: any, res) => {
  const { 
    id, fullName, email, phone, location, summary, 
    experiences, education, skills, projects, 
    templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt 
  } = req.body;
  
  db.prepare(`
    INSERT INTO resumes (
      id, user_id, fullName, email, phone, location, summary, 
      experiences, education, skills, projects, 
      templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, req.userId, fullName, email, phone, location, summary, 
    JSON.stringify(experiences), JSON.stringify(education), 
    JSON.stringify(skills), JSON.stringify(projects), 
    templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt
  );
  res.status(201).json({ success: true });
});

app.put('/api/resumes/:id', isAuthenticated, (req: any, res) => {
  const { id } = req.params;
  const { 
    fullName, email, phone, location, summary, 
    experiences, education, skills, projects, 
    templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt 
  } = req.body;
  
  db.prepare(`
    UPDATE resumes SET 
      fullName = ?, email = ?, phone = ?, location = ?, summary = ?, 
      experiences = ?, education = ?, skills = ?, projects = ?, 
      templateId = ?, fontFamily = ?, fontSize = ?, margin = ?, sectionSpacing = ?, updatedAt = ?
    WHERE id = ? AND user_id = ?
  `).run(
    fullName, email, phone, location, summary, 
    JSON.stringify(experiences), JSON.stringify(education), 
    JSON.stringify(skills), JSON.stringify(projects), 
    templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt,
    id, req.userId
  );
  res.json({ success: true });
});

app.delete('/api/resumes/:id', isAuthenticated, (req: any, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(id, req.userId);
  res.json({ success: true });
});

app.post('/api/test-email', isAuthenticated, async (req: any, res) => {
  const user = db.prepare('SELECT email, name FROM users WHERE id = ?').get(req.userId) as any;
  
  if (!user || !user.email) {
    return res.status(400).json({ error: 'No user email found' });
  }

  if (!process.env.SMTP_USER) {
    return res.status(400).json({ error: 'SMTP not configured in .env' });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Vibrant Tasker" <reminders@example.com>',
      to: user.email,
      subject: 'Test Reminder from Vibrant Tasker',
      text: `Hi ${user.name},\n\nThis is a test email to verify your reminder settings.\n\nHappy tasking!`,
      html: `<h1>Test Reminder</h1><p>Hi ${user.name},</p><p>This is a test email to verify your reminder settings.</p>`,
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
      SELECT t.*, u.email, u.name as user_name 
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.dueDate <= ? AND t.status != 'done' AND t.reminderSent = 0
    `).all(tomorrowStr) as any[];

    if (tasksToRemind.length > 0 && process.env.SMTP_USER) {
      for (const task of tasksToRemind) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Vibrant Tasker" <reminders@example.com>',
            to: task.email,
            subject: `Reminder: Task "${task.title}" is due soon!`,
            text: `Hi ${task.user_name},\n\nThis is a reminder that your task "${task.title}" is due on ${task.dueDate}.\n\nDescription: ${task.description}\nPriority: ${task.priority}\n\nKeep up the great work!\n- Vibrant Tasker`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 4px solid #0f172a; border-radius: 12px;">
                <h1 style="margin-top: 0;">Task Reminder</h1>
                <p>Hi <strong>${task.user_name}</strong>,</p>
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
          console.log(`Reminder sent for task: ${task.title} to ${task.email}`);
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
