import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'vibrant-tasker-jwt-secret-stable-123';

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('MISSING SUPABASE CREDENTIALS. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to check supabase
const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }
  return supabase;
};

app.set('trust proxy', 1); // trust first proxy
app.use(express.json());

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    supabaseConfigured: !!supabase,
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

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
    
    const { error } = await getSupabase()
      .from('users')
      .insert([{ id: userId, name, email, password: hashedPassword, createdAt }]);

    if (error) throw error;
    
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ id: userId, name, email, token });
  } catch (err: any) {
    if (err.code === '23505') { // Postgres unique constraint error
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const { data: user, error } = await getSupabase()
      .from('users')
      .select('id, name, email')
      .eq('email', email)
      .single();

    if (!user) {
      // Don't reveal if user exists or not for security, but for this app we can be more helpful
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = Math.random().toString(36).substr(2, 15);
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    const { error: tokenError } = await getSupabase()
      .from('users')
      .update({ resetToken, resetTokenExpires: expiresAt })
      .eq('id', user.id);

    if (tokenError) throw tokenError;

    if (process.env.SMTP_USER) {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const resetLink = `${appUrl}?resetToken=${resetToken}`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Vibrant Tasker" <auth@example.com>',
        to: user.email,
        subject: 'Reset Your Password - Vibrant Tasker',
        text: `Hi ${user.name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 4px solid #0f172a; border-radius: 12px;">
            <h1 style="margin-top: 0;">Password Reset</h1>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>You requested a password reset for your Vibrant Tasker account.</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 2px solid #0f172a; box-shadow: 4px 4px 0px 0px #0f172a;">Reset Password</a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #64748b; font-size: 12px;">- Vibrant Tasker Team</p>
          </div>
        `,
      });
    } else {
      console.log('SMTP not configured. Reset Token:', resetToken);
    }

    res.json({ success: true, message: 'Reset link sent to your email' });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const { data: user, error } = await getSupabase()
      .from('users')
      .select('id')
      .eq('resetToken', token)
      .gt('resetTokenExpires', new Date().toISOString())
      .single();

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: updateError } = await getSupabase()
      .from('users')
      .update({ 
        password: hashedPassword, 
        resetToken: null, 
        resetTokenExpires: null 
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err: any) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error } = await getSupabase()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ id: user.id, name: user.name, email: user.email, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/auth/me', async (req: any, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { data: user, error } = await getSupabase()
      .from('users')
      .select('id, name, email, level, xp')
      .eq('id', decoded.userId)
      .single();

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Task Routes (User Specific)
app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
  try {
    const { data: tasks, error } = await getSupabase()
      .from('tasks')
      .select('*')
      .eq('user_id', req.userId)
      .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(tasks.map((t: any) => ({ ...t, reminderSent: !!t.reminderSent })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
  const { id, title, description, status, priority, dueDate, createdAt } = req.body;
  try {
    const { error } = await getSupabase()
      .from('tasks')
      .insert([{ id, user_id: req.userId, title, description, status, priority, dueDate, createdAt }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  try {
    const { error } = await getSupabase()
      .from('tasks')
      .update({ title, description, status, priority, dueDate })
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
  const { id } = req.params;
  try {
    const { error } = await getSupabase()
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', isAuthenticated, async (req: any, res) => {
  const { name, email, level, xp } = req.body;
  try {
    const { error } = await getSupabase()
      .from('users')
      .update({ name, email, level, xp })
      .eq('id', req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Resume Routes
app.get('/api/resumes', isAuthenticated, async (req: any, res) => {
  try {
    const { data: resumes, error } = await getSupabase()
      .from('resumes')
      .select('*')
      .eq('user_id', req.userId)
      .order('updatedAt', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(resumes.map((r: any) => ({
      ...r,
      experiences: typeof r.experiences === 'string' ? JSON.parse(r.experiences || '[]') : (r.experiences || []),
      education: typeof r.education === 'string' ? JSON.parse(r.education || '[]') : (r.education || []),
      skills: typeof r.skills === 'string' ? JSON.parse(r.skills || '[]') : (r.skills || []),
      projects: typeof r.projects === 'string' ? JSON.parse(r.projects || '[]') : (r.projects || [])
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resumes', isAuthenticated, async (req: any, res) => {
  const { 
    id, fullName, email, phone, location, summary, 
    experiences, education, skills, projects, 
    templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt 
  } = req.body;
  
  try {
    const { error } = await getSupabase()
      .from('resumes')
      .insert([{
        id, user_id: req.userId, fullName, email, phone, location, summary, 
        experiences: experiences, education: education, 
        skills: skills, projects: projects, 
        templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt
      }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
  const { id } = req.params;
  const { 
    fullName, email, phone, location, summary, 
    experiences, education, skills, projects, 
    templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt 
  } = req.body;
  
  try {
    const { error } = await getSupabase()
      .from('resumes')
      .update({
        fullName, email, phone, location, summary, 
        experiences: experiences, education: education, 
        skills: skills, projects: projects, 
        templateId, fontFamily, fontSize, margin, sectionSpacing, updatedAt
      })
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
  const { id } = req.params;
  try {
    const { error } = await getSupabase()
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/test-email', isAuthenticated, async (req: any, res) => {
  try {
    const { data: user, error } = await getSupabase()
      .from('users')
      .select('email, name')
      .eq('id', req.userId)
      .single();
    
    if (!user || !user.email) {
      return res.status(400).json({ error: 'No user email found' });
    }

    if (!process.env.SMTP_USER) {
      return res.status(400).json({ error: 'SMTP not configured in .env' });
    }

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
    const { data: tasksToRemind, error } = await getSupabase()
      .from('tasks')
      .select('*, users(email, name)')
      .lte('dueDate', tomorrowStr)
      .neq('status', 'done')
      .eq('reminderSent', 0);

    if (tasksToRemind && tasksToRemind.length > 0 && process.env.SMTP_USER) {
      for (const task of tasksToRemind) {
        const user = task.users as any;
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Vibrant Tasker" <reminders@example.com>',
            to: user.email,
            subject: `Reminder: Task "${task.title}" is due soon!`,
            text: `Hi ${user.name},\n\nThis is a reminder that your task "${task.title}" is due on ${task.dueDate}.\n\nDescription: ${task.description}\nPriority: ${task.priority}\n\nKeep up the great work!\n- Vibrant Tasker`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 4px solid #0f172a; border-radius: 12px;">
                <h1 style="margin-top: 0;">Task Reminder</h1>
                <p>Hi <strong>${user.name}</strong>,</p>
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

          await getSupabase()
            .from('tasks')
            .update({ reminderSent: 1 })
            .eq('id', task.id);
          
          console.log(`Reminder sent for task: ${task.title} to ${user.email}`);
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
  if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Vercel, we need to serve index.html for SPA routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
