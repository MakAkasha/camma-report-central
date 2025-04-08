
import { TimePeriodFilter } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimePeriodSelectProps {
  options: TimePeriodFilter[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const TimePeriodSelect = ({ options, value, onChange, label }: TimePeriodSelectProps) => {
  return (
    <div className="flex items-center space-x-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePeriodSelect;
