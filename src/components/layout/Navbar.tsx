import { Link, useLocation } from "react-router-dom";
import { Settings, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Chart", path: "/chart" },
  { label: "Options", path: "/options" },
  { label: "Market", path: "/market" },
  { label: "OI Intel", path: "/oi" },
  { label: "TradFi", path: "/tradfi" },
  { label: "Alerts", path: "/alerts" },
];

function ISTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[11px] text-muted-foreground">{time} IST</span>;
}

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="h-11 border-b border-border bg-card flex items-center px-4 shrink-0">
      <Link to="/chart" className="flex items-center gap-1.5 mr-8">
        <Zap className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm tracking-tight text-foreground">NEXUS</span>
      </Link>

      <div className="flex items-center gap-0.5">
        {navLinks.map(link => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
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

      <div className="ml-auto flex items-center gap-3">
        <ISTClock />
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse" />
          <span>Live</span>
        </div>
        <button className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  );
}
