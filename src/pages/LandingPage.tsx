import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Zap, BarChart3, Activity, Shield, Globe, Clock, ArrowRight, Check,
  TrendingUp, Eye, Brain, Bell, ChevronDown, Star, Users, Building2,
  Gauge, Cpu, Radio, MousePointerClick
} from "lucide-react";

/* ─── Animated Counter with blur-to-sharp ─── */
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2, decimals = 0 }: {
  end: number; suffix?: string; prefix?: string; duration?: number; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); setDone(true); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      className="font-mono tabular-nums inline-block"
      animate={{ filter: done ? "blur(0px)" : "blur(1px)" }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("en-IN")}{suffix}
    </motion.span>
  );
}

/* ─── Ticker Tape ─── */
const tickerItems = [
  { sym: "RELIANCE", price: "₹2,487.30", chg: "+1.24%", positive: true },
  { sym: "SBIN", price: "₹631.44", chg: "-0.87%", positive: false },
  { sym: "TCS", price: "₹3,942.77", chg: "+2.31%", positive: true },
  { sym: "HDFCBANK", price: "₹1,634.20", chg: "-0.42%", positive: false },
  { sym: "INFY", price: "₹1,567.85", chg: "+1.78%", positive: true },
  { sym: "TATAMOTORS", price: "₹657.30", chg: "-3.12%", positive: false },
  { sym: "BAJFINANCE", price: "₹6,234.10", chg: "+0.95%", positive: true },
  { sym: "ICICIBANK", price: "₹1,089.65", chg: "+0.63%", positive: true },
  { sym: "NIFTY 50", price: "24,532.40", chg: "+0.34%", positive: true },
  { sym: "BANKNIFTY", price: "52,187.55", chg: "-0.21%", positive: false },
  { sym: "ITC", price: "₹442.15", chg: "+1.05%", positive: true },
  { sym: "ADANIENT", price: "₹2,876.90", chg: "+4.21%", positive: true },
];

