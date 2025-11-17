import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Settings, LogOut } from "lucide-react";

const Navigation = () => {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-xl font-bold text-foreground">
            Ad Proof Manager
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link
              to="/clients"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Users className="h-4 w-4" />
              Clients
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>

        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default Navigation;
