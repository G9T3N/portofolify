import {
  Award,
  BarChart3,
  Briefcase,
  FileText,
  FolderKanban,
  Home,
  MessageSquare,
  Settings,
  Layers,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { useAdminStats } from "./queries";

const sidebarItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/admin", label: "Projects", icon: FolderKanban, end: true },
  { to: "/admin/stacks", label: "Skills & Stacks", icon: Layers },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
  { to: "/admin/settings", label: "CV & Settings", icon: Settings },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout() {
  const { data: stats } = useAdminStats();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-sidebar-border">
          <NavLink to="/admin" end className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-mono font-bold text-sidebar-foreground">Mr.Err</p>
              <p className="text-xs text-sidebar-foreground/60 font-mono">Admin Panel</p>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {to === "/admin/messages" && stats?.unreadMessages && stats.unreadMessages > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                  {stats.unreadMessages}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </NavLink>
        </div>
      </aside>

      <main className="ml-60 flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
