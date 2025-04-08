
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { mockReports } from "@/data/mockData";

const NewReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    tasks: "",
    meetings: "",
    challenges: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.tasks.trim()) {
        toast.error("Tasks field is required");
        return;
      }
      
      // In a real app, this would be an API call to submit the report
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add report to mock data (in a real app, this would be done via API)
      const newReport = {
        id: mockReports.length + 1,
        userId: user?.id || 0,
        department: user?.department as any || "Accounting",
        tasks: formData.tasks,
        meetings: formData.meetings,
        challenges: formData.challenges,
        dateSubmitted: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString(),
        userName: user?.name || `User ${user?.employeeNumber}`
      };
      
      mockReports.unshift(newReport);
      
      toast.success("Report submitted successfully");
      navigate("/reports");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Submit Daily Report</h1>
          <p className="text-muted-foreground">Record your daily activities and challenges</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Daily Report</CardTitle>
              <CardDescription>
                Fill out the details of your daily activities for {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tasks" className="text-base">
                  Tasks Completed <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="tasks"
                  name="tasks"
                  value={formData.tasks}
                  onChange={handleChange}
                  placeholder="List the tasks you've completed today..."
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
                  placeholder="Describe any meetings you attended..."
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
                  placeholder="Describe any challenges or blockers..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/reports")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.tasks.trim()}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NewReport;
