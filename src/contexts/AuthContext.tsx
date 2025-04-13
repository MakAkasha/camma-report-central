
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, AuthState, UserRole } from "@/types";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (employeeNumber: string, pin: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for the demo
const mockUsers: User[] = [
  {
    id: 1,
    employeeNumber: "1001",
    email: "admin@camma.com",
    role: "admin",
    department: "Digital Marketing",
    name: "Admin User"
  },
  {
    id: 2,
    employeeNumber: "1002",
    email: "manager@camma.com",
    role: "manager",
    department: "Branches Management",
    name: "Manager User"
  },
  {
    id: 3,
    employeeNumber: "1003",
    email: "employee@camma.com",
    role: "employee",
    department: "Accounting",
    name: "Employee User"
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const login = async (employeeNumber: string, pin: string): Promise<boolean> => {
    // In a real app, this would be an API call to authenticate
    // For demo purposes, we'll use mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find user by employee number
      const user = mockUsers.find(user => user.employeeNumber === employeeNumber) ;

      // Check if user exists and PIN is correct (in a real app, PIN would be hashed)
      const getUserPin = () => "1234";
      
      const userPin = getUserPin();

      const hashedPin = await new Promise<string>((resolve) => {
        resolve(password_hash(pin, ''));
      })

      if (user && password_verify(userPin, hashedPin)) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        // Store user in local storage
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful");
        return true;
      } else {
        toast.error("Invalid employee number or PIN");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};


/**
 * Hash a password using a salt.
 *
 * @param password - The password to hash.
 * @param salt - The salt to use for hashing.
 * @returns The hashed password.
 */

function password_hash(password: string, salt: string): string {
  return btoa(password);
}

function password_verify(password: string, hash: string) {
  return btoa(password) === hash
}
