
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const success = await login(employeeNumber, pin);
      if (success) {
        navigate(from);
      } else {
        setError("Invalid credentials");
        toast.error("Invalid credentials");

        navigate(from);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">CAMMA Report Central</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your employee number and PIN to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input
                  id="employeeNumber"
                  placeholder="Enter your employee number"
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !employeeNumber || !pin}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Accounts:</p>
          <p>Admin: 1001 / PIN: 1234</p>
          <p>Manager: 1002 / PIN: 1234</p>
          <p>Employee: 1003 / PIN: 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
