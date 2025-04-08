
import { Report, Department } from "@/types";

// Departments
export const departments: Department[] = [
  "Branches Management",
  "Accounting",
  "Digital Marketing",
  "Wholesale"
];

// Mock reports data
export const mockReports: Report[] = [
  {
    id: 1,
    userId: 3,
    department: "Accounting",
    tasks: "Prepared quarterly financial statements. Reconciled accounts.",
    meetings: "Meeting with auditors. Team meeting about new accounting software.",
    challenges: "Tight timeline for quarterly report.",
    dateSubmitted: "2025-04-08",
    lastUpdated: "2025-04-08T10:30:00",
    userName: "Employee User"
  },
  {
    id: 2,
    userId: 2,
    department: "Branches Management",
    tasks: "Performance review of branch managers. Updated branch operation guidelines.",
    meetings: "Meeting with regional directors. Interview for new branch manager.",
    challenges: "Staffing issues at two branches.",
    dateSubmitted: "2025-04-08",
    lastUpdated: "2025-04-08T11:45:00",
    userName: "Manager User"
  },
  {
    id: 3,
    userId: 1,
    department: "Digital Marketing",
    tasks: "Reviewed marketing campaign results. Updated website content.",
    meetings: "Marketing strategy meeting. Call with social media agency.",
    challenges: "Delayed content delivery from creative team.",
    dateSubmitted: "2025-04-07",
    lastUpdated: "2025-04-07T14:20:00",
    userName: "Admin User"
  },
  {
    id: 4,
    userId: 3,
    department: "Accounting",
    tasks: "Updated expense approvals. Prepared monthly financial report.",
    meetings: "Budget review meeting. Accounts team weekly standup.",
    challenges: "New expense policy implementation issues.",
    dateSubmitted: "2025-04-07",
    lastUpdated: "2025-04-07T09:15:00",
    userName: "Employee User"
  },
  {
    id: 5,
    userId: 2,
    department: "Branches Management",
    tasks: "Conducted branch safety audit. Updated branch manager handbook.",
    meetings: "Safety committee meeting. Training session for new procedures.",
    challenges: "Resistance to new safety procedures at some locations.",
    dateSubmitted: "2025-04-06",
    lastUpdated: "2025-04-06T16:30:00",
    userName: "Manager User"
  },
  {
    id: 6,
    userId: 1,
    department: "Digital Marketing",
    tasks: "Launched new social media campaign. Created email newsletter.",
    meetings: "Content calendar planning. Website redesign kickoff.",
    challenges: "Social media platform algorithm changes affecting reach.",
    dateSubmitted: "2025-04-06",
    lastUpdated: "2025-04-06T13:45:00",
    userName: "Admin User"
  },
  {
    id: 7,
    userId: 3,
    department: "Accounting",
    tasks: "Processed vendor payments. Updated cash flow projection.",
    meetings: "Vendor contract negotiation. Accounting software training.",
    challenges: "System downtime affecting payment processing.",
    dateSubmitted: "2025-04-05",
    lastUpdated: "2025-04-05T10:20:00",
    userName: "Employee User"
  },
  {
    id: 8,
    userId: 2,
    department: "Branches Management",
    tasks: "Quarterly branch performance analysis. Updated staffing schedule.",
    meetings: "Performance review with underperforming branches. HR coordination meeting.",
    challenges: "High turnover at two locations affecting performance.",
    dateSubmitted: "2025-04-05",
    lastUpdated: "2025-04-05T15:10:00",
    userName: "Manager User"
  },
  {
    id: 9,
    userId: 1,
    department: "Digital Marketing",
    tasks: "SEO optimization. Google Ads campaign adjustment.",
    meetings: "Marketing ROI review. Digital team weekly standup.",
    challenges: "Increased competition affecting ad costs.",
    dateSubmitted: "2025-04-04",
    lastUpdated: "2025-04-04T11:30:00",
    userName: "Admin User"
  },
  {
    id: 10,
    userId: 3,
    department: "Accounting",
    tasks: "Tax preparation work. Audit preparation.",
    meetings: "Tax planning meeting. Finance department strategy session.",
    challenges: "Missing documentation for some expenses.",
    dateSubmitted: "2025-04-04",
    lastUpdated: "2025-04-04T14:05:00",
    userName: "Employee User"
  }
];

// Helper function to get reports by department
export const getReportsByDepartment = () => {
  const reportsByDepartment: Record<Department, number> = {
    "Branches Management": 0,
    "Accounting": 0,
    "Digital Marketing": 0,
    "Wholesale": 0
  };
  
  mockReports.forEach(report => {
    reportsByDepartment[report.department]++;
  });
  
  return reportsByDepartment;
};

// Helper function to get reports submitted today
export const getReportsSubmittedToday = () => {
  const today = new Date().toISOString().split('T')[0];
  return mockReports.filter(report => report.dateSubmitted === today).length;
};

// Helper function to get recent reports
export const getRecentReports = (limit: number = 5) => {
  return [...mockReports]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, limit);
};

// Dashboard stats
export const getDashboardStats = () => {
  return {
    totalReports: mockReports.length,
    reportsToday: getReportsSubmittedToday(),
    reportsByDepartment: getReportsByDepartment(),
    recentReports: getRecentReports()
  };
};

// Department color mapping for visualizations
export const departmentColors: Record<Department, string> = {
  "Branches Management": "#4285F4", // Blue
  "Accounting": "#34A853", // Green
  "Digital Marketing": "#FBBC05", // Yellow
  "Wholesale": "#EA4335" // Red
};

// Time period filter options
export const timePeriodOptions = [
  { label: "This Week", value: "this-week" },
  { label: "Last Week", value: "last-week" },
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Quarter", value: "this-quarter" },
  { label: "Last Quarter", value: "last-quarter" },
  { label: "This Year", value: "this-year" },
  { label: "Custom Range", value: "custom" }
];
