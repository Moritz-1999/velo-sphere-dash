// Black-Scholes utilities for GEX calculation

function normalCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export function bsGamma(S: number, K: number, T: number, r: number, sigma: number): number {
  if (T <= 0 || sigma <= 0) return 0;
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const nd1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);
  return nd1 / (S * sigma * Math.sqrt(T));
}

export interface GEXPoint {
  strike: number;
  gex: number;
}

export function calculateGEX(
  spot: number,
  strikes: { strike: number; callOI: number; putOI: number; callIV: number; putIV: number }[],
  daysToExpiry = 7,
  riskFreeRate = 0.065
): GEXPoint[] {
  const T = daysToExpiry / 365;
  return strikes.map(s => {
    const callGamma = bsGamma(spot, s.strike, T, riskFreeRate, s.callIV / 100);
    const putGamma = bsGamma(spot, s.strike, T, riskFreeRate, s.putIV / 100);
    // Dealers are short calls, long puts (usually)
    const gex = (s.callOI * callGamma - s.putOI * putGamma) * spot * spot * 0.01;
    return { strike: s.strike, gex };
  });
}
