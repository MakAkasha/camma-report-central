
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobile ? (
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-2 left-2 z-50">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <div className="h-full">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:block w-64 h-full">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default AppLayout;
