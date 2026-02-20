import { Link, useLocation } from "react-router-dom";
import { Activity, Settings } from "lucide-react";

const navLinks = [
  { label: "Chart", path: "/chart" },
  { label: "Futures", path: "/futures" },
  { label: "Options", path: "/options" },
  { label: "Market", path: "/market" },
  { label: "TradFi", path: "/tradfi" },
  { label: "VeloAI", path: "/ai" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="h-11 border-b border-border bg-card flex items-center px-4 shrink-0">
      {/* Logo */}
      <Link to="/chart" className="flex items-center gap-1.5 mr-8">
        <Activity className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm tracking-tight">VeloClone</span>
      </Link>

      {/* Center links */}
      <div className="flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xxs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-glow" />
          <span>Live</span>
        </div>
        <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  );
}
