import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({ data, width = 60, height = 16, color, className }: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${x},${y}`;
    });
    return `M${points.join("L")}`;
  }, [data, width, height]);

  const lineColor = color || (data[data.length - 1] >= data[0] ? "hsl(var(--positive))" : "hsl(var(--negative))");

  return (
    <svg width={width} height={height} className={className}>
      <path d={path} fill="none" stroke={lineColor} strokeWidth={1.2} />
    </svg>
  );
}
