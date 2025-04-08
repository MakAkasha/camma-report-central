
import { LucideBarChart } from "lucide-react";

interface LogoProps {
  variant?: "default" | "sidebar";
}

const Logo = ({ variant = "default" }: LogoProps) => {
  const textColor = variant === "sidebar" ? "text-white" : "text-primary";
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white">
        <LucideBarChart size={18} />
      </div>
      <span className={`text-xl font-bold ${textColor}`}>CAMMA</span>
    </div>
  );
};

export default Logo;
