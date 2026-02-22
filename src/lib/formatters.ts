// Indian number formatting utilities

export function formatINR(value: number, compact = false): string {
  const abs = Math.abs(value);
  if (compact) {
    if (abs >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
    if (abs >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
    if (abs >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  }
  // Indian comma format: 1,23,45,678
  const sign = value < 0 ? "-" : "";
  const str = Math.abs(Math.round(value)).toString();
  if (str.length <= 3) return `₹${sign}${str}`;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${sign}${formatted},${last3}`;
}

export function formatLakhsCr(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  if (abs >= 1e7) return `${sign}₹${(Math.abs(value) / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5) return `${sign}₹${(Math.abs(value) / 1e5).toFixed(1)}L`;
  if (abs >= 1e3) return `${sign}₹${(Math.abs(value) / 1e3).toFixed(1)}K`;
  return `${sign}₹${Math.abs(value).toFixed(0)}`;
}

export function formatPercent(value: number): string {
  return (value >= 0 ? "+" : "") + value.toFixed(2) + "%";
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export function formatCompactINR(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
  if (abs >= 1e3) return `₹${(value / 1e3).toFixed(0)}K`;
  return `₹${value.toFixed(0)}`;
}

export function formatVolume(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `₹${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
  return `₹${value.toFixed(0)}`;
}

export function formatQty(value: number): string {
  if (value >= 1e7) return `${(value / 1e7).toFixed(1)}Cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(1)}L`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
}
