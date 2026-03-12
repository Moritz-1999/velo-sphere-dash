import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Activity, ArrowRight, BarChart3, Bell, Brain, Check, ChevronRight,
  Clock, Eye, Globe, Shield, TrendingUp, Zap, Users, Building2
} from "lucide-react";

/* ─── Fade-in wrapper ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Live market numbers for hero ─── */
function MarketStrip() {
  const items = [
    { label: "NIFTY 50", value: 24532, chg: +0.34 },
    { label: "BANKNIFTY", value: 52187, chg: -0.21 },
    { label: "RELIANCE", value: 2487, chg: +1.24 },
    { label: "HDFCBANK", value: 1634, chg: -0.42 },
    { label: "TCS", value: 3942, chg: +2.31 },
    { label: "INDIA VIX", value: 14.2, chg: -3.8 },
  ];

  const [data, setData] = useState(items);
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => prev.map(d => ({
        ...d,
        value: d.value + (Math.random() - 0.48) * d.value * 0.001,
        chg: d.chg + (Math.random() - 0.5) * 0.05,
      })));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-8 overflow-x-auto scrollbar-thin py-1">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">{d.label}</span>
          <span className="text-xs font-mono text-foreground/80 tabular-nums">
            {d.value.toLocaleString("en-IN", { maximumFractionDigits: d.value < 100 ? 1 : 0 })}
          </span>
          <span className={`text-[10px] font-mono tabular-nums ${d.chg >= 0 ? "text-positive" : "text-negative"}`}>
            {d.chg >= 0 ? "+" : ""}{d.chg.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Stat counter ─── */
function Stat({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground tracking-tight">{value}{suffix}</div>
      <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

/* ─── Feature row ─── */
function FeatureRow({ icon, title, desc, index }: { icon: React.ReactNode; title: string; desc: string; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <div className="group flex items-start gap-5 py-5 border-b border-border/20 hover:border-primary/30 transition-colors cursor-default">
        <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground mb-0.5">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/30 mt-0.5 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>
    </Reveal>
  );
}

/* ─── MAIN ─── */
const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Activity className="h-4 w-4" />, title: "Tick-by-Tick Data", desc: "Real-time market microstructure with sub-100ms latency. Every trade, every order, every tick captured." },
    { icon: <Eye className="h-4 w-4" />, title: "OI Intelligence", desc: "PCR, Max Pain, OI Buildup, Strike Analysis — decoded into actionable signals." },
    { icon: <TrendingUp className="h-4 w-4" />, title: "Options Flow", desc: "Full option chain with Greeks, IV surface, GEX flip detection, and smart scanners." },
    { icon: <BarChart3 className="h-4 w-4" />, title: "Market Heatmap", desc: "500+ stocks color-coded by performance. Sector rotation and momentum at a glance." },
    { icon: <Brain className="h-4 w-4" />, title: "Smart Scanners", desc: "Long Buildup, Short Covering, OHL signals, Volume Spikes — auto-detected." },
    { icon: <Globe className="h-4 w-4" />, title: "Global Context", desc: "Track DXY, US yields, crude, gold, and global indices alongside Indian markets." },
    { icon: <Bell className="h-4 w-4" />, title: "Smart Alerts", desc: "Price, OI, volume, and pattern-based alerts with instant push notifications." },
    { icon: <Shield className="h-4 w-4" />, title: "Institutional Grade", desc: "Bank-level security, 99.9% uptime, and data integrity for real capital." },
  ];

  const plans = [
    { name: "Starter", price: "Free", period: "forever", features: ["Delayed data (15 min)", "Basic watchlist", "Market heatmap", "5 alerts"], cta: "Get Started", popular: false },
    { name: "Pro", price: "₹999", period: "/mo", features: ["Real-time tick data", "Unlimited watchlists", "Full OI Intelligence", "Options flow & scanners", "Unlimited alerts", "Priority support"], cta: "Start Free Trial", popular: true },
    { name: "Institutional", price: "₹4,999", period: "/mo", features: ["Everything in Pro", "API access", "Multi-screen support", "Custom scanners", "Dedicated manager"], cta: "Contact Sales", popular: false },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top nav bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/15 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Activity className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-xs font-bold tracking-tight">GRAVITY</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[11px] text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#performance" className="hover:text-foreground transition-colors">Performance</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <button
            onClick={() => navigate("/market")}
            className="h-7 px-4 text-[11px] font-semibold bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
          >
            Launch Terminal
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Market strip */}
          <Reveal>
            <div className="border border-border/20 rounded-sm bg-card/30 px-5 py-3 mb-16">
              <MarketStrip />
            </div>
          </Reveal>

          {/* Hero content — editorial split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <Reveal>
                <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-5">
                  Trading Terminal · Est. 2024
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                  The terminal
                  <br />
                  <span className="text-muted-foreground/40">built for</span>
                  <br />
                  Indian markets.
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-8">
                  Institutional-grade market data, options intelligence, and order flow analytics. 
                  Tick-by-tick precision at 50ms latency across 200+ F&O stocks.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/market")}
                    className="group h-11 px-8 bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    Launch Terminal
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="h-11 px-8 text-sm text-muted-foreground border border-border/30 hover:border-border/60 hover:text-foreground transition-all">
                    Watch Demo
                  </button>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="flex items-center gap-5 mt-8 text-[10px] text-muted-foreground/60">
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Free tier</span>
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> No credit card</span>
                  <span className="flex items-center gap-1"><Check className="h-3 w-3 text-positive" /> Cancel anytime</span>
                </div>
              </Reveal>
            </div>

            {/* Right side — key metrics grid */}
            <Reveal delay={0.2}>
              <div className="border border-border/20 bg-card/20 p-8">
                <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-8">Key Metrics</div>
                <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                  <Stat value="50" suffix="ms" label="End-to-end Latency" />
                  <Stat value="200+" label="F&O Stocks" />
                  <Stat value="10K+" label="Ticks Per Second" />
                  <Stat value="99.9" suffix="%" label="Uptime SLA" />
                </div>
                <div className="border-t border-border/15 mt-8 pt-6">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/50">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                      All systems operational
                    </span>
                    <span className="font-mono">NSE · BSE · MCX</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Divider line ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-border/15" />
      </div>

      {/* ── Features ── */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
            {/* Left — section title (sticky) */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Reveal>
                <div className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-3">Capabilities</div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
                  Everything you need.
                  <br />
                  <span className="text-muted-foreground/40">Nothing you don't.</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                  Purpose-built for Indian markets. Every feature designed to give you an edge.
                </p>
              </Reveal>
            </div>

            {/* Right — feature list */}
            <div>
              {features.map((f, i) => (
                <FeatureRow key={f.title} icon={f.icon} title={f.title} desc={f.desc} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Performance ── */}
      <section className="py-20 px-6" id="performance">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="border border-border/20 bg-card/20 p-10 sm:p-14">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                {[
                  { icon: <Clock className="h-5 w-5" />, metric: "50ms", label: "Latency", desc: "Exchange tick to your screen" },
                  { icon: <Zap className="h-5 w-5" />, metric: "10K+", label: "Ticks/sec", desc: "Full market depth processing" },
                  { icon: <BarChart3 className="h-5 w-5" />, metric: "<1s", label: "Chart Load", desc: "Switch 500+ symbols instantly" },
                ].map((s, i) => (
                  <Reveal key={s.label} delay={i * 0.1}>
                    <div className="text-center">
                      <div className="flex justify-center mb-3 text-primary">{s.icon}</div>
                      <div className="text-3xl font-mono font-bold text-foreground mb-1">{s.metric}</div>
                      <div className="text-xs font-semibold text-foreground/70 mb-0.5">{s.label}</div>
                      <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="border-t border-border/15 pt-6 text-center">
                <p className="text-[11px] text-muted-foreground/50 font-mono">
                  Benchmarked on co-located infrastructure · Mumbai IX · Median values
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">Made For</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-10">
              Who uses <span className="text-primary">Gravity</span>?
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <TrendingUp className="h-4 w-4" />, title: "Day Traders", desc: "Real-time data and fast execution signals for intraday." },
              { icon: <BarChart3 className="h-4 w-4" />, title: "Options Traders", desc: "Greeks, IV surface, OI analysis — master F&O." },
              { icon: <Building2 className="h-4 w-4" />, title: "Prop Desks", desc: "Institutional tools for prop firms and HNI desks." },
              { icon: <Users className="h-4 w-4" />, title: "Analysts", desc: "Comprehensive market microstructure data." },
            ].map((u, i) => (
              <Reveal key={u.title} delay={i * 0.08}>
                <div className="border border-border/20 bg-card/20 p-5 h-full hover:border-primary/25 transition-colors">
                  <div className="text-primary mb-3">{u.icon}</div>
                  <div className="text-sm font-semibold mb-1">{u.title}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{u.desc}</div>
                </div>
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Simple, transparent pricing</h2>
              <p className="text-xs text-muted-foreground">Start free. Scale when ready.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`border p-6 flex flex-col h-full relative ${plan.popular ? "border-primary/40 bg-primary/5" : "border-border/20 bg-card/20"}`}>
                  {plan.popular && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-widest">
                      Popular
                    </div>
                  )}
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
                  <button className={`mt-6 w-full py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border/30 text-foreground hover:border-primary/40"
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to trade faster?</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of traders who've upgraded to Gravity. Your edge starts here.
            </p>
            <button
              onClick={() => navigate("/market")}
              className="group h-12 px-10 bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Launch Terminal — It's Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/15 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                  <Activity className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold">GRAVITY</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                India's fastest trading terminal.
              </p>
            </div>
            {[
              { title: "Product", links: ["Terminal", "Features", "Pricing", "API"] },
              { title: "Resources", links: ["Docs", "Blog", "Changelog", "Status"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Legal"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2.5 text-muted-foreground">{col.title}</div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {col.links.map(l => (
                    <div key={l} className="hover:text-foreground cursor-pointer transition-colors">{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground/50">© 2026 Gravity Technologies Pvt. Ltd.</span>
            <div className="flex gap-4 text-[10px] text-muted-foreground/50">
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
