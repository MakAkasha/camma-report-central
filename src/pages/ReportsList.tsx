
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, Download, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { mockReports } from "@/data/mockData";
import { Report } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import TimePeriodSelect from "@/components/TimePeriodSelect";
import { timePeriodOptions } from "@/data/mockData";

const ReportsList = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [timePeriod, setTimePeriod] = useState("this-week");

  useEffect(() => {
    // Simulate API call to get reports
    const fetchReports = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call based on user role
        let filteredReports = [...mockReports];
        
        // If user is an employee, only show their reports
        if (user?.role === "employee") {
          filteredReports = filteredReports.filter(
            report => report.userId === user.id
          );
        }
        
        setReports(filteredReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [user]);

  // Filter reports based on search query and department filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      searchQuery === "" || 
      (report.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       report.tasks.toLowerCase().includes(searchQuery.toLowerCase()) ||
       report.meetings?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       report.challenges?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      report.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View and manage daily reports</p>
          </div>
          
          <Link to="/reports/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>
        
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Branches Management">Branches Management</SelectItem>
                  <SelectItem value="Accounting">Accounting</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Wholesale">Wholesale</SelectItem>
                </SelectContent>
              </Select>
              
              <TimePeriodSelect
                options={timePeriodOptions}
                value={timePeriod}
                onChange={setTimePeriod}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => exportToCSV(filteredReports)}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF(filteredReports)}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {(user?.role === "manager" || user?.role === "admin") && (
                      <TableHead>Employee</TableHead>
                    )}
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="max-w-[300px]">Tasks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={(user?.role === "manager" || user?.role === "admin") ? 5 : 4}
                        className="h-24 text-center"
                      >
                        No reports found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        {(user?.role === "manager" || user?.role === "admin") && (
                          <TableCell>{report.userName}</TableCell>
                        )}
                        <TableCell>{report.department}</TableCell>
                        <TableCell>
                          {format(new Date(report.dateSubmitted), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {report.tasks}
                        </TableCell>
                        <TableCell>
                          <Link to={`/reports/${report.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReportsList;
