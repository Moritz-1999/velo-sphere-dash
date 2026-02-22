// Heatmap cell color calculator

export type ColorType = "directional" | "intensity" | "pcr" | "delivery";

export function getDirectionalBg(value: number, maxAbs = 5): string {
  const clamped = Math.max(-1, Math.min(1, value / maxAbs));
  const abs = Math.abs(clamped);
  if (abs < 0.05) return "transparent";
  if (clamped > 0) {
    const alpha = 0.08 + abs * 0.22;
    return `rgba(34, 197, 94, ${alpha.toFixed(2)})`;
  }
  const alpha = 0.08 + abs * 0.22;
  return `rgba(239, 68, 68, ${alpha.toFixed(2)})`;
}

export function getIntensityBg(value: number, max = 100): string {
  const norm = Math.min(1, Math.abs(value) / max);
  if (norm < 0.05) return "transparent";
  const alpha = 0.08 + norm * 0.25;
  return `rgba(99, 102, 241, ${alpha.toFixed(2)})`;
}

export function getPCRBg(value: number): string {
  if (value > 1.2) return `rgba(34, 197, 94, ${Math.min(0.3, (value - 1.2) * 0.3 + 0.1).toFixed(2)})`;
  if (value < 0.8) return `rgba(239, 68, 68, ${Math.min(0.3, (0.8 - value) * 0.3 + 0.1).toFixed(2)})`;
  return "transparent";
}

export function getDeliveryBg(value: number): string {
  if (value > 60) return `rgba(34, 197, 94, ${Math.min(0.25, (value - 60) * 0.005 + 0.08).toFixed(2)})`;
  if (value < 30) return `rgba(239, 68, 68, ${Math.min(0.25, (30 - value) * 0.005 + 0.08).toFixed(2)})`;
  return "transparent";
}

export function getDMABg(value: number): string {
  if (value > 60) return `rgba(34, 197, 94, ${Math.min(0.25, (value - 60) * 0.005 + 0.08).toFixed(2)})`;
  if (value < 40) return `rgba(239, 68, 68, ${Math.min(0.25, (40 - value) * 0.005 + 0.08).toFixed(2)})`;
  return `rgba(245, 158, 11, 0.10)`;
}

export function getCellTextColor(value: number): string {
  if (value > 0.01) return "hsl(var(--positive))";
  if (value < -0.01) return "hsl(var(--negative))";
  return "hsl(var(--foreground))";
}
