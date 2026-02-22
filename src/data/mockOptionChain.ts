function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const rand = seededRandom(123);
const r = (min: number, max: number) => min + rand() * (max - min);

export interface OptionStrike {
  strike: number;
  callOI: number;
  callOIChange: number;
  callVol: number;
  callIV: number;
  callLTP: number;
  callChange: number;
  callDelta: number;
  callGamma: number;
  callTheta: number;
  callVega: number;
  putOI: number;
  putOIChange: number;
  putVol: number;
  putIV: number;
  putLTP: number;
  putChange: number;
  putDelta: number;
  putGamma: number;
  putTheta: number;
  putVega: number;
}

export interface OptionChainData {
  index: string;
  spot: number;
  atmIV: number;
  ivPercentile: number;
  pcr: number;
  maxPain: number;
  expectedMove: number;
  expectedMovePct: number;
  expiries: string[];
  strikes: OptionStrike[];
}

function generateChain(index: string, spot: number, step: number): OptionChainData {
  const atm = Math.round(spot / step) * step;
  const strikes: OptionStrike[] = [];
  
  for (let i = -20; i <= 20; i++) {
    const strike = atm + i * step;
    const moneyness = (spot - strike) / spot;
    const distFromATM = Math.abs(i);
    
    const baseIV = 16 + distFromATM * 0.4 + Math.abs(moneyness) * 30;
    const callIV = baseIV + r(-2, 2);
    const putIV = baseIV + r(-2, 2) + (moneyness > 0 ? 1 : -1);
    
    const callIntrinsic = Math.max(0, spot - strike);
    const putIntrinsic = Math.max(0, strike - spot);
    const callTimeValue = spot * (callIV / 100) * Math.sqrt(7 / 365) * r(0.3, 0.7);
    const putTimeValue = spot * (putIV / 100) * Math.sqrt(7 / 365) * r(0.3, 0.7);
    
    const callLTP = callIntrinsic + callTimeValue;
    const putLTP = putIntrinsic + putTimeValue;
    
    const callOI = Math.round(r(5, 80) * 1e4 * Math.max(0.3, 1 - distFromATM * 0.04));
    const putOI = Math.round(r(5, 80) * 1e4 * Math.max(0.3, 1 - distFromATM * 0.04));
    
    const callDelta = moneyness > 0.05 ? r(0.6, 0.95) : moneyness < -0.05 ? r(0.05, 0.4) : r(0.4, 0.6);
    
    strikes.push({
      strike,
      callOI,
      callOIChange: Math.round(r(-15, 25) * 1e3),
      callVol: Math.round(r(1, 40) * 1e3),
      callIV,
      callLTP: Math.max(0.05, callLTP),
      callChange: r(-15, 15),
      callDelta,
      callGamma: r(0.001, 0.01),
      callTheta: -r(2, 20),
      callVega: r(5, 25),
      putOI,
      putOIChange: Math.round(r(-15, 25) * 1e3),
      putVol: Math.round(r(1, 40) * 1e3),
      putIV,
      putLTP: Math.max(0.05, putLTP),
      putChange: r(-15, 15),
      putDelta: -(1 - callDelta),
      putGamma: r(0.001, 0.01),
      putTheta: -r(2, 20),
      putVega: r(5, 25),
    });
  }

  const totalCallOI = strikes.reduce((s, x) => s + x.callOI, 0);
  const totalPutOI = strikes.reduce((s, x) => s + x.putOI, 0);
  const atmStrike = strikes.find(s => s.strike === atm)!;
  const expectedMove = (atmStrike.callLTP + atmStrike.putLTP);

  // Max pain calculation
  const painValues = strikes.map(s => {
    let pain = 0;
    strikes.forEach(os => {
      if (os.strike < s.strike) pain += os.callOI * (s.strike - os.strike);
      if (os.strike > s.strike) pain += os.putOI * (os.strike - s.strike);
    });
    return { strike: s.strike, pain };
  });
  const maxPainStrike = painValues.reduce((a, b) => a.pain < b.pain ? a : b).strike;

  return {
    index,
    spot,
    atmIV: atmStrike.callIV,
    ivPercentile: r(20, 85),
    pcr: totalPutOI / totalCallOI,
    maxPain: maxPainStrike,
    expectedMove,
    expectedMovePct: (expectedMove / spot) * 100,
    expiries: ["27-Feb-2026", "06-Mar-2026", "13-Mar-2026", "27-Mar-2026", "24-Apr-2026", "26-Jun-2026"],
    strikes,
  };
}

let _niftyChain: OptionChainData | null = null;
let _bnfChain: OptionChainData | null = null;

export function getNiftyChain(): OptionChainData {
  if (!_niftyChain) _niftyChain = generateChain("NIFTY", 22480, 50);
  return _niftyChain;
}

export function getBankNiftyChain(): OptionChainData {
  if (!_bnfChain) _bnfChain = generateChain("BANKNIFTY", 48350, 100);
  return _bnfChain;
}
