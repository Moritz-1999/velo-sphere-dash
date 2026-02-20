import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const exampleResponses = [
  "Bitcoin funding rates across major exchanges are currently averaging +0.012% per 8h, which is slightly above neutral. This suggests moderate bullish sentiment in the derivatives market.",
  "Looking at the data, SOL has seen the highest OI increase at +8.2% in the last 24h, while ETH OI has remained relatively flat. BTC OI decreased by -1.3%.",
  "The total crypto futures volume in the last 24h was approximately $128.5B, with Binance accounting for 42% of the total volume. This is 15% above the 7-day average.",
  "Current liquidation data shows $45.2M in long liquidations and $32.1M in short liquidations across all tracked assets in the past 4 hours. BTC accounted for 38% of all liquidations.",
  "The BTC-ETH correlation over the past 30 days is 0.87, which is high but below the 90-day average of 0.91. This suggests slight decorrelation in recent price action.",
];

const AIPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Welcome to VeloAI. I can help you analyze crypto market data, funding rates, open interest, liquidations, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  let nextId = messages.length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: nextId++, role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = exampleResponses[Math.floor(Math.random() * exampleResponses.length)];
      setMessages((prev) => [...prev, { id: nextId++, role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto scrollbar-thin p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="shrink-0 h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-card border border-border px-3 py-2 rounded-lg text-xs">
                <span className="animate-pulse-glow">Analyzing market data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about crypto market data..."
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-1.5 rounded text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xxs text-muted-foreground mt-2 text-center">
            VeloAI uses mock responses. Connect to a real API for live analysis.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIPage;
