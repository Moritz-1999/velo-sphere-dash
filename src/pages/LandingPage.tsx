import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Zap, BarChart3, Activity, Shield, Globe, Clock, ArrowRight, Check,
  TrendingUp, Eye, Brain, Bell, ChevronDown, Star, Users, Building2,
  Gauge, Cpu, Radio, MousePointerClick
} from "lucide-react";

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2, decimals = 0 }: {
  end: number; suffix?: string; prefix?: string; duration?: number; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("en-IN")}{suffix}
    </span>
  );
}

/* ─── Ticker Tape ─── */
const tickerItems = [
  { sym: "RELIANCE", chg: "+1.24%", positive: true },
  { sym: "SBIN", chg: "-0.87%", positive: false },
  { sym: "TCS", chg: "+2.31%", positive: true },
  { sym: "HDFCBANK", chg: "-0.42%", positive: false },
  { sym: "INFY", chg: "+1.78%", positive: true },
  { sym: "TATAMOTORS", chg: "-3.12%", positive: false },
  { sym: "BAJFINANCE", chg: "+0.95%", positive: true },
  { sym: "ICICIBANK", chg: "+0.63%", positive: true },
  { sym: "NIFTY 50", chg: "+0.34%", positive: true },
  { sym: "BANKNIFTY", chg: "-0.21%", positive: false },
  { sym: "HINDUNILVR", chg: "+0.18%", positive: true },
  { sym: "ITC", chg: "+1.05%", positive: true },
  { sym: "ONGC", chg: "-1.56%", positive: false },
  { sym: "ADANIENT", chg: "+4.21%", positive: true },
];

function TickerTape() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="w-full overflow-hidden border-y border-border/30 bg-black/40 backdrop-blur-sm">
      <motion.div
        className="flex gap-8 py-2 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="text-xs font-mono flex items-center gap-2 opacity-60">
            <span className="text-foreground/70">{t.sym}</span>
            <span className={t.positive ? "text-positive" : "text-negative"}>{t.chg}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0
              ? "hsl(var(--primary))"
              : i % 3 === 1
              ? "hsl(var(--positive))"
              : "hsl(var(--negative))",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Grid Background ─── */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-positive/3 blur-[100px]" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-negative/3 blur-[80px]" />
    </div>
  );
}

/* ─── Data Stream Lines ─── */
function DataStreamLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            top: `${15 + i * 15}%`,
            left: 0,
            right: 0,
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)`,
          }}
          animate={{ opacity: [0, 0.6, 0], x: ["-100%", "0%", "100%"] }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-card/50 border border-border/50 p-6 hover:border-primary/30 transition-all duration-500 hover:bg-card/80"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}08, transparent)` }}
      />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`relative p-6 border ${popular ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card/30"} flex flex-col`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
          Most Popular
        </div>
      )}
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{name}</div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-mono font-bold text-foreground">{price}</span>
        <span className="text-xs text-muted-foreground">{period}</span>
      </div>
      <div className="border-t border-border/30 my-4" />
      <div className="space-y-2.5 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-positive mt-0.5 shrink-0" />
            <span>{f}</span>
          </div>
        ))}
      </div>
      <button className={`mt-6 w-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${popular
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
      }`}>
        {cta}
      </button>
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="bg-card/30 border border-border/30 p-5"
    >
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-warning text-warning" />
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

