
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Department } from "@/types";
import { departmentColors } from "@/data/mockData";

interface DepartmentsPieChartProps {
  data: {
    name: Department;
    value: number;
  }[];
  loading?: boolean;
}

const DepartmentsPieChart = ({ data, loading = false }: DepartmentsPieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 shadow rounded border text-sm">
          <p className="font-medium">{item.name}</p>
          <p>{`${item.value} reports (${percentage}%)`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full">
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
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={departmentColors[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentsPieChart;
