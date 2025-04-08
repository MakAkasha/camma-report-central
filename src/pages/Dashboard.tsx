
import { useEffect, useState } from "react";
import { FileText, Calendar, BarChart2, Users } from "lucide-react";
import DashboardMetricsCard from "@/components/DashboardMetricsCard";
import DepartmentsPieChart from "@/components/DepartmentsPieChart";
import RecentReportsList from "@/components/RecentReportsList";
import { getDashboardStats, departmentColors } from "@/data/mockData";
import { Department, DashboardStats } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call to get dashboard stats
    const fetchStats = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get mock dashboard stats
        const dashboardStats = getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Transform reports by department data for pie chart
  const departmentChartData = stats
    ? Object.entries(stats.reportsByDepartment).map(([name, value]) => ({
        name: name as Department,
        value
      }))
    : [];

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of reports and activity</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardMetricsCard
            title="Total Reports"
            value={stats?.totalReports || 0}
            icon={<FileText className="h-4 w-4" />}
            loading={loading}
          />
          
          <DashboardMetricsCard
            title="Today's Reports"
            value={stats?.reportsToday || 0}
            icon={<Calendar className="h-4 w-4" />}
            loading={loading}
          />
          
          <DashboardMetricsCard
            title="Departments"
            value={Object.keys(departmentColors).length}
            icon={<BarChart2 className="h-4 w-4" />}
            loading={loading}
          />
          
          <DashboardMetricsCard
            title="Total Employees"
            value="35"
            icon={<Users className="h-4 w-4" />}
            loading={loading}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <DepartmentsPieChart data={departmentChartData} loading={loading} />
          
          <RecentReportsList 
            reports={stats?.recentReports || []} 
            loading={loading} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
