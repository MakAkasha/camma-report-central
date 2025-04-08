
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, UserCog, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { User, Department, UserRole } from "@/types";

// Mock API call to fetch users
const fetchUsers = async (): Promise<User[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  // Mock data
  return [
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
    },
    {
      id: 4,
      employeeNumber: "1004",
      email: "employee2@camma.com",
      role: "employee",
      department: "Wholesale",
      name: "Employee Two"
    }
  ];
};

const departments: Department[] = [
  "Branches Management", 
  "Accounting", 
  "Digital Marketing", 
  "Wholesale"
];

const roles: UserRole[] = ["employee", "manager", "admin"];

const AdminUsers = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    employeeNumber: "",
    name: "",
    email: "",
    department: "Digital Marketing" as Department,
    role: "employee" as UserRole,
    pin: ""
  });
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddUser = () => {
    // Reset form and open dialog
    setFormData({
      employeeNumber: "",
      name: "",
      email: "",
      department: "Digital Marketing",
      role: "employee",
      pin: ""
    });
    setEditingUser(null);
    setIsDialogOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setFormData({
      employeeNumber: user.employeeNumber,
      name: user.name || "",
      email: user.email,
      department: user.department as Department,
      role: user.role,
      pin: "" // We don't populate the PIN for editing
    });
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  
  const handleResetPin = (user: User) => {
    setEditingUser(user);
    setIsResetDialogOpen(true);
  };
  
  const submitUserForm = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success(editingUser ? "User updated successfully" : "User added successfully");
      setIsDialogOpen(false);
      refetch(); // Refresh the users list
    }, 1000);
  };
  
  const submitPinReset = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success("PIN reset successfully");
      setIsResetDialogOpen(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('users.title')}</h1>
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t('users.addUser')}
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('users.title')}
            </CardTitle>
            <CardDescription>
              {t('users.title')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">{t('common.loading')}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('users.employeeNumber')}</TableHead>
                    <TableHead>{t('users.name')}</TableHead>
                    <TableHead>{t('users.email')}</TableHead>
                    <TableHead>{t('users.department')}</TableHead>
                    <TableHead>{t('users.role')}</TableHead>
                    <TableHead>{t('users.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.employeeNumber}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            {t('common.edit')}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleResetPin(user)}>
                            {t('settings.changePin')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {/* Add/Edit User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? t('users.editUser') : t('users.addUser')}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? "Update user details below" : "Fill in the user details below"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeNumber" className="text-right">
                  {t('users.employeeNumber')}
                </Label>
                <Input
                  id="employeeNumber"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleFormChange}
                  className="col-span-3"
                  disabled={!!editingUser}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t('users.name')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  {t('users.email')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  {t('users.department')}
                </Label>
                <Select 
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('users.department')} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  {t('users.role')}
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value as UserRole)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('users.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pin" className="text-right">
                    {t('users.pin')}
                  </Label>
                  <Input
                    id="pin"
                    name="pin"
                    type="password"
                    value={formData.pin}
                    onChange={handleFormChange}
                    className="col-span-3"
                    maxLength={4}
                    minLength={4}
                    required={!editingUser}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={submitUserForm}>
                {editingUser ? t('common.save') : t('users.addUser')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Reset PIN Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('settings.changePin')}</DialogTitle>
              <DialogDescription>
                Reset PIN for {editingUser?.name || editingUser?.employeeNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-pin" className="text-right">
                  {t('settings.newPin')}
                </Label>
                <Input
                  id="new-pin"
                  type="password"
                  className="col-span-3"
                  maxLength={4}
                  minLength={4}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-pin" className="text-right">
                  {t('settings.confirmPin')}
                </Label>
                <Input
                  id="confirm-pin"
                  type="password"
                  className="col-span-3"
                  maxLength={4}
                  minLength={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={submitPinReset}>
                {t('settings.changePin')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
