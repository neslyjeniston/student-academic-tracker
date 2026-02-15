import React, { ReactNode, useState } from "react";
import {
  Moon,
  Sun,
  LayoutDashboard,
  BarChart3,
  Users,
  LogOut,
  GraduationCap,
  ChevronRight,
  Search,
  Bell
} from "lucide-react";

interface Props {
  children: ReactNode;
  onNavigate: (page: string) => void;
  activePage: string;
  onLogout: () => void;
}

export const AdminLayout = ({
  children,
  onNavigate,
  activePage,
  onLogout,
}: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#020617] dark:via-[#0f172a] dark:to-[#020617] transition-all duration-700 font-sans">

        {/* =====================================
            SIDEBAR
        ===================================== */}
        <aside className="w-72 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col sticky top-0 h-screen transition-all duration-500 shadow-xl shadow-slate-200/40 dark:shadow-none">

          {/* Logo */}
          <div className="p-8">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl shadow-blue-300/40 group-hover:rotate-6 transition-transform duration-300">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                EduTracker
                <span className="text-blue-600 animate-pulse">.</span>
              </h2>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 space-y-2">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4 ml-4">
              Management
            </p>

            <NavItem
              icon={<LayoutDashboard />}
              label="Dashboard"
              active={activePage === "dashboard"}
              onClick={() => onNavigate("dashboard")}
            />
            <NavItem
              icon={<BarChart3 />}
              label="Analytics"
              active={activePage === "analytics"}
              onClick={() => onNavigate("analytics")}
            />
            <NavItem
              icon={<Users />}
              label="Students"
              active={activePage === "students"}
              onClick={() => onNavigate("students")}
            />
          </nav>

          {/* Bottom Section */}
          <div className="p-4 bg-white/60 dark:bg-slate-900/40 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 space-y-3">

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative flex items-center justify-between w-full p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${
                  darkMode
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-indigo-500/10 text-indigo-600"
                }`}>
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </div>

              <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                darkMode ? "bg-blue-600" : "bg-slate-300"
              }`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-md transition-all duration-300 ${
                  darkMode ? "left-6" : "left-1"
                }`} />
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 group"
            >
              <div className="p-2 rounded-xl group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-colors">
                <LogOut size={18} />
              </div>
              <span className="text-sm font-bold tracking-tight">
                Sign Out
              </span>
            </button>

            {/* Profile Card */}
            <div className="p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center gap-3 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                  AD
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  Administrator
                </p>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  Super User Access
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}
        <main className="flex-1 flex flex-col relative">

          {/* Decorative background glow */}
          <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/[0.05] blur-[140px] pointer-events-none z-0" />

          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-10 py-4 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">

            {/* Search */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-96 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Quick search records..."
                className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <button className="relative p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:shadow-md transition-all group">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-10 max-w-[1600px] w-full mx-auto relative z-10 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/* =====================================
   Nav Item Component
===================================== */
interface NavItemProps {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-between w-full group p-3 rounded-2xl transition-all duration-300 ${
      active
        ? "text-white"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30" />
    )}

    <div className="flex items-center gap-3 z-10">
      <div className={`transition-transform duration-300 ${
        active ? "scale-110" : "group-hover:scale-110"
      }`}>
        {React.cloneElement(icon, {
          size: 20,
          className: active
            ? "text-white"
            : "group-hover:text-blue-600 transition-colors"
        })}
      </div>
      <span className={`text-sm font-bold tracking-tight ${
        active ? "opacity-100" : "opacity-80 group-hover:opacity-100"
      }`}>
        {label}
      </span>
    </div>

    {active ? (
      <div className="w-1.5 h-1.5 bg-white rounded-full z-10 mr-1 shadow-sm" />
    ) : (
      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    )}
  </button>
);
