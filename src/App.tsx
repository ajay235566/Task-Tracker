import React, { useState, useEffect, useRef } from 'react';
import { Plus, LayoutDashboard, ListTodo, Settings, Search, Bell, CheckCircle2, Clock, AlertCircle, Menu, X as CloseIcon, Info, CheckCircle, LogOut, Trophy, ArrowUpDown, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Notification, UserProfile, Badge } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { BadgeGallery } from './components/BadgeGallery';
import { ResumeCreator } from './components/ResumeCreator';
import { CustomDropdown } from './components/CustomDropdown';
import { LandingPage } from './components/LandingPage';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'settings' | 'achievements' | 'finished' | 'resume'>('dashboard');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'none'>('none');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest',
    email: '',
    level: 1,
    xp: 0
  });

  const [badges, setBadges] = useState<Badge[]>([
    { id: 'first-task', name: 'First Step', description: 'Complete your first task!', icon: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', requirement: '1_task' },
    { id: 'five-tasks', name: 'Task Master', description: 'Complete 5 tasks!', icon: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria', requirement: '5_tasks' },
    { id: 'ten-tasks', name: 'Unstoppable', description: 'Complete 10 tasks!', icon: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo', requirement: '10_tasks' },
    { id: 'high-priority', name: 'Crisis Manager', description: 'Complete a high priority task!', icon: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya', requirement: 'high_priority' },
    { id: 'daily-streak', name: 'Consistent', description: 'Complete tasks on 3 different days!', icon: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe', requirement: '3_days' }
  ]);

  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close notifications and profile when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    // Cleanup legacy keys from previous versions
    localStorage.removeItem('vibrant-user-profile');

    const checkAuth = async () => {
      const token = localStorage.getItem('vibrant-token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setUserProfile(userData);
        } else {
          localStorage.removeItem('vibrant-token');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const token = localStorage.getItem('vibrant-token');
        try {
          const tasksRes = await fetch('/api/tasks', { 
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (tasksRes.ok) {
            const data = await tasksRes.json();
            setTasks(data);
          }
        } catch (err) {
          console.error('Failed to fetch data:', err);
        }
      };
      fetchData();
    } else {
      setTasks([]);
    }

    const savedBadges = localStorage.getItem('vibrant-badges');
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    }
  }, [user]);

  // Check for badge unlocks and Level up
  useEffect(() => {
    if (!user) return;
    const completedTasks = tasks.filter(t => t.status === 'done');
    const completedCount = completedTasks.length;
    const hasHighPriority = completedTasks.some(t => t.priority === 'high');

    // Level logic: 5 tasks per level
    const newLevel = Math.floor(completedCount / 5) + 1;
    const newXP = (completedCount % 5) * 20; // 20 XP per task, 100 XP per level

    if (newLevel !== userProfile.level || newXP !== userProfile.xp) {
      const updatedProfile = { ...userProfile, level: newLevel, xp: newXP };
      setUserProfile(updatedProfile);
      
      // Sync profile to server
      const token = localStorage.getItem('vibrant-token');
      fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile)
      });

      if (newLevel > userProfile.level) {
        const levelNotif: Notification = {
          id: `level-${newLevel}`,
          title: 'Level Up!',
          message: `You've reached Level ${newLevel}! Keep up the great work.`,
          time: 'Just now',
          isRead: false,
          type: 'success'
        };
        setNotifications(n => [levelNotif, ...n]);
      }
    }

    setBadges(prev => {
      let changed = false;
      const next = prev.map(badge => {
        if (badge.unlockedAt) return badge;

        let shouldUnlock = false;
        if (badge.requirement === '1_task' && completedCount >= 1) shouldUnlock = true;
        if (badge.requirement === '5_tasks' && completedCount >= 5) shouldUnlock = true;
        if (badge.requirement === '10_tasks' && completedCount >= 10) shouldUnlock = true;
        if (badge.requirement === 'high_priority' && hasHighPriority) shouldUnlock = true;

        if (shouldUnlock) {
          changed = true;
          // Add notification for badge unlock
          const newNotif: Notification = {
            id: `badge-${badge.id}`,
            title: 'New Badge Unlocked!',
            message: `Congratulations! You've earned the "${badge.name}" badge.`,
            time: 'Just now',
            isRead: false,
            type: 'success'
          };
          setNotifications(n => [newNotif, ...n]);
          return { ...badge, unlockedAt: new Date().toISOString() };
        }
        return badge;
      });

      if (changed) {
        localStorage.setItem('vibrant-badges', JSON.stringify(next));
        return next;
      }
      return prev;
    });
  }, [tasks]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('vibrant-token');
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedProfile = {
      ...userProfile,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };
    setUserProfile(updatedProfile);
    
    // Sync to server
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedProfile)
    });
    
    // Add a success notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'Profile Updated',
      message: 'Your profile settings have been saved successfully.',
      time: 'Just now',
      isRead: false,
      type: 'success'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const token = localStorage.getItem('vibrant-token');
    if (editingTask) {
      const updatedTask = { ...editingTask, ...taskData } as Task;
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(undefined);
      
      // Sync to server
      await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask)
      });
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);

      // Sync to server
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    const token = localStorage.getItem('vibrant-token');
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch(`/api/tasks/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    const token = localStorage.getItem('vibrant-token');
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, status };
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedTask),
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (currentView === 'finished') {
      return matchesSearch && task.status === 'done';
    }

    // For other views, exclude done tasks
    if (task.status === 'done') return false;

    const matchesTab = activeTab === 'all' || task.status === activeTab;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesTab && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status !== 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    localStorage.removeItem('vibrant-token');
    setUser(null);
    setUserProfile({ name: 'Guest', email: '', level: 1, xp: 0 });
    setCurrentView('dashboard');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('vibrant-token', userData.token);
        setUser(userData);
        setUserProfile(userData);
        setIsAuthModalOpen(false);
      } else {
        const error = await res.json();
        alert(error.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage 
          onLogin={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} 
          onSignup={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} 
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          mode={authMode} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSubmit={handleAuth}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      </>
    );
  }

  return (
    <div className="h-screen w-screen p-2 sm:p-4 bg-white">
      <div className="h-full w-full flex bg-white border-2 sm:border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-[32px] relative">
        {/* Sidebar */}
        <aside className={cn(
          "bg-white border-r-2 sm:border-r-4 border-slate-900 transition-all duration-300 flex flex-col z-40",
          isSidebarOpen ? "w-64" : "w-0 sm:w-20 overflow-hidden"
        )}>
          <div className="p-6 flex items-center gap-3 border-b-2 border-slate-900 bg-brand-primary">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-brand-primary font-black">T</div>
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter">TASKER</span>}
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              collapsed={!isSidebarOpen} 
              onClick={() => setCurrentView('dashboard')}
            />
            <SidebarItem 
              icon={<ListTodo size={20} />} 
              label="My Tasks" 
              active={currentView === 'tasks'} 
              collapsed={!isSidebarOpen} 
              onClick={() => setCurrentView('tasks')}
            />
            <SidebarItem 
              icon={<CheckCircle2 size={20} />} 
              label="Finished Tasks" 
              active={currentView === 'finished'} 
              collapsed={!isSidebarOpen} 
              onClick={() => setCurrentView('finished')}
            />
            <SidebarItem 
              icon={<Trophy size={20} />} 
              label="Achievements" 
              active={currentView === 'achievements'} 
              collapsed={!isSidebarOpen} 
              onClick={() => setCurrentView('achievements')}
            />
            <SidebarItem 
              icon={<FileText size={20} />} 
              label="Resume Creator" 
              active={currentView === 'resume'} 
              collapsed={!isSidebarOpen} 
              onClick={() => setCurrentView('resume')}
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={currentView === 'settings'} 
              collapsed={!isSidebarOpen} 
              onClick={() => setCurrentView('settings')}
            />
          </nav>

          <div className="mt-auto border-t-2 border-slate-900">
            <SidebarItem 
              icon={<LogOut size={20} />} 
              label="Logout" 
              active={false} 
              collapsed={!isSidebarOpen} 
              onClick={handleLogout}
            />
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full p-4 border-t-2 border-slate-900 hover:bg-slate-50 flex justify-center transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 sm:h-20 bg-white border-b-2 sm:border-b-4 border-slate-900 flex items-center justify-between px-3 sm:px-8 shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="sm:hidden p-2 hover:bg-slate-100 rounded-lg border-2 border-slate-900"
            >
              <Menu size={18} />
            </button>
            <div className="relative w-full flex items-center gap-1 sm:gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-9 pr-2 sm:pr-3 py-1 sm:py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary text-xs sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {[
                  "https://i.giphy.com/13HgwGsXF0aiGY.gif",
                  "https://i.giphy.com/slVWEctHZKvWU.gif",
                  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dTQ3cmZwOG81YndldDVzOGpzcmRyNGNmaGdrdjM5aGkyYXhyZTNsMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xVxio2tNLAM5q/giphy.gif",
                  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzBja3Y1YzVtaWRrbml0b25qcjR1NDhmdHMwcmw2aXZibHJkMG16dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3pTtbLJ7Jd0YM/giphy.gif"
                ].map((gif, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-7 sm:h-10 w-7 sm:w-10 shrink-0 border-2 border-slate-900 rounded overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white",
                      idx > 0 && "hidden md:block", // Hide extra ones on mobile to save space
                      idx === 1 && "hidden sm:block" // Show second one on tablet
                    )}
                  >
                    <img 
                      src={gif} 
                      alt={`Anime ${idx}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <div ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "p-2 rounded-full relative transition-all",
                  isNotificationsOpen ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                )}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-secondary rounded-full border-2 border-white text-[8px] font-bold flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 vibrant-card bg-white z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b-2 border-slate-900 bg-brand-accent flex justify-between items-center">
                      <h3 className="font-bold">Notifications</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-black uppercase hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={cn(
                              "p-4 border-b border-slate-100 flex gap-3 hover:bg-slate-50 transition-colors",
                              !notification.isRead && "bg-brand-primary/5"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-slate-900",
                              notification.type === 'warning' ? "bg-amber-100" : 
                              notification.type === 'success' ? "bg-emerald-100" : "bg-blue-100"
                            )}>
                              {notification.type === 'warning' ? <AlertCircle size={14} className="text-amber-600" /> : 
                               notification.type === 'success' ? <CheckCircle size={14} className="text-emerald-600" /> : 
                               <Info size={14} className="text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-xs font-bold">{notification.title}</h4>
                                <span className="text-[10px] text-slate-400">{notification.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-tight">{notification.message}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-brand-secondary rounded-full mt-1"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400 italic text-sm">
                          No notifications yet.
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                      <button className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        View All Activity
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full border-2 border-slate-900 bg-brand-accent overflow-hidden hover:scale-105 transition-transform"
              >
                <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 vibrant-card bg-white z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b-2 border-slate-900 bg-brand-primary">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-black uppercase">{userProfile.name}</p>
                        <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded">LVL {userProfile.level}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 truncate">{userProfile.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setCurrentView('settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-slate-100 rounded flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <button 
                        className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-rose-50 text-rose-600 rounded flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 pb-24 sm:pb-[100px] space-y-4 sm:space-y-8 no-scrollbar">
          {currentView === 'dashboard' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Dashboard</h1>
                  <div className="flex items-center gap-3">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Welcome back, {userProfile.name}!</p>
                    <div className="flex items-center gap-2 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <span className="text-[10px] font-black text-brand-secondary">LVL {userProfile.level}</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${userProfile.xp}%` }}
                          className="h-full bg-brand-secondary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setEditingTask(undefined);
                    setIsModalOpen(true);
                  }}
                  className="vibrant-button bg-brand-primary flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
                >
                  <Plus size={18} />
                  <span>New Task</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Tasks" 
                  value={stats.total} 
                  icon={<ListTodo className="text-blue-500" />} 
                  color="bg-blue-50" 
                />
                <StatCard 
                  title="Completed" 
                  value={stats.completed} 
                  icon={<CheckCircle2 className="text-brand-primary" />} 
                  color="bg-emerald-50" 
                />
                <StatCard 
                  title="In Progress" 
                  value={stats.pending} 
                  icon={<Clock className="text-brand-secondary" />} 
                  color="bg-purple-50" 
                />
                <StatCard 
                  title="Badges Earned" 
                  value={badges.filter(b => b.unlockedAt).length} 
                  icon={<Trophy className="text-amber-500" />} 
                  color="bg-amber-50" 
                />
              </div>

              <div className="pt-4">
                <h2 className="text-2xl font-bold mb-4">Recent Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {tasks.filter(t => t.status !== 'done').slice(0, 3).map(task => (
                      <TaskCard 
                        key={task.id}
                        task={task} 
                        onDelete={handleDeleteTask} 
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </AnimatePresence>
                  {tasks.filter(t => t.status !== 'done').length === 0 && (
                    <p className="text-slate-400 italic">No active tasks. Create one or check finished tasks!</p>
                  )}
                </div>
                {tasks.length > 3 && (
                  <button 
                    onClick={() => setCurrentView('tasks')}
                    className="mt-6 text-brand-secondary font-bold hover:underline"
                  >
                    View all tasks →
                  </button>
                )}
              </div>
            </section>
          )}

          {currentView === 'tasks' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">My Tasks</h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Manage and organize all your work items.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingTask(undefined);
                    setIsModalOpen(true);
                  }}
                  className="vibrant-button bg-brand-primary flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
                >
                  <Plus size={18} />
                  <span>New Task</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-200">
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                  <TabItem label="All Tasks" active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={tasks.filter(t => t.status !== 'done').length} />
                  <TabItem label="To Do" active={activeTab === 'todo'} onClick={() => setActiveTab('todo')} count={tasks.filter(t => t.status === 'todo').length} />
                  <TabItem label="In Progress" active={activeTab === 'in-progress'} onClick={() => setActiveTab('in-progress')} count={tasks.filter(t => t.status === 'in-progress').length} />
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pb-2 sm:pb-0">
                  <CustomDropdown 
                    icon={<AlertCircle size={14} />}
                    value={priorityFilter}
                    onChange={(val) => setPriorityFilter(val)}
                    options={[
                      { value: 'all', label: 'All Priorities' },
                      { value: 'low', label: 'Low Priority' },
                      { value: 'medium', label: 'Medium Priority' },
                      { value: 'high', label: 'High Priority' },
                    ]}
                  />

                  <CustomDropdown 
                    icon={<ArrowUpDown size={14} />}
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    align="right"
                    options={[
                      { value: 'none', label: 'Sort By' },
                      { value: 'priority', label: 'Priority (H-L)' },
                      { value: 'dueDate', label: 'Due Date' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <TaskCard 
                        task={task} 
                        onDelete={handleDeleteTask} 
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredTasks.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl">
                    <ListTodo size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No tasks found</p>
                    <p className="text-sm">Try adjusting your filters or create a new task.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {currentView === 'finished' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Finished Tasks</h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Review your completed accomplishments.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <TaskCard 
                        task={task} 
                        onDelete={handleDeleteTask} 
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredTasks.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl">
                    <CheckCircle2 size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No finished tasks yet</p>
                    <p className="text-sm">Complete some tasks to see them here!</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {currentView === 'achievements' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Achievements</h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Your journey and earned badges.</p>
                </div>
              </div>
              <BadgeGallery badges={badges} />
            </section>
          )}

          {currentView === 'resume' && (
            <ResumeCreator />
          )}

          {currentView === 'settings' && (
            <section className="space-y-6">
              <h1 className="text-4xl font-black tracking-tight">Settings</h1>
              <div className="vibrant-card p-8 bg-white max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase">Name</label>
                      <input 
                        name="name"
                        type="text" 
                        defaultValue={userProfile.name} 
                        className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase">Email</label>
                      <input 
                        name="email"
                        type="email" 
                        defaultValue={userProfile.email} 
                        className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase">Theme Accent</label>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-slate-900 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-brand-secondary border-2 border-slate-900 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-brand-accent border-2 border-slate-900 cursor-pointer"></div>
                    </div>
                  </div>
                  <button type="submit" className="vibrant-button bg-brand-primary mt-4">Save Changes</button>
                </form>

                <div className="mt-12 pt-8 border-t-2 border-slate-100">
                  <h3 className="text-lg font-bold mb-2">Reminder Settings</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Verify your email reminder configuration. Make sure you have set up your SMTP credentials in the <code>.env</code> file.
                  </p>
                  <button 
                    onClick={async () => {
                      const token = localStorage.getItem('vibrant-token');
                      try {
                        const res = await fetch('/api/test-email', { 
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert('Test email sent successfully!');
                        } else {
                          alert(`Error: ${data.error || 'Failed to send email'}`);
                        }
                      } catch (err) {
                        alert('Failed to connect to server.');
                      }
                    }}
                    className="vibrant-button bg-white border-2 border-slate-900"
                  >
                    Send Test Reminder
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Components */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateTask}
        initialTask={editingTask}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        mode={authMode} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSubmit={handleAuth}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />
      </div>
    </div>
  );
}

function AuthModal({ isOpen, mode, onClose, onSubmit, onSwitchMode }: { 
  isOpen: boolean, 
  mode: 'login' | 'signup', 
  onClose: () => void, 
  onSubmit: (e: React.FormEvent) => void,
  onSwitchMode: () => void 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white border-4 border-slate-900 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md p-8"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <CloseIcon size={20} />
            </button>

            <h2 className="text-3xl font-black uppercase mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the Club'}
            </h2>
            <p className="text-slate-500 font-medium mb-8">
              {mode === 'login' ? 'Login to crush your goals.' : 'Start your productivity journey today.'}
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Full Name</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full p-3 border-2 border-slate-900 rounded-lg focus:ring-2 ring-brand-primary outline-none font-bold"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-black uppercase mb-1">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full p-3 border-2 border-slate-900 rounded-lg focus:ring-2 ring-brand-primary outline-none font-bold"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full p-3 border-2 border-slate-900 rounded-lg focus:ring-2 ring-brand-primary outline-none font-bold"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="vibrant-button bg-brand-primary w-full mt-4">
                {mode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={onSwitchMode} className="text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors">
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SidebarItem({ icon, label, active, collapsed, onClick }: { icon: React.ReactNode, label: string, active: boolean, collapsed: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg font-bold transition-all",
        active ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-600",
        collapsed && "justify-center"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className={cn("vibrant-card p-4 sm:p-6 flex items-center justify-between", color)}>
      <div>
        <p className="text-xs font-bold uppercase text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
      <div className="w-12 h-12 bg-white border-2 border-slate-900 flex items-center justify-center rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {icon}
      </div>
    </div>
  );
}

function TabItem({ label, active, onClick, count }: { label: string, active: boolean, onClick: () => void, count: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-3 text-sm font-bold transition-all relative",
        active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
      )}
    >
      <div className="flex items-center gap-2">
        {label}
        <span className={cn(
          "text-[10px] px-1.5 py-0.5 rounded-full border",
          active ? "bg-brand-primary border-slate-900" : "bg-slate-100 border-slate-200"
        )}>
          {count}
        </span>
      </div>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary border-t border-slate-900" 
        />
      )}
    </button>
  );
}
