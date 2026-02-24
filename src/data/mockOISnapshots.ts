function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(555);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface OISnapshot {
  time: string; // HH:MM
  strikes: { strike: number; callOI: number; putOI: number }[];
}

export function generateOISnapshots(): OISnapshot[] {
  const strikes = [];
  const step = 50;
  const atm = 22500;
  for (let i = -10; i <= 10; i++) {
    strikes.push(atm + i * step);
  }

  const snapshots: OISnapshot[] = [];
  // Base OI values
  const baseCallOI = strikes.map(s => {
    const dist = Math.abs(s - atm);
    return Math.round(r(3, 8) * 1e5 * Math.max(0.3, 1 - dist / 2500));
  });
  const basePutOI = strikes.map(s => {
    const dist = Math.abs(s - atm);
    return Math.round(r(3, 8) * 1e5 * Math.max(0.3, 1 - dist / 2500));
  });

  // Generate 75 snapshots (9:15 to 15:30, every 5 min)
  for (let m = 0; m <= 375; m += 5) {
    const hour = Math.floor((9 * 60 + 15 + m) / 60);
    const min = (9 * 60 + 15 + m) % 60;
    if (hour > 15 || (hour === 15 && min > 30)) break;

    const progress = m / 375; // 0 to 1 through the day
    const strikeData = strikes.map((strike, i) => {
      // OI grows through the day with some randomness
      const growthFactor = 1 + progress * r(0.2, 0.8);
      const noise = 1 + (rand() - 0.5) * 0.1;
      return {
        strike,
        callOI: Math.round(baseCallOI[i] * growthFactor * noise),
        putOI: Math.round(basePutOI[i] * growthFactor * noise),
      };
    });

    snapshots.push({
      time: `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      strikes: strikeData,
    });
  }

  return snapshots;
}

let _snapshots: OISnapshot[] | null = null;
export function getOISnapshots(): OISnapshot[] {
  if (!_snapshots) _snapshots = generateOISnapshots();
  return _snapshots;
}
