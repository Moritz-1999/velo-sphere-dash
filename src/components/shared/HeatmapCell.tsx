import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeatmapCellProps {
  value: string | number;
  bgColor?: string;
  textColor?: string;
  align?: "left" | "right" | "center";
  mono?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function HeatmapCell({
  value,
  bgColor = "transparent",
  textColor,
  align = "right",
  mono = true,
  className,
  children,
}: HeatmapCellProps) {
  const prevValue = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (prevValue.current !== value) {
      const prev = typeof prevValue.current === "number" ? prevValue.current : parseFloat(String(prevValue.current));
      const curr = typeof value === "number" ? value : parseFloat(String(value));
      if (!isNaN(prev) && !isNaN(curr) && prev !== curr) {
        setFlash(curr > prev ? "up" : "down");
        const t = setTimeout(() => setFlash(null), 350);
        prevValue.current = value;
        return () => clearTimeout(t);
      }
      prevValue.current = value;
    }
  }, [value]);

  return (
    <td
      className={cn(
        "px-2 py-1 text-xs border-r border-border/50 whitespace-nowrap transition-all duration-200",
        mono && "font-mono",
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
        flash === "up" && "!bg-positive/20",
        flash === "down" && "!bg-negative/20",
        className
      )}
      style={{ backgroundColor: flash ? undefined : bgColor, color: textColor }}
    >
      {children || value}
    </td>
  );
}
