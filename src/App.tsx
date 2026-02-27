import React, { useState, useEffect, useRef } from 'react';
import { Plus, LayoutDashboard, ListTodo, Settings, Search, Bell, CheckCircle2, Clock, AlertCircle, Menu, X as CloseIcon, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Notification } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { ChatBot } from './components/ChatBot';
import { cn } from './lib/utils';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'settings'>('dashboard');
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Task Due Soon',
      message: 'Design Dashboard UI is due in 2 hours.',
      time: '2h ago',
      isRead: false,
      type: 'warning'
    },
    {
      id: '2',
      title: 'New Feature',
      message: 'AI Assistant is now available to help you!',
      time: '5h ago',
      isRead: false,
      type: 'info'
    },
    {
      id: '3',
      title: 'Task Completed',
      message: 'Setup Database has been marked as done.',
      time: '1d ago',
      isRead: true,
      type: 'success'
    }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('vibrant-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Initial sample tasks
      const initialTasks: Task[] = [
        {
          id: '1',
          title: 'Design Dashboard UI',
          description: 'Create a clean and crisp UI for the task tracker using vibrant colors.',
          status: 'done',
          priority: 'high',
          dueDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Implement AI Chatbot',
          description: 'Add a floating AI assistant that helps users manage their tasks.',
          status: 'in-progress',
          priority: 'medium',
          dueDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Setup Database',
          description: 'Configure local storage or a real database for task persistence.',
          status: 'todo',
          priority: 'low',
          dueDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        }
      ];
      setTasks(initialTasks);
      localStorage.setItem('vibrant-tasks', JSON.stringify(initialTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('vibrant-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreateTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
      setEditingTask(undefined);
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
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || task.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status !== 'done').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="h-screen w-screen p-2 sm:p-4 bg-white">
      <div className="h-full w-full flex bg-white border-2 sm:border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-xl relative">
        {/* Sidebar */}
        <aside className={cn(
          "bg-white border-r-2 sm:border-r-4 border-slate-900 transition-all duration-300 flex flex-col z-40",
          isSidebarOpen ? "w-64" : "w-0 sm:w-20 overflow-hidden"
        )}>
        <div className="p-6 flex items-center gap-3 border-b-2 border-slate-900 bg-brand-primary">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-brand-primary font-black">T</div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter">TASKER</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
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
            icon={<Settings size={20} />} 
            label="Settings" 
            active={currentView === 'settings'} 
            collapsed={!isSidebarOpen} 
            onClick={() => setCurrentView('settings')}
          />
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 border-t-4 border-slate-900 hover:bg-slate-50 flex justify-center"
        >
          <Menu size={20} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 sm:h-20 bg-white border-b-2 sm:border-b-4 border-slate-900 flex items-center justify-between px-4 sm:px-8 shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="sm:hidden p-2 hover:bg-slate-100 rounded-lg border-2 border-slate-900"
            >
              <Menu size={18} />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative" ref={notificationRef}>
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

            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-brand-accent overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 no-scrollbar">
          {currentView === 'dashboard' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Dashboard</h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">Welcome back, Ajay!</p>
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
                  title="High Priority" 
                  value={stats.highPriority} 
                  icon={<AlertCircle className="text-rose-500" />} 
                  color="bg-rose-50" 
                />
              </div>

              <div className="pt-4">
                <h2 className="text-2xl font-bold mb-4">Recent Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.slice(0, 3).map(task => (
                    <TaskCard 
                      key={task.id}
                      task={task} 
                      onDelete={handleDeleteTask} 
                      onEdit={handleEditTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-slate-400 italic">No tasks yet. Create one to get started!</p>
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

              <div className="flex items-center gap-2 sm:gap-4 border-b-2 border-slate-200 overflow-x-auto no-scrollbar">
                <TabItem label="All Tasks" active={activeTab === 'all'} onClick={() => setActiveTab('all')} count={tasks.length} />
                <TabItem label="To Do" active={activeTab === 'todo'} onClick={() => setActiveTab('todo')} count={tasks.filter(t => t.status === 'todo').length} />
                <TabItem label="In Progress" active={activeTab === 'in-progress'} onClick={() => setActiveTab('in-progress')} count={tasks.filter(t => t.status === 'in-progress').length} />
                <TabItem label="Done" active={activeTab === 'done'} onClick={() => setActiveTab('done')} count={tasks.filter(t => t.status === 'done').length} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

          {currentView === 'settings' && (
            <section className="space-y-6">
              <h1 className="text-4xl font-black tracking-tight">Settings</h1>
              <div className="vibrant-card p-8 bg-white max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase">Name</label>
                      <input type="text" defaultValue="Ajay" className="w-full px-3 py-2 border-2 border-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase">Email</label>
                      <input type="email" defaultValue="ajay@example.com" className="w-full px-3 py-2 border-2 border-slate-900" />
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
                  <button className="vibrant-button bg-brand-primary mt-4">Save Changes</button>
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
      <ChatBot tasks={tasks} />
      </div>
    </div>
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
    <div className={cn("vibrant-card p-6 flex items-center justify-between", color)}>
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
