import { motion } from "framer-motion";
import { FileText, FolderKanban, Mail, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "./queries";

const statCards = [
  { label: "Total Projects", key: "totalProjects" as const, icon: FolderKanban, color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
  { label: "All Messages", key: "totalMessages" as const, icon: Mail, color: "from-purple-500/20 to-purple-600/10 border-purple-500/30" },
  { label: "Unread Messages", key: "unreadMessages" as const, icon: MessageSquare, color: "from-orange-500/20 to-orange-600/10 border-orange-500/30" },
  { label: "Certificates", key: "totalCertificates" as const, icon: FileText, color: "from-green-500/20 to-green-600/10 border-green-500/30" },
  { label: "Work Experiences", key: "totalExperiences" as const, icon: Users, color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30" },
];

export default function AdminDashboard() {
  const { data: stats } = useDashboardStats();
  const value = (k: typeof statCards[number]["key"]) => stats?.[k] ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          Welcome to the admin panel — here's what's happening.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, key, icon: Icon, color }) => (
          <Card key={label} className={`bg-gradient-to-br ${color} border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-muted-foreground mb-1">{label}</p>
                  <p className="text-3xl font-mono font-bold text-foreground">{value(key)}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-foreground/70" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