/* ─── MAIN LANDING PAGE ─── */
const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">GRAVITY</span>
            <span className="text-[9px] font-mono text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded ml-1">BETA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#speed" className="hover:text-foreground transition-colors">Speed</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Log in
            </button>
            <button
              onClick={() => navigate("/market")}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center gap-1.5"
            >
              Launch Terminal <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex flex-col items-center justify-center pt-14">
        <GridBackground />
        <FloatingParticles />
        <DataStreamLines />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-border/50 bg-card/30 backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-positive"></span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Live · NSE + BSE · Tick-by-Tick</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-foreground">Trade at the </span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-[hsl(var(--positive))] to-primary bg-clip-text text-transparent">
              Speed of Light
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            India's fastest institutional-grade terminal. Tick-by-tick data, OI intelligence, 
            options flow, and market microstructure — all in one blazing-fast interface.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <button
              onClick={() => navigate("/market")}
              className="group px-8 py-3 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Zap className="h-4 w-4" /> Launch Terminal
            </button>
            <button className="px-8 py-3 border border-border/50 text-foreground text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              Watch Demo
            </button>
          </motion.div>

          {/* Speed Counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: 500, suffix: "+", label: "F&O Stocks", icon: <BarChart3 className="h-4 w-4" /> },
              { value: 50, suffix: "ms", label: "Avg Latency", icon: <Gauge className="h-4 w-4" /> },
              { value: 10000, suffix: "+", label: "Ticks/sec", icon: <Cpu className="h-4 w-4" /> },
              { value: 99.9, suffix: "%", label: "Uptime", decimals: 1, icon: <Radio className="h-4 w-4" /> },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-muted-foreground/50 mb-1">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  <AnimatedCounter end={s.value} suffix={s.suffix} duration={2.5} decimals={s.decimals} />
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── TICKER TAPE ── */}
      <TickerTape />

      {/* ── TERMINAL PREVIEW ── */}
      <Section className="py-20 px-6" id="preview">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">The Terminal</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Built for <span className="text-primary">Serious</span> Traders</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Every pixel optimized for information density. No wasted space, no unnecessary animations — 
              just raw market data at your fingertips.
            </p>
          </div>

          {/* Terminal mockup frame */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-2xl" />
            <div className="relative border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-background/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-negative/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-positive/60" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground ml-2">gravity.terminal — market overview</span>
              </div>
              {/* Grid of mock panels */}
              <div className="grid grid-cols-3 gap-px bg-border/30 p-px">
                {/* Panel 1 - Mini heatmap */}
                <div className="bg-card p-3 col-span-2 h-48">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-2">MARKET HEATMAP</div>
                  <div className="grid grid-cols-8 gap-1 h-[calc(100%-20px)]">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const isPositive = Math.random() > 0.45;
                      const intensity = Math.random() * 0.6 + 0.1;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 + i * 0.03 }}
                          className="rounded-sm"
                          style={{
                            background: isPositive
                              ? `hsl(var(--positive) / ${intensity})`
                              : `hsl(var(--negative) / ${intensity})`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Panel 2 - Watchlist */}
                <div className="bg-card p-3 h-48">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-2">WATCHLIST</div>
                  <div className="space-y-1">
                    {[
                      { sym: "RELIANCE", p: "₹2,487", c: "+1.24%", pos: true },
                      { sym: "HDFCBANK", p: "₹1,634", c: "-0.42%", pos: false },
                      { sym: "TCS", p: "₹3,942", c: "+2.31%", pos: true },
                      { sym: "INFY", p: "₹1,567", c: "+1.78%", pos: true },
                      { sym: "SBIN", p: "₹631", c: "-0.87%", pos: false },
                      { sym: "BAJFINANCE", p: "₹6,234", c: "+0.95%", pos: true },
                    ].map((s, i) => (
                      <motion.div
                        key={s.sym}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + i * 0.08 }}
                        className="flex items-center justify-between text-[10px] py-0.5"
                      >
                        <span className="font-mono text-foreground/70">{s.sym}</span>
                        <span className={`font-mono ${s.pos ? "text-positive" : "text-negative"}`}>{s.c}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* Panel 3 - Chart line */}
                <div className="bg-card p-3 col-span-2 h-40">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-2">NIFTY 50 · 5min</div>
                  <svg viewBox="0 0 400 100" className="w-full h-[calc(100%-20px)]">
                    <motion.path
                      d="M0,60 Q20,55 40,50 T80,45 T120,55 T160,40 T200,35 T240,42 T280,30 T320,25 T360,28 T400,20"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M0,60 Q20,55 40,50 T80,45 T120,55 T160,40 T200,35 T240,42 T280,30 T320,25 T360,28 T400,20 L400,100 L0,100 Z"
                      fill="url(#chartGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ duration: 1, delay: 3 }}
                    />
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {/* Panel 4 - OI data */}
                <div className="bg-card p-3 h-40">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-2">OI PULSE</div>
                  <div className="space-y-2">
                    {[
                      { label: "Nifty PCR", val: "1.24", color: "text-positive" },
                      { label: "Max Pain", val: "₹24,500", color: "text-foreground" },
                      { label: "VIX", val: "13.45", color: "text-warning" },
                      { label: "FII L/S", val: "0.72", color: "text-negative" },
                    ].map((m, i) => (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 + i * 0.15 }}
                        className="flex justify-between text-[10px]"
                      >
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className={`font-mono ${m.color}`}>{m.val}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section className="py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">Capabilities</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything You Need. <span className="text-primary">Nothing You Don't.</span></h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Purpose-built for Indian markets. Every feature designed to give you an unfair edge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <FeatureCard delay={0} icon={<Activity className="h-5 w-5" />} title="Tick-by-Tick Data" desc="Real-time market microstructure with sub-100ms latency. Every trade, every order, every tick." color="hsl(var(--primary))" />
            <FeatureCard delay={0.05} icon={<Eye className="h-5 w-5" />} title="OI Intelligence" desc="PCR, Max Pain, OI Buildup, Strike Analysis — decoded into actionable signals in real-time." color="hsl(var(--positive))" />
            <FeatureCard delay={0.1} icon={<TrendingUp className="h-5 w-5" />} title="Options Flow" desc="Full option chain with Greeks, IV surface, GEX flip detection, and smart scanner alerts." color="hsl(var(--warning))" />
            <FeatureCard delay={0.15} icon={<BarChart3 className="h-5 w-5" />} title="Market Heatmap" desc="500+ stocks color-coded by performance. Sector rotation, breadth, and momentum at a glance." color="hsl(var(--negative))" />
            <FeatureCard delay={0.2} icon={<Brain className="h-5 w-5" />} title="Smart Scanners" desc="Long Buildup, Short Covering, OHL signals, Volume Spikes — auto-detected and classified." color="hsl(var(--neutral))" />
            <FeatureCard delay={0.25} icon={<Globe className="h-5 w-5" />} title="Global Context" desc="Track DXY, US yields, crude, gold, and global indices alongside Indian markets." color="hsl(var(--primary))" />
            <FeatureCard delay={0.3} icon={<Bell className="h-5 w-5" />} title="Smart Alerts" desc="Price, OI, volume, and pattern-based alerts with instant push notifications." color="hsl(var(--positive))" />
            <FeatureCard delay={0.35} icon={<Shield className="h-5 w-5" />} title="Institutional Grade" desc="Bank-level security, 99.9% uptime, and data integrity you can trust with real capital." color="hsl(var(--muted-foreground))" />
          </div>
        </div>
      </Section>

      {/* ── SPEED SECTION ── */}
      <Section className="py-20 px-6" id="speed">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono text-positive uppercase tracking-widest mb-3">Performance</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Built for <span className="text-positive">Speed</span></h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              When every millisecond counts, Gravity delivers. Faster data means faster decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                metric: "50ms",
                label: "End-to-end Latency",
                desc: "From exchange tick to your screen. Faster than blinking.",
                icon: <Clock className="h-5 w-5" />,
                color: "hsl(var(--positive))",
                bar: 95,
              },
              {
                metric: "10K+",
                label: "Ticks Per Second",
                desc: "Process entire market depth books in real-time.",
                icon: <Cpu className="h-5 w-5" />,
                color: "hsl(var(--primary))",
                bar: 88,
              },
              {
                metric: "<1s",
                label: "Chart Load Time",
                desc: "Switch between 500+ symbols instantly. Zero lag.",
                icon: <MousePointerClick className="h-5 w-5" />,
                color: "hsl(var(--warning))",
                bar: 92,
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card/30 border border-border/30 p-6 text-center"
              >
                <div className="flex justify-center mb-4" style={{ color: s.color }}>{s.icon}</div>
                <div className="text-3xl font-mono font-bold mb-1" style={{ color: s.color }}>{s.metric}</div>
                <div className="text-xs font-semibold text-foreground mb-1">{s.label}</div>
                <div className="text-[10px] text-muted-foreground mb-4">{s.desc}</div>
                <div className="h-1 bg-border/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.bar}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── WHO IT'S FOR ── */}
      <Section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono text-warning uppercase tracking-widest mb-3">Made For</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Who Uses <span className="text-warning">Gravity</span>?</h2>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="border border-border/30 p-5 bg-card/20 hover:bg-card/40 transition-colors"
              >
                <div className="text-warning mb-3">{u.icon}</div>
                <div className="text-sm font-semibold mb-1">{u.title}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{u.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section className="py-20 px-6" id="testimonials">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">Trusted</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">What Traders <span className="text-primary">Say</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TestimonialCard delay={0} quote="Gravity's OI intelligence is unmatched. I can see institutional activity before the move happens. My win rate improved from 52% to 68% in just two months." name="Rajesh Sharma" role="Full-time Options Trader, Mumbai" />
            <TestimonialCard delay={0.1} quote="We replaced three different platforms with Gravity. The speed and data density is exactly what a prop desk needs. Our analysts won't use anything else now." name="Priya Venkatesh" role="Head of Trading, Vertex Capital" />
            <TestimonialCard delay={0.2} quote="The OHL scanner and buildup classifier alone are worth the subscription. I catch momentum moves 10-15 minutes before the crowd. Game changer." name="Amit Deshmukh" role="Day Trader, 8 years experience" />
          </div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section className="py-20 px-6" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Simple, <span className="text-primary">Transparent</span> Pricing</h2>
            <p className="text-sm text-muted-foreground">Start free. Scale when ready. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PricingCard
              delay={0}
              name="Starter"
              price="Free"
              period="forever"
              features={[
                "Delayed market data (15 min)",
                "Basic watchlist (20 stocks)",
                "Market heatmap",
                "5 alerts",
                "Community support",
              ]}
              cta="Get Started"
            />
            <PricingCard
              delay={0.1}
              name="Pro"
              price="₹999"
              period="/month"
              popular
              features={[
                "Real-time tick-by-tick data",
                "Unlimited watchlists",
                "Full OI Intelligence suite",
                "Options flow & scanners",
                "Unlimited alerts + push",
                "Priority support",
              ]}
              cta="Start Free Trial"
            />
            <PricingCard
              delay={0.2}
              name="Institutional"
              price="₹4,999"
              period="/month"
              features={[
                "Everything in Pro",
                "API access",
                "Multi-screen support",
                "Custom scanners",
                "Dedicated account manager",
                "White-label options",
              ]}
              cta="Contact Sales"
            />
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <Section className="py-24 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Trade <span className="text-primary">Faster</span>?
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Join thousands of traders who've already upgraded to Gravity. 
              Your edge starts here.
            </p>
            <button
              onClick={() => navigate("/market")}
              className="group px-10 py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 inline-flex items-center gap-2 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Zap className="h-4 w-4" /> Launch Terminal — It's Free
            </button>
            <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> No credit card</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Free forever plan</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/30 py-12 px-6">
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
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Product</div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Terminal</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Features</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Pricing</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">API</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Resources</div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Documentation</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Blog</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Changelog</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Status</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Company</div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">About</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Careers</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Contact</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Legal</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
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
