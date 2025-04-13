
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Mock API call to fetch report dates
const fetchReportDates = async () => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  // Mock data - days in the current month with reports
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const reportDates: Date[] = [];
  for (let i = 1; i <= 5; i++) {
    // Generate some random dates with reports
    const randomDay = Math.floor(Math.random() * (lastDay.getDate() - 1) + 1);
    reportDates.push(new Date(today.getFullYear(), today.getMonth(), randomDay));
  }
  
  // Add today if it's a weekday (1-5 is Monday-Friday)
  if (today.getDay() > 0 && today.getDay() < 6) {
    reportDates.push(today);
  }
  
  return reportDates;
};

const Calendar = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: reportDates, isLoading } = useQuery({
    queryKey: ['reportDates'],
    queryFn: fetchReportDates
  });
  
  // Check if the selected date has a report
  const hasReport = (day: Date | undefined): boolean => {
    if (!day || !reportDates) return false;
    
    return reportDates.some(reportDate => 
      reportDate.getDate() === day.getDate() && 
      reportDate.getMonth() === day.getMonth() && 
      reportDate.getFullYear() === day.getFullYear()
    );
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    // Show toast notification based on whether the date has a report
    if (selectedDate) {
      if (hasReport(selectedDate)) {
        toast.success(t('calendar.reportSubmitted'));
      } else {
        toast.info(t('calendar.noReport'));
      }
    }
  };
  
  // Custom day rendering to show which days have reports
  const dayClassNames = (day: Date) => {
    if (!reportDates) return "";
    
    const hasReportForDay = reportDates.some(reportDate => 
      reportDate.getDate() === day.getDate() && 
      reportDate.getMonth() === day.getMonth() && 
      reportDate.getFullYear() === day.getFullYear()
    );
    
    return hasReportForDay ? "bg-primary/20 font-bold" : "";
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('calendar.title')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {t('calendar.title')}
              </CardTitle>
              <CardDescription>
                {t('calendar.selectDate')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiersClassNames={{
                  selected: "bg-primary text-primary-foreground",
                }}
                components={{
                  Day: ({ date, ...dayProps}) => (
                    <div 
                      {...dayProps} 
                      className={`${dayProps?.className || ''} ${dayClassNames(date)}`}
                    >
                      {date.getDate()}
                    </div>
                  )
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{date ? date.toLocaleDateString() : t('calendar.selectDate')}</CardTitle>
              <CardDescription>
                {hasReport(date) ? (
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle className="h-4 w-4" />
                    {t('calendar.reportSubmitted')}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{t('calendar.noReport')}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasReport(date) && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{t('reports.tasks')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? t('common.loading') : "Completed project documentation and attended team meeting."}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{t('reports.meetings')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? t('common.loading') : "Daily standup, Client call with Marketing team."}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{t('reports.challenges')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? t('common.loading') : "Integration issues with legacy system, resolved by EOD."}
                    </p>
                  </div>
                </div>
              )}
              
              {!hasReport(date) && date && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">{t('calendar.noReport')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline" className="bg-primary/20 text-primary">
            {t('calendar.reportSubmitted')}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {t('reports.exportPDF')}
          </span>
        </div>
      </div>
    </AppLayout>
  );
};

export default Calendar;
