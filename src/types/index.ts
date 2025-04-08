
export type UserRole = "employee" | "manager" | "admin";

export interface User {
  id: number;
  employeeNumber: string;
  email: string;
  role: UserRole;
  department: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Department = "Branches Management" | "Accounting" | "Digital Marketing" | "Wholesale";

export interface Report {
  id: number;
  userId: number;
  department: Department;
  tasks: string;
  meetings: string;
  challenges: string;
  dateSubmitted: string;
  lastUpdated: string;
  userName?: string;
}

export interface DashboardStats {
  totalReports: number;
  reportsToday: number;
  reportsByDepartment: Record<Department, number>;
  recentReports: Report[];
}

export interface TimePeriodFilter {
  label: string;
  value: string;
}
