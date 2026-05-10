import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Menu,
  X 
} from "lucide-react";

interface SidebarProps {
  user: any;
  activeTab: "vault" | "settings";
  setActiveTab: (tab: "vault" | "settings") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
  loading: boolean;
}

const VaultIcon = () => <ShieldCheck size={20} />;
const SettingsIcon = () => <Settings size={20} />;
const LogoutIcon = () => <LogOut size={20} />;

export default function Sidebar({ 
  user, 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen, 
  handleLogout, 
  loading 
}: SidebarProps) {
  return (
    <>
      {/* Mobile Header / Hamburger Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-panel border-b border-glass-border/30 z-30 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center text-white shadow-lg shadow-accent-primary/20">
              <VaultIcon />
           </div>
           <span className="font-bold text-text-main">FileVault</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-black/5 text-text-main hover:bg-black/10 transition-all"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Backdrop Overlay (Mobile only) */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:relative z-30 lg:z-10
        w-64 h-full
        glass border-r border-glass-border/30 
        flex flex-col justify-between 
        shrink-0 shadow-2xl rounded-none
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-glass-border/20">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-primary flex items-center justify-center text-text-main shadow-lg shadow-accent-primary/20 overflow-hidden">
              {user?.profileImage && !user.profileImage.toLowerCase().includes("javascript:") && !user.profileImage.toLowerCase().includes("vbscript:") && !user.profileImage.toLowerCase().includes("data:text/html") ? (
                <img
                  src={user.profileImage}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={32} />
              )}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-text-main text-lg truncate leading-tight">
                {user ? user.name : "Loading..."}
              </h2>
              <p className="text-xs text-text-muted truncate">
                {user ? user.email : "..."}
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => { setActiveTab("vault"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${activeTab === "vault" ? "bg-blue-50 text-blue-900 border border-blue-100 shadow-sm" : "text-text-muted hover:bg-black/5 hover:text-text-main border border-transparent"}`}
            >
              <VaultIcon />
              My Vault
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${activeTab === "settings" ? "bg-blue-50 text-blue-900 border border-blue-100 shadow-sm" : "text-text-muted hover:bg-black/5 hover:text-text-main border border-transparent"}`}
            >
              <SettingsIcon />
              Profile Settings
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-glass-border/20 space-y-2">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm cursor-pointer mb-2"
            >
              <SettingsIcon />
              Admin Controls
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-error/10 hover:bg-error border border-error/20 hover:border-error text-error hover:text-text-main px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-error/30 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner w-[14px] h-[14px] border-text-main"></span>
            ) : (
              <>
                <LogoutIcon />
                Log Out
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
