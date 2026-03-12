import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Activity, ArrowRight, BarChart3, Bell, Brain, Check, ChevronRight,
  Clock, Eye, Globe, Shield, TrendingUp, Zap, Users, Building2, Cpu, Star
} from "lucide-react";

/* ─── Reveal ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated grid background ─── */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px]"
        style={{ background: "radial-gradient(ellipse at center top, hsl(var(--primary) / 0.12), transparent 60%)" }}
      />
      {/* Secondary glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px]"
        style={{ background: "radial-gradient(circle, hsl(var(--positive) / 0.05), transparent 60%)" }}
      />
    </div>
  );
}

/* ─── Floating particles ─── */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Glowing card component ─── */
function GlowCard({ children, className = "", glowColor = "var(--primary)" }: {
  children: React.ReactNode; className?: string; glowColor?: string;
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Glow border effect */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, hsl(${glowColor} / 0.3), transparent 50%, hsl(${glowColor} / 0.15))` }}
      />
      <div className="relative rounded-xl border border-border/20 bg-card/40 backdrop-blur-xl overflow-hidden h-full">
        {/* Subtle inner glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: `radial-gradient(400px circle at 50% 0%, hsl(${glowColor} / 0.06), transparent 60%)` }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

/* ─── Live ticker ─── */
function LiveTicker() {
  const items = [
    { sym: "NIFTY 50", val: 24532, chg: 0.34 }, { sym: "BANKNIFTY", val: 52187, chg: -0.21 },
    { sym: "RELIANCE", val: 2487, chg: 1.24 }, { sym: "TCS", val: 3942, chg: 2.31 },
    { sym: "HDFCBANK", val: 1634, chg: -0.42 }, { sym: "INFY", val: 1567, chg: 1.78 },
    { sym: "SBIN", val: 631, chg: -0.87 }, { sym: "TATAMOTORS", val: 657, chg: -3.12 },
    { sym: "ITC", val: 442, chg: 1.05 }, { sym: "BAJFINANCE", val: 6234, chg: 0.95 },
  ];
  const [data, setData] = useState(items);
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => prev.map(d => ({
        ...d, val: d.val + (Math.random() - 0.48) * d.val * 0.001,
        chg: d.chg + (Math.random() - 0.5) * 0.04,
      })));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const tripled = [...data, ...data, ...data];
  return (
    <div className="w-full overflow-hidden border-y border-border/10 bg-card/20 backdrop-blur-md">
      <motion.div
        className="flex gap-8 py-2.5 whitespace-nowrap"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {tripled.map((d, i) => (
          <span key={i} className="text-[10px] font-mono flex items-center gap-2 shrink-0">
            <span className="text-foreground/40">{d.sym}</span>
            <span className="text-foreground/60 tabular-nums">{d.val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            <span className={`tabular-nums ${d.chg >= 0 ? "text-positive" : "text-negative"}`}>
              {d.chg >= 0 ? "+" : ""}{d.chg.toFixed(2)}%
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Terminal mockup with live data ─── */
function TerminalMockup() {
  const [points, setPoints] = useState(() =>
    Array.from({ length: 50 }, (_, i) => 45 + Math.sin(i * 0.25) * 20 + Math.random() * 8)
  );
  const [trades, setTrades] = useState(() =>
    Array.from({ length: 5 }, () => ({
      sym: ["NIFTY", "BNKNIFTY", "RELIANCE", "TCS", "SBIN"][Math.floor(Math.random() * 5)],
      side: Math.random() > 0.5 ? "BUY" : "SELL",
      qty: Math.floor(100 + Math.random() * 3000),
      price: (1000 + Math.random() * 2000).toFixed(2),
    }))
  );

  useEffect(() => {
    const t1 = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        next.push(Math.max(10, Math.min(90, last + (Math.random() - 0.48) * 5)));
        return next;
      });
    }, 200);
    const t2 = setInterval(() => {
      setTrades(prev => [{
        sym: ["NIFTY", "BNKNIFTY", "RELIANCE", "TCS", "SBIN", "HDFC", "INFY"][Math.floor(Math.random() * 7)],
        side: Math.random() > 0.45 ? "BUY" : "SELL",
        qty: Math.floor(100 + Math.random() * 3000),
        price: (1000 + Math.random() * 2000).toFixed(2),
      }, ...prev.slice(0, 4)]);
    }, 500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 500},${p}`).join(" ");
  const areaD = pathD + " L500,100 L0,100 Z";

  return (
    <div className="relative rounded-xl border border-border/20 bg-card/60 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-primary/5">
      {/* Glow behind */}
      <div className="absolute -inset-10 -z-10 blur-3xl" style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.1), transparent 60%)" }} />

      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/15 bg-background/40">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-negative/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-positive/50" />
        </div>
        <span className="text-[9px] font-mono text-muted-foreground/40 ml-2">gravity.terminal — live overview</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
          <span className="text-[8px] font-mono text-positive/60">LIVE</span>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-3 gap-px bg-border/10">
        {/* Chart */}
        <div className="col-span-2 bg-card/60 p-4 h-44">
          <div className="text-[9px] font-mono text-muted-foreground/50 mb-2 flex items-center gap-2">
            NIFTY 50 · 1s
            <span className="text-positive text-[8px]">24,532.40</span>
          </div>
          <svg viewBox="0 0 500 100" className="w-full h-[calc(100%-20px)]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#chartGlow)" />
            <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <circle cx={500} cy={points[points.length - 1]} r="3" fill="hsl(var(--primary))">
              <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Order flow */}
        <div className="bg-card/60 p-4 h-44 overflow-hidden">
          <div className="text-[9px] font-mono text-muted-foreground/50 mb-2">ORDER FLOW</div>
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {trades.map((t, i) => (
                <motion.div
                  key={`${t.sym}-${t.qty}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 text-[8px] font-mono"
                >
                  <span className={`w-5 ${t.side === "BUY" ? "text-positive" : "text-negative"}`}>{t.side === "BUY" ? "B" : "S"}</span>
                  <span className="text-foreground/50 flex-1">{t.sym}</span>
                  <span className="text-foreground/30 tabular-nums">{t.qty}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Heatmap cells */}
        <div className="col-span-3 bg-card/60 p-4 h-20">
          <div className="text-[9px] font-mono text-muted-foreground/50 mb-2">SECTOR HEATMAP</div>
          <div className="grid grid-cols-12 gap-1 h-[calc(100%-20px)]">
            {Array.from({ length: 24 }).map((_, i) => {
              const isPos = i % 3 !== 1;
              const intensity = 0.12 + (i % 5) * 0.08;
              return (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    background: isPos
                      ? `hsl(var(--positive) / ${intensity})`
                      : `hsl(var(--negative) / ${intensity})`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const features = [
    { icon: <Activity className="h-4 w-4" />, title: "Tick-by-Tick Data", desc: "Sub-100ms latency. Every trade, every order, every tick.", color: "var(--primary)" },
    { icon: <Eye className="h-4 w-4" />, title: "OI Intelligence", desc: "PCR, Max Pain, OI Buildup decoded into signals.", color: "var(--positive)" },
    { icon: <TrendingUp className="h-4 w-4" />, title: "Options Flow", desc: "Greeks, IV surface, GEX detection, smart scanners.", color: "var(--warning)" },
    { icon: <BarChart3 className="h-4 w-4" />, title: "Market Heatmap", desc: "500+ stocks color-coded. Sector rotation at a glance.", color: "var(--negative)" },
    { icon: <Brain className="h-4 w-4" />, title: "Smart Scanners", desc: "Long Buildup, Short Covering, OHL — auto-detected.", color: "var(--neutral)" },
    { icon: <Bell className="h-4 w-4" />, title: "Smart Alerts", desc: "Price, OI, volume-based alerts with push notifications.", color: "var(--primary)" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Fixed nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">GRAVITY</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[11px] text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#terminal" className="hover:text-foreground transition-colors">Terminal</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <motion.button
            onClick={() => navigate("/market")}
            className="h-8 px-5 text-[11px] font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Launch Terminal
          </motion.button>
        </div>
      </header>

      {/* ── Hero ── */}
      <motion.section className="relative pt-28 pb-8 px-6" style={{ opacity: heroOpacity }}>
        <GridBackground />
        <Particles />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Badge */}
          <Reveal>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-positive opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-positive" />
                </span>
                <span className="text-[10px] font-mono text-primary/80 uppercase tracking-[0.15em]">Live · NSE · Tick-by-Tick</span>
              </div>
            </div>
          </Reveal>

          {/* Heading */}
          <Reveal delay={0.1}>
            <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              <span className="block">The future of</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--positive)), hsl(var(--primary)))",
                }}
              >
                Indian trading.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-center text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Institutional-grade analytics, real-time order flow, and options intelligence — 
              all at 50ms latency across 200+ F&O stocks.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
              <motion.button
                onClick={() => navigate("/market")}
                className="group relative h-12 px-8 bg-primary text-primary-foreground text-sm font-semibold rounded-lg flex items-center gap-2 overflow-hidden shadow-xl shadow-primary/25"
                whileHover={{ scale: 1.04, boxShadow: "0 0 50px hsl(var(--primary) / 0.35)" }}
                whileTap={{ scale: 0.96 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <Zap className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Launch Terminal</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
              <motion.button
                className="h-12 px-8 text-sm text-foreground/70 border border-border/20 rounded-lg hover:border-primary/30 hover:text-foreground backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="flex items-center justify-center gap-5 text-[10px] text-muted-foreground/50 mb-14">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Free tier</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> No credit card</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Cancel anytime</span>
            </div>
          </Reveal>

          {/* Terminal Preview */}
          <Reveal delay={0.4}>
            <div className="max-w-4xl mx-auto" id="terminal">
              <TerminalMockup />
            </div>
          </Reveal>
        </div>
      </motion.section>

      {/* ── Ticker ── */}
      <LiveTicker />

      {/* ── Stats strip ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { val: "50ms", label: "Latency" },
                { val: "200+", label: "F&O Stocks" },
                { val: "10K+", label: "Ticks / sec" },
                { val: "99.9%", label: "Uptime" },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground mb-1">{s.val}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3">Capabilities</div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-3">
                Everything you need.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--positive)))" }}
                >
                  Nothing you don't.
                </span>
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Purpose-built for Indian markets. Every feature designed to give you an unfair edge.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <GlowCard glowColor={f.color}>
                  <div className="p-6">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: `hsl(${f.color} / 0.1)`, color: `hsl(${f.color})` }}
                    >
                      {f.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">Made For</div>
              <h2 className="text-2xl sm:text-4xl font-bold">
                Who uses <span className="text-primary">Gravity</span>?
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <TrendingUp className="h-5 w-5" />, title: "Day Traders", desc: "Real-time data and signals for intraday trading." },
              { icon: <BarChart3 className="h-5 w-5" />, title: "Options Traders", desc: "Greeks, IV surface, OI — master F&O." },
              { icon: <Building2 className="h-5 w-5" />, title: "Prop Desks", desc: "Institutional-grade tools for prop firms." },
              { icon: <Users className="h-5 w-5" />, title: "Analysts", desc: "Market microstructure research data." },
            ].map((u, i) => (
              <Reveal key={u.title} delay={i * 0.08}>
                <GlowCard glowColor="var(--primary)">
                  <div className="p-5">
                    <div className="text-primary mb-3">{u.icon}</div>
                    <div className="text-sm font-semibold mb-1">{u.title}</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{u.desc}</div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3">Trusted</div>
              <h2 className="text-2xl sm:text-4xl font-bold">What traders say</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { quote: "Gravity's OI intelligence is unmatched. My win rate improved from 52% to 68% in two months.", name: "Rajesh S.", role: "Options Trader, Mumbai" },
              { quote: "We replaced three platforms with Gravity. The speed and data density is exactly what a prop desk needs.", name: "Priya V.", role: "Head of Trading, Vertex Capital" },
              { quote: "The OHL scanner alone is worth the subscription. I catch momentum moves 15 minutes before the crowd.", name: "Amit D.", role: "Day Trader, 8yr exp" },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <GlowCard>
                  <div className="p-5">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed mb-4 italic">"{t.quote}"</p>
                    <div className="text-xs font-semibold text-foreground">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.role}</div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3">Pricing</div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-2">
                Simple,{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--positive)))" }}
                >
                  transparent
                </span>{" "}
                pricing
              </h2>
              <p className="text-xs text-muted-foreground">Start free. Scale when ready.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Starter", price: "Free", period: "forever", features: ["Delayed data (15 min)", "Basic watchlist", "Market heatmap", "5 alerts"], cta: "Get Started", popular: false },
              { name: "Pro", price: "₹999", period: "/mo", features: ["Real-time tick data", "Unlimited watchlists", "Full OI Intelligence", "Options flow & scanners", "Unlimited alerts", "Priority support"], cta: "Start Free Trial", popular: true },
              { name: "Institutional", price: "₹4,999", period: "/mo", features: ["Everything in Pro", "API access", "Multi-screen support", "Custom scanners", "Dedicated manager"], cta: "Contact Sales", popular: false },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`relative rounded-xl border p-6 flex flex-col h-full backdrop-blur-xl overflow-hidden ${
                  plan.popular ? "border-primary/40 bg-primary/5" : "border-border/15 bg-card/30"
                }`}>
                  {plan.popular && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-widest rounded-sm z-10">
                        Popular
                      </div>
                    </>
                  )}
                  <div className="relative z-10">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-mono font-bold">{plan.price}</span>
                      <span className="text-[10px] text-muted-foreground">{plan.period}</span>
                    </div>
                    <div className="border-t border-border/15 my-3" />
                    <div className="space-y-2 flex-1">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-positive mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`mt-6 w-full py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                          : "border border-border/20 text-foreground hover:border-primary/30"
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.08), transparent 60%)" }} />
        <Reveal>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold mb-5">
              Ready to trade{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--positive)), hsl(var(--warning)))" }}
              >
                faster
              </span>
              ?
            </h2>
            <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">
              Join thousands of traders who've upgraded to Gravity. Your edge starts here.
            </p>
            <motion.button
              onClick={() => navigate("/market")}
              className="group h-12 px-10 bg-primary text-primary-foreground text-sm font-semibold rounded-lg inline-flex items-center gap-2 shadow-xl shadow-primary/25 relative overflow-hidden"
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              <Zap className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Launch Terminal — It's Free</span>
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/10 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Activity className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold">GRAVITY</span>
              </div>
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                India's fastest institutional-grade trading terminal.
              </p>
            </div>
            {[
              { title: "Product", links: ["Terminal", "Features", "Pricing", "API"] },
              { title: "Resources", links: ["Docs", "Blog", "Changelog", "Status"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Legal"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 text-muted-foreground/50">{col.title}</div>
                <div className="space-y-1.5 text-xs text-muted-foreground/60">
                  {col.links.map(l => (
                    <div key={l} className="hover:text-foreground cursor-pointer transition-colors">{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground/40">© 2026 Gravity Technologies Pvt. Ltd.</span>
            <div className="flex gap-4 text-[10px] text-muted-foreground/40">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
