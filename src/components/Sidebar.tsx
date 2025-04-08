
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Users,
  Calendar,
  Settings,
  LogOut,
  Home
} from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

const SidebarItem = ({ href, icon, title, isActive }: SidebarItemProps) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 hover:bg-sidebar-accent",
          isActive
            ? "bg-white text-primary hover:bg-white hover:text-primary"
            : "text-white hover:text-white"
        )}
      >
        {icon}
        <span>{title}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <Logo variant="sidebar" />
      </div>
      
      <div className="space-y-1 px-3 flex-1">
        <SidebarItem
          href="/dashboard"
          icon={<Home size={18} />}
          title={t('navigation.dashboard')}
          isActive={isActive("/dashboard")}
        />
        
        <SidebarItem
          href="/reports"
          icon={<FileText size={18} />}
          title={t('navigation.reports')}
          isActive={isActive("/reports") || isActive("/reports/new")}
        />
        
        {(user?.role === "admin" || user?.role === "manager") && (
          <SidebarItem
            href="/analytics"
            icon={<BarChart3 size={18} />}
            title={t('navigation.analytics')}
            isActive={isActive("/analytics")}
          />
        )}
        
        {user?.role === "admin" && (
          <SidebarItem
            href="/users"
            icon={<Users size={18} />}
            title={t('navigation.users')}
            isActive={isActive("/users")}
          />
        )}
        
        <SidebarItem
          href="/calendar"
          icon={<Calendar size={18} />}
          title={t('navigation.calendar')}
          isActive={isActive("/calendar")}
        />
        
        <SidebarItem
          href="/settings"
          icon={<Settings size={18} />}
          title={t('navigation.settings')}
          isActive={isActive("/settings")}
        />
      </div>
      
      <div className="p-3 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-sidebar-accent hover:text-white"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>{t('auth.logout')}</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
