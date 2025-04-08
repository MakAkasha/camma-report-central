
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { mockReports } from "@/data/mockData";
import { Report } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, Download, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    tasks: "",
    meetings: "",
    challenges: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user can edit the report
  const canEdit = () => {
    if (!report || !user) return false;
    
    // Admin can edit any report
    if (user.role === "admin") return true;
    
    // User can edit their own report if it was submitted today
    if (report.userId === user.id) {
      const today = new Date().toISOString().split('T')[0];
      return report.dateSubmitted === today;
    }
    
    return false;
  };
  
  useEffect(() => {
    // Simulate API call to get report
    const fetchReport = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find report by ID
        const reportData = mockReports.find(r => r.id === Number(id));
        
        if (reportData) {
          setReport(reportData);
          setFormData({
            tasks: reportData.tasks,
            meetings: reportData.meetings || "",
            challenges: reportData.challenges || ""
          });
        } else {
          toast.error("Report not found");
          navigate("/reports");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchReport();
    }
  }, [id, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.tasks.trim()) {
        toast.error("Tasks field is required");
        return;
      }
      
      // In a real app, this would be an API call to update the report
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update report in mock data (in a real app, this would be done via API)
      if (report) {
        const updatedReport = {
          ...report,
          tasks: formData.tasks,
          meetings: formData.meetings,
          challenges: formData.challenges,
          lastUpdated: new Date().toISOString()
        };
        
        const index = mockReports.findIndex(r => r.id === report.id);
        if (index !== -1) {
          mockReports[index] = updatedReport;
          setReport(updatedReport);
        }
      }
      
      toast.success("Report updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      // In a real app, this would be an API call to delete the report
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove report from mock data (in a real app, this would be done via API)
      const index = mockReports.findIndex(r => r.id === Number(id));
      if (index !== -1) {
        mockReports.splice(index, 1);
      }
      
      toast.success("Report deleted successfully");
      navigate("/reports");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };
  
  // Export as PDF (mock)
  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here");
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  if (!report) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-medium mb-2">Report Not Found</h2>
              <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => navigate("/reports")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/reports")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Report Details</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            
            {canEdit() && !editing && (
              <Button onClick={() => setEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            
            {user?.role === "admin" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Report</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this report? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {editing ? "Edit Report" : `Daily Report - ${format(new Date(report.dateSubmitted), "MMMM d, yyyy")}`}
            </CardTitle>
            <CardDescription>
              {editing ? 
                "Make changes to this report" : 
                `Submitted by ${report.userName} (${report.department})`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {editing ? (
              // Edit mode
              <>
                <div className="space-y-2">
                  <Label htmlFor="tasks" className="text-base">
                    Tasks Completed <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="tasks"
                    name="tasks"
                    value={formData.tasks}
                    onChange={handleChange}
                    className="min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meetings" className="text-base">
                    Meetings Attended
                  </Label>
                  <Textarea
                    id="meetings"
                    name="meetings"
                    value={formData.meetings}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="challenges" className="text-base">
                    Challenges Faced
                  </Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
              </>
            ) : (
              // View mode
              <>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Tasks Completed</h3>
                  <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                    {report.tasks || "No tasks recorded."}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Meetings Attended</h3>
                  <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                    {report.meetings || "No meetings recorded."}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Challenges Faced</h3>
                  <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                    {report.challenges || "No challenges recorded."}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          {editing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  // Reset form data to original values
                  setFormData({
                    tasks: report.tasks,
                    meetings: report.meetings || "",
                    challenges: report.challenges || ""
                  });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting || !formData.tasks.trim()}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <div className="text-sm text-muted-foreground">
          <p>Last updated: {format(new Date(report.lastUpdated), "MMMM d, yyyy 'at' h:mm a")}</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportDetails;
