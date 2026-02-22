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
  return (
    <td
      className={cn(
        "px-2 py-1 text-xs border-r border-border/50 whitespace-nowrap transition-colors duration-300",
        mono && "font-mono",
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {children || value}
    </td>
  );
}
