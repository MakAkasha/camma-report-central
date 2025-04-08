
import { useAuth } from "@/contexts/AuthContext";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Header = () => {
  const { user, logout } = useAuth();
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.name) return user?.employeeNumber?.substring(0, 2) || "U";
    
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {user?.name || `User ${user?.employeeNumber}`}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell size={18} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MessageSquare size={18} />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 mr-4" align="end">
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="font-medium">{user?.name || `User ${user?.employeeNumber}`}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">{user?.department}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
              
              <Button className="w-full" variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
