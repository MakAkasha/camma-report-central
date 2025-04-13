
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockReports, departmentColors } from "@/data/mockData";
import { Department } from "@/types";
import { format, parseISO, subDays } from "date-fns";
import TimePeriodSelect from "@/components/TimePeriodSelect";
import { timePeriodOptions } from "@/data/mockData";

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState("this-week");
  const [loading, setLoading] = useState(true);
  
  // Prepare data for department distribution chart
  const departmentData = Object.entries(departmentColors).map(([dept, color]) => {
    const count = mockReports.filter(report => report.department === dept).length;
    return {
      name: dept as Department,
      value: count,
      color
    };
  });
  
  // Prepare data for daily reports chart
  const getDailyReportsData = () => {
    const today = new Date();
    const data = [];
    
    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      
      // Count reports for this date
      const count = mockReports.filter(
        report => report.dateSubmitted === dateStr
      ).length;
      
      data.push({
        date: format(date, "MMM d"),
        count
      });
    }
    
    return data;
  };
    
  // Prepare data for report submission trends chart
  const getReportTrendsData = () => {
    const departmentCounts = Object.keys(departmentColors).reduce((acc: Record<string, number>, department) => {
      acc[department] = 0;
      return acc;
    }, {});
  
    mockReports.forEach(report => {
      departmentCounts[report.department]++;
    });
  
    return Object.entries(departmentCounts).map(([department, count]) => ({
      name: department,
      count,
    }));
  };

  const reportTrendsData = getReportTrendsData();


  
  const dailyReportsData = getDailyReportsData();
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">View reporting metrics and trends</p>
          </div>
          
          <TimePeriodSelect
            options={timePeriodOptions}
            value={timePeriod}
            onChange={setTimePeriod}
            label="Time Period:"
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="text-base">Reports by Department</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="h-40 w-40 rounded-full bg-muted animate-pulse" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="text-base">Daily Reports Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="h-40 w-full bg-muted animate-pulse" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dailyReportsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Reports" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Report Submission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="h-80 w-full bg-muted animate-pulse" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={reportTrendsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Reports" fill="#8884d8">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;
