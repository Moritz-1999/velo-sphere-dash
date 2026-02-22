function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(77);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface SectorData {
  name: string;
  changePct: number;
  fiiFlow: number;
  diiFlow: number;
  advances: number;
  declines: number;
  pctAbove20DMA: number;
  pctAbove200DMA: number;
  avgIV: number;
  oiChangePct: number;
}

const sectorNames = [
  "Nifty IT", "Nifty Bank", "Nifty Pharma", "Nifty Auto", "Nifty FMCG",
  "Nifty Metal", "Nifty Energy", "Nifty Realty", "Nifty Infra", "Nifty PSU Bank",
  "Nifty Media", "Nifty Fin Service", "Nifty MidCap 100", "Nifty SmallCap 100",
];

export function generateSectors(): SectorData[] {
  return sectorNames.map(name => {
    const total = Math.round(r(30, 50));
    const advances = Math.round(r(8, total - 5));
    return {
      name,
      changePct: r(-3, 3),
      fiiFlow: r(-500, 500) * 1e5,
      diiFlow: r(-400, 400) * 1e5,
      advances,
      declines: total - advances,
      pctAbove20DMA: r(25, 85),
      pctAbove200DMA: r(30, 75),
      avgIV: r(14, 32),
      oiChangePct: r(-6, 6),
    };
  });
}

let _sectors: SectorData[] | null = null;
export function getSectors(): SectorData[] {
  if (!_sectors) _sectors = generateSectors();
  return _sectors;
}