function TickerTape() {
  const tripled = [...tickerItems, ...tickerItems, ...tickerItems];
  return (
    <div className="w-full overflow-hidden border-y border-border/20 bg-background/60 backdrop-blur-md">
      <motion.div
        className="flex gap-10 py-2.5 whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {tripled.map((t, i) => (
          <span key={i} className="text-[11px] font-mono flex items-center gap-2">
            <span className="text-foreground/50">{t.sym}</span>
            <span className="text-foreground/30">{t.price}</span>
            <span className={t.positive ? "text-positive" : "text-negative"}>{t.chg}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Floating Math Symbols ─── */
function HFTDataFlow() {
  const symbols = useMemo(() => {
    const chars = [
      "∑", "∫", "∂", "∞", "π", "Δ", "√", "≈", "≠", "±",
      "∏", "∇", "⊕", "⊗", "λ", "θ", "φ", "σ", "μ", "α",
      "β", "γ", "ε", "ω", "ℝ", "ℂ", "ℕ", "∈", "⊂", "∪",
      "∩", "⇒", "⇔", "∀", "∃", "¬", "∧", "∨", "⊥", "⊤",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "1.618", "2.718", "3.14", "0.01", "99.9", "42",
      "%", "÷", "×", "=", "+", "−", "≥", "≤", ">", "<",
      "f(x)", "dx", "dy", "lim", "log", "sin", "cos",
    ];
    return Array.from({ length: 55 }).map((_, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const top = 5 + Math.random() * 90;
      const isNearCenter = top > 25 && top < 65;
      const speed = isNearCenter ? 2 + Math.random() * 3 : 8 + Math.random() * 14;
      return {
        char,
        top: `${top}%`,
        speed,
        delay: Math.random() * 10,
        opacity: isNearCenter ? 0.15 + Math.random() * 0.15 : 0.08 + Math.random() * 0.1,
        size: isNearCenter ? 14 + Math.random() * 6 : 11 + Math.random() * 5,
        direction: i % 2 === 0 ? 1 : -1,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((s, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-foreground/30 select-none"
          style={{
            top: s.top,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
          }}
          initial={{ x: s.direction > 0 ? "-5vw" : "105vw" }}
          animate={{ x: s.direction > 0 ? "105vw" : "-5vw" }}
          transition={{
            duration: s.speed,
            repeat: Infinity,
            delay: s.delay,
            ease: "linear",
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  );
}



/* ─── Orbiting Rings ─── */
function OrbitingRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[300, 450, 600].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: `hsl(var(--primary) / ${0.06 - i * 0.015})`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: i % 2 === 0 ? (20 + i * 10) : -(20 + i * 10),
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Orbiting dot */}
          <motion.div
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: -4,
              left: "50%",
              marginLeft: -4,
              background: i === 0 ? "hsl(var(--primary))" : i === 1 ? "hsl(var(--positive))" : "hsl(var(--warning))",
              boxShadow: `0 0 12px ${i === 0 ? "hsl(var(--primary))" : i === 1 ? "hsl(var(--positive))" : "hsl(var(--warning))"}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Pulsing Glow Orbs ─── */
function GlowOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--positive) / 0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--negative) / 0.05) 0%, transparent 70%)" }}
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

/* ─── Scanning Line ─── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.4) 20%, hsl(var(--primary) / 0.6) 50%, hsl(var(--primary) / 0.4) 80%, transparent 100%)",
        boxShadow: "0 0 20px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.1)",
      }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Live Price Flicker ─── */
function LivePriceFlicker() {
  const [prices, setPrices] = useState([
    { sym: "NIFTY", val: 24532, chg: 0.34 },
    { sym: "BANKNIFTY", val: 52187, chg: -0.21 },
    { sym: "RELIANCE", val: 2487, chg: 1.24 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        val: p.val + (Math.random() - 0.48) * p.val * 0.001,
        chg: p.chg + (Math.random() - 0.5) * 0.1,
      })));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-6">
      {prices.map(p => (
        <div key={p.sym} className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">{p.sym}</span>
          <motion.span
            className="text-xs font-mono font-semibold text-foreground"
            key={p.val.toFixed(1)}
            initial={{ color: p.chg >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)" }}
            animate={{ color: "hsl(240, 10%, 90%)" }}
            transition={{ duration: 0.4 }}
          >
            {p.val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </motion.span>
          <span className={`text-[10px] font-mono ${p.chg >= 0 ? "text-positive" : "text-negative"}`}>
            {p.chg >= 0 ? "+" : ""}{p.chg.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Section Wrapper ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, color, delay = 0 }: {
  icon: React.ReactNode; title: string; desc: string; color: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-card/40 border border-border/40 p-6 hover:border-primary/40 transition-all duration-500 overflow-hidden"
    >
      {/* Animated border glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(300px circle at 50% 0%, ${color}12, transparent 70%)`,
        }}
      />
      {/* Shimmer line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative z-10">
        <motion.div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{ background: `${color}12`, color }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Pricing Card ─── */
function PricingCard({ name, price, period, features, popular, cta, delay = 0 }: {
  name: string; price: string; period: string; features: string[]; popular?: boolean; cta: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`relative p-6 border flex flex-col overflow-hidden ${popular ? "border-primary/50 bg-primary/5" : "border-border/40 bg-card/30"}`}
    >
      {popular && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
            Most Popular
          </div>
        </>
      )}
      <div className="relative z-10">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{name}</div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-mono font-bold text-foreground">{price}</span>
          <span className="text-xs text-muted-foreground">{period}</span>
        </div>
        <div className="border-t border-border/30 my-4" />
        <div className="space-y-2.5 flex-1">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: delay + 0.1 + i * 0.05 }}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <Check className="h-3.5 w-3.5 text-positive mt-0.5 shrink-0" />
              <span>{f}</span>
            </motion.div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-6 w-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${popular
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Testimonial Card ─── */
function TestimonialCard({ quote, name, role, delay = 0 }: {
  quote: string; name: string; role: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -3 }}
      className="bg-card/30 border border-border/30 p-5 relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay * 3 }}
      />
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + 0.3 + i * 0.08, type: "spring", stiffness: 500 }}
          >
            <Star className="h-3 w-3 fill-warning text-warning" />
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed mb-4 italic">"{quote}"</p>
      <div>
        <div className="text-xs font-semibold text-foreground">{name}</div>
        <div className="text-[10px] text-muted-foreground">{role}</div>
      </div>
    </motion.div>
  );
}

/* ─── Live Watchlist Panel ─── */
function LiveWatchlistPanel() {
  const initialStocks = [
    { sym: "RELIANCE", price: 2487.3, chg: 1.24 },
    { sym: "HDFCBANK", price: 1634.2, chg: -0.42 },
    { sym: "TCS", price: 3942.8, chg: 2.31 },
    { sym: "INFY", price: 1567.9, chg: 1.78 },
    { sym: "SBIN", price: 631.4, chg: -0.87 },
    { sym: "BAJFINANCE", price: 6234.1, chg: 0.95 },
  ];
  const [stocks, setStocks] = useState(initialStocks);

  useEffect(() => {
    const timer = setInterval(() => {
      setStocks(prev => prev.map(s => ({
        ...s,
        price: s.price + (Math.random() - 0.48) * s.price * 0.002,
        chg: s.chg + (Math.random() - 0.5) * 0.15,
      })));
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-card/80 p-3 h-48 relative z-10">
      <div className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-2">
        WATCHLIST
        <motion.span
          className="w-1 h-1 rounded-full bg-positive ml-auto"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </div>
      <div className="space-y-0.5">
        {stocks.map((s) => (
          <div key={s.sym} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 text-[10px] py-0.5">
            <span className="font-mono text-foreground/70">{s.sym}</span>
            <motion.span
              className="font-mono text-foreground/60 text-[9px] text-right w-16"
              key={s.price.toFixed(0)}
              initial={{ color: s.chg >= 0 ? "#22c55e" : "#ef4444" }}
              animate={{ color: "#a1a1aa" }}
              transition={{ duration: 0.3 }}
            >
              ₹{s.price.toFixed(1)}
            </motion.span>
            <span className={`font-mono text-[9px] text-right w-12 ${s.chg >= 0 ? "text-positive" : "text-negative"}`}>
              {s.chg >= 0 ? "+" : ""}{s.chg.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Live Chart Panel ─── */
function LiveChartPanel() {
  const [points, setPoints] = useState(() =>
    Array.from({ length: 40 }).map((_, i) => 50 + Math.sin(i * 0.3) * 20 + Math.random() * 10)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        next.push(Math.max(15, Math.min(85, last + (Math.random() - 0.48) * 8)));
        return next;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 400},${p}`).join(" ");
  const areaD = pathD + ` L400,100 L0,100 Z`;
  const isUp = points[points.length - 1] < points[points.length - 2];

  return (
    <div className="bg-card/80 p-3 col-span-2 h-40 relative z-10">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 flex items-center gap-2">
        NIFTY 50 · 1s
        <motion.span
          className="text-[8px] font-mono text-positive"
          key={points[points.length - 1].toFixed(0)}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
        >
          {(24500 + (50 - points[points.length - 1]) * 5).toFixed(2)}
        </motion.span>
        <motion.span
          className="w-1 h-1 rounded-full bg-primary ml-auto"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      </div>
      <svg viewBox="0 0 400 100" className="w-full h-[calc(100%-18px)]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="liveChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#liveChartGrad)" />
        <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        {/* Live dot at end */}
        <circle
          cx={400}
          cy={points[points.length - 1]}
          r="3"
          fill="hsl(var(--primary))"
        >
          <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* ─── Live Order Flow Panel ─── */
function LiveOrderFlowPanel() {
  const [trades, setTrades] = useState(() => 
    Array.from({ length: 6 }).map(() => ({
      sym: ["NIFTY", "BNKNIFTY", "RELIANCE", "SBIN", "TCS", "INFY"][Math.floor(Math.random() * 6)],
      action: Math.random() > 0.5 ? "BUY" : "SELL",
      qty: Math.floor(100 + Math.random() * 5000),
      price: (500 + Math.random() * 3000).toFixed(2),
      time: `${Math.floor(9 + Math.random() * 6)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTrades(prev => {
        const newTrade = {
          sym: ["NIFTY", "BNKNIFTY", "RELIANCE", "SBIN", "TCS", "INFY", "HDFC", "BAJFIN"][Math.floor(Math.random() * 8)],
          action: Math.random() > 0.45 ? "BUY" : "SELL",
          qty: Math.floor(100 + Math.random() * 5000),
          price: (500 + Math.random() * 3000).toFixed(2),
          time: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        };
        return [newTrade, ...prev.slice(0, 5)];
      });
    }, 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-card/80 p-3 h-40 relative z-10 overflow-hidden">
      <div className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-2">
        ORDER FLOW
        <motion.span
          className="w-1 h-1 rounded-full bg-warning ml-auto"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
      <div className="space-y-0.5">
        <AnimatePresence mode="popLayout">
          {trades.map((t, i) => (
            <motion.div
              key={`${t.time}-${t.sym}-${t.qty}`}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 text-[8px] font-mono"
            >
              <span className={`w-6 ${t.action === "BUY" ? "text-positive" : "text-negative"}`}>{t.action}</span>
              <span className="text-foreground/60 flex-1">{t.sym}</span>
              <span className="text-foreground/40">{t.qty}</span>
              <span className="text-foreground/50">₹{t.price}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Animated Gradient Text ─── */
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--positive)), hsl(var(--primary)), hsl(var(--warning)), hsl(var(--primary)))",
      }}
      animate={{ backgroundPosition: ["0% center", "200% center"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* ─── MAIN LANDING PAGE ─── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  // Staggered hero entrance
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  } as const;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── NAV removed ── */}

      {/* ── HERO ── */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="relative min-h-screen flex flex-col items-center justify-center pt-14">
        {/* Background layers */}
        <GlowOrbs />
        {/* OrbitingRings removed */}
        <HFTDataFlow />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 border border-border/30 bg-card/20 backdrop-blur-md mb-8 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-positive"></span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Live · NSE · Tick-by-Tick</span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-foreground">Trade at the</span>
            <br />
            <GradientText>Speed of Data</GradientText>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            India's fastest institutional-grade terminal. Tick-by-tick data, OI intelligence,
            options flow — all in one blazing-fast interface.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <motion.button
              onClick={() => navigate("/market")}
              className="group px-10 py-3.5 bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <Zap className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Launch Terminal</span>
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              className="px-10 py-3.5 border border-border/40 text-foreground text-sm hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.03, borderColor: "hsl(var(--primary) / 0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Speed Counters */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 max-w-3xl mx-auto">
            {[
              { value: 200, suffix: "+", label: "F&O Stocks", icon: <BarChart3 className="h-4 w-4" />, color: "text-muted-foreground" },
              { value: 50, suffix: "ms", label: "Avg Latency", icon: <Gauge className="h-4 w-4" />, color: "text-muted-foreground" },
              { value: 10000, suffix: "+", label: "Ticks/sec", icon: <Cpu className="h-4 w-4" />, color: "text-muted-foreground" },
              { value: 99.9, suffix: "%", label: "Uptime", decimals: 1, icon: <Radio className="h-4 w-4" />, color: "text-muted-foreground" },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="text-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className={`${s.color} opacity-50 mb-2 flex justify-center`}>{s.icon}</div>
                <div className={`text-2xl sm:text-4xl font-bold ${s.color}`}>
                  <AnimatedCounter end={s.value} suffix={s.suffix} duration={2.5} decimals={s.decimals} />
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] text-muted-foreground/40 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground/30" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── TICKER TAPE ── */}
      <TickerTape />

      {/* ── TERMINAL PREVIEW ── */}
      <Section className="py-24 px-6" id="preview">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.div
              className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              The Terminal
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Built for <span className="text-primary">Serious</span> Traders
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Every pixel optimized for information density. No wasted space —
              just raw market data at your fingertips.
            </p>
          </div>

          {/* Terminal mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 60, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ perspective: 1200 }}
          >
            {/* Glow behind terminal */}
            <motion.div
              className="absolute -inset-8 blur-3xl"
              style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15), transparent 70%)" }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-primary/5">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20 bg-background/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-negative/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-positive/60" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/60 ml-2">gravity.terminal — market overview</span>
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-positive"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              {/* Grid of mock panels — LIVE HFT style */}
              <div className="grid grid-cols-3 gap-px bg-border/20 p-px relative overflow-hidden">
                {/* Mini HFT data stream inside terminal */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`term-stream-${i}`}
                      className="absolute whitespace-nowrap font-mono text-[7px] tracking-wider"
                      style={{
                        top: `${8 + i * 12}%`,
                        color: i % 2 === 0 ? "hsl(var(--positive))" : "hsl(var(--negative))",
                        opacity: 0.10,
                      }}
                      animate={{ x: i % 2 === 0 ? ["-30%", "100%"] : ["100%", "-30%"] }}
                      transition={{ duration: 6 + i * 0.8, repeat: Infinity, ease: "linear" }}
                    >
                      {`${["FILL", "BID", "ASK", "TRADE", "CANCEL", "MODIFY", "IOC", "MKT"][i % 8]} ${["RELIANCE", "SBIN", "TCS", "INFY", "HDFC", "BAJFIN", "NIFTY", "BNKN"][i % 8]} ${(1000 + Math.random() * 3000).toFixed(2)} x${Math.floor(100 + Math.random() * 5000)}`}
                    </motion.div>
                  ))}
                </div>

                {/* Panel 1 - Live Heatmap with flashing cells */}
                <div className="bg-card/80 p-3 col-span-2 h-48 relative z-10">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    MARKET HEATMAP
                    <motion.span
                      className="w-1 h-1 rounded-full bg-positive"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <span className="text-[8px] text-muted-foreground/40 ml-auto font-mono">LIVE</span>
                  </div>
                  <div className="grid grid-cols-8 gap-1 h-[calc(100%-20px)]">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const isPositive = i % 3 !== 1;
                      const baseIntensity = 0.15 + (i % 5) * 0.1;
                      return (
                        <motion.div
                          key={i}
                          className="rounded-sm"
                          initial={{ opacity: 0, scale: 0.3 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.03, type: "spring", stiffness: 300 }}
                          animate={{
                            backgroundColor: isPositive
                              ? [
                                  `hsl(142, 71%, 45%, ${baseIntensity})`,
                                  `hsl(142, 71%, 45%, ${baseIntensity + 0.15})`,
                                  `hsl(142, 71%, 45%, ${baseIntensity})`,
                                ]
                              : [
                                  `hsl(0, 84%, 60%, ${baseIntensity})`,
                                  `hsl(0, 84%, 60%, ${baseIntensity + 0.15})`,
                                  `hsl(0, 84%, 60%, ${baseIntensity})`,
                                ],
                          }}
                          // @ts-ignore
                          transition2={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
                          style={{
                            background: isPositive
                              ? `hsl(var(--positive) / ${baseIntensity})`
                              : `hsl(var(--negative) / ${baseIntensity})`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Panel 2 - Live Watchlist with streaming prices */}
                <LiveWatchlistPanel />

                {/* Panel 3 - Live Chart with moving line */}
                <LiveChartPanel />

                {/* Panel 4 - Live Order Flow */}
                <LiveOrderFlowPanel />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Capabilities
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Everything You Need. <span className="text-primary">Nothing You Don't.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Purpose-built for Indian markets. Every feature designed to give you an unfair edge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <FeatureCard delay={0} icon={<Activity className="h-5 w-5" />} title="Tick-by-Tick Data" desc="Real-time market microstructure with sub-100ms latency. Every trade, every order, every tick." color="hsl(var(--primary))" />
            <FeatureCard delay={0.08} icon={<Eye className="h-5 w-5" />} title="OI Intelligence" desc="PCR, Max Pain, OI Buildup, Strike Analysis — decoded into actionable signals in real-time." color="hsl(var(--positive))" />
            <FeatureCard delay={0.16} icon={<TrendingUp className="h-5 w-5" />} title="Options Flow" desc="Full option chain with Greeks, IV surface, GEX flip detection, and smart scanner alerts." color="hsl(var(--warning))" />
            <FeatureCard delay={0.24} icon={<BarChart3 className="h-5 w-5" />} title="Market Heatmap" desc="500+ stocks color-coded by performance. Sector rotation, breadth, and momentum at a glance." color="hsl(var(--negative))" />
            <FeatureCard delay={0.32} icon={<Brain className="h-5 w-5" />} title="Smart Scanners" desc="Long Buildup, Short Covering, OHL signals, Volume Spikes — auto-detected and classified." color="hsl(var(--neutral))" />
            <FeatureCard delay={0.4} icon={<Globe className="h-5 w-5" />} title="Global Context" desc="Track DXY, US yields, crude, gold, and global indices alongside Indian markets." color="hsl(var(--primary))" />
            <FeatureCard delay={0.48} icon={<Bell className="h-5 w-5" />} title="Smart Alerts" desc="Price, OI, volume, and pattern-based alerts with instant push notifications." color="hsl(var(--positive))" />
            <FeatureCard delay={0.56} icon={<Shield className="h-5 w-5" />} title="Institutional Grade" desc="Bank-level security, 99.9% uptime, and data integrity you can trust with real capital." color="hsl(var(--muted-foreground))" />
          </div>
        </div>
      </Section>

      {/* ── SPEED SECTION ── */}
      <Section className="py-24 px-6" id="speed">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-[10px] font-mono text-positive uppercase tracking-[0.2em] mb-3"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Performance
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Built for <GradientText className="font-bold">Speed</GradientText>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              When every millisecond counts, Gravity delivers. Faster data means faster decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { metric: "50ms", label: "End-to-end Latency", desc: "From exchange tick to your screen. Faster than blinking.", icon: <Clock className="h-6 w-6" />, color: "hsl(var(--positive))", bar: 95 },
              { metric: "10K+", label: "Ticks Per Second", desc: "Process entire market depth books in real-time.", icon: <Cpu className="h-6 w-6" />, color: "hsl(var(--primary))", bar: 88 },
              { metric: "<1s", label: "Chart Load Time", desc: "Switch between 500+ symbols instantly. Zero lag.", icon: <MousePointerClick className="h-6 w-6" />, color: "hsl(var(--warning))", bar: 92 },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, boxShadow: `0 20px 40px -20px ${s.color}30` }}
                className="bg-card/30 border border-border/30 p-8 text-center relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(circle at 50% 100%, ${s.color}08, transparent 60%)` }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
                <div className="relative z-10">
                  <div className="flex justify-center mb-4" style={{ color: s.color }}>{s.icon}</div>
                  <motion.div
                    className="text-4xl font-mono font-bold mb-2"
                    style={{ color: s.color }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
                  >
                    {s.metric}
                  </motion.div>
                  <div className="text-xs font-semibold text-foreground mb-1">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground mb-5">{s.desc}</div>
                  <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${s.color}60, ${s.color})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, delay: 0.5 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── WHO IT'S FOR ── */}
      <Section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-[10px] font-mono text-warning uppercase tracking-[0.2em] mb-3"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Made For
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold">
              Who Uses <span className="text-warning">Gravity</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <TrendingUp className="h-5 w-5" />, title: "Day Traders", desc: "Intraday warriors who need real-time data and fast execution signals." },
              { icon: <BarChart3 className="h-5 w-5" />, title: "Options Traders", desc: "Greeks, IV surface, OI analysis — everything to master F&O." },
              { icon: <Building2 className="h-5 w-5" />, title: "Prop Desks", desc: "Institutional-grade tools for prop trading firms and HNI desks." },
              { icon: <Users className="h-5 w-5" />, title: "Market Analysts", desc: "Research analysts who need comprehensive market microstructure data." },
            ].map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 30, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4, borderColor: "hsl(var(--warning) / 0.3)" }}
                className="border border-border/30 p-5 bg-card/20 transition-colors relative overflow-hidden"
              >
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--warning) / 0.3), transparent)" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                />
                <motion.div
                  className="text-warning mb-3"
                  whileHover={{ rotate: 10, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {u.icon}
                </motion.div>
                <div className="text-sm font-semibold mb-1">{u.title}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{u.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="py-24 px-6" id="testimonials">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Trusted
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold">
              What Traders <span className="text-primary">Say</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TestimonialCard delay={0} quote="Gravity's OI intelligence is unmatched. I can see institutional activity before the move happens. My win rate improved from 52% to 68% in just two months." name="Rajesh Sharma" role="Full-time Options Trader, Mumbai" />
            <TestimonialCard delay={0.15} quote="We replaced three different platforms with Gravity. The speed and data density is exactly what a prop desk needs. Our analysts won't use anything else now." name="Priya Venkatesh" role="Head of Trading, Vertex Capital" />
            <TestimonialCard delay={0.3} quote="The OHL scanner and buildup classifier alone are worth the subscription. I catch momentum moves 10-15 minutes before the crowd. Game changer." name="Amit Deshmukh" role="Day Trader, 8 years experience" />
          </div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section className="py-24 px-6" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3"
              initial={{ letterSpacing: "0.5em", opacity: 0 }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Pricing
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Simple, <GradientText>Transparent</GradientText> Pricing
            </h2>
            <p className="text-sm text-muted-foreground">Start free. Scale when ready. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PricingCard delay={0} name="Starter" price="Free" period="forever" features={["Delayed market data (15 min)", "Basic watchlist (20 stocks)", "Market heatmap", "5 alerts", "Community support"]} cta="Get Started" />
            <PricingCard delay={0.15} name="Pro" price="₹999" period="/month" popular features={["Real-time tick-by-tick data", "Unlimited watchlists", "Full OI Intelligence suite", "Options flow & scanners", "Unlimited alerts + push", "Priority support"]} cta="Start Free Trial" />
            <PricingCard delay={0.3} name="Institutional" price="₹4,999" period="/month" features={["Everything in Pro", "API access", "Multi-screen support", "Custom scanners", "Dedicated account manager", "White-label options"]} cta="Contact Sales" />
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="py-28 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            className="absolute -inset-20 blur-[100px]"
            style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.1), transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10">
            <motion.h2
              className="text-3xl sm:text-5xl font-bold mb-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Ready to Trade <GradientText>Faster</GradientText>?
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground max-w-lg mx-auto mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of traders who've already upgraded to Gravity.
              Your edge starts here.
            </motion.p>
            <motion.button
              onClick={() => navigate("/market")}
              className="group px-12 py-4 bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 inline-flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 0 60px hsl(var(--primary) / 0.5)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <Zap className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Launch Terminal — It's Free</span>
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.div
              className="flex items-center justify-center gap-6 mt-8 text-[10px] text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> No credit card</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Free forever plan</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Cancel anytime</span>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/20 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold">GRAVITY</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                India's fastest trading terminal. Built for traders who demand speed and precision.
              </p>
            </div>
            {[
              { title: "Product", links: ["Terminal", "Features", "Pricing", "API"] },
              { title: "Resources", links: ["Documentation", "Blog", "Changelog", "Status"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Legal"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">{col.title}</div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {col.links.map(l => (
                    <div key={l} className="hover:text-foreground cursor-pointer transition-colors">{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[10px] text-muted-foreground">© 2026 Gravity Technologies Pvt. Ltd. All rights reserved.</span>
            <div className="flex gap-4 text-[10px] text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
