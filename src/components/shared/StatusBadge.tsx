import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  variant: "positive" | "negative" | "neutral" | "warning";
  className?: string;
}

const variantStyles: Record<string, string> = {
  positive: "bg-positive/15 text-positive",
  negative: "bg-negative/15 text-negative",
  neutral: "bg-muted text-muted-foreground",
  warning: "bg-warning/15 text-warning",
};

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded-sm",
      variantStyles[variant],
      className
    )}>
      {label}
    </span>
  );
}
