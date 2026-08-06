import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { sendAIMessage } from "../../services/ai";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_PROMPTS = [
    "What is a moving average crossover strategy?",
    "Explain the risk metrics in my portfolio",
    "When should I use pairs trading?",
    "What does Z-score mean in mean reversion?",
];

export default function AIAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm your Vertex AI trading assistant powered by Claude. Ask me anything about your strategies, risk metrics, market concepts, or quantitative finance.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (prompt?: string) => {
        const text = prompt ?? input.trim();
        if (!text || loading) return;

        const userMessage: Message = {
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await sendAIMessage(text);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: response,
                    timestamp: new Date(),
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Failed to reach the AI engine. Make sure the C++ backend is running.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
<div className="flex h-[calc(100vh-10rem)] max-h-[820px] flex-col rounded-xl border border-[#3C342E] bg-[#1C1815] shadow-2xl shadow-black/20">
  <div className="border-b border-[#3C342E] px-5 py-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6A15F]/30 bg-[#D6A15F]/10">
        <Sparkles className="h-5 w-5 text-[#D6A15F]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-[#F5F1EB]">AI Trading Assistant</h2>
        <p className="text-xs text-[#A79B91]">Strategy research, risk review, and market reasoning</p>
      </div>
    </div>
  </div>


            {/* Suggested Prompts (only shown when only 1 message = initial) */}
            {messages.length === 1 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => handleSend(prompt)}
                            className="rounded-lg border border-[#3C342E] bg-[#211D1A] px-3 py-2.5 text-left text-xs text-[#B8ADA3] transition hover:border-[#D6A15F]/50 hover:bg-[#2A2420] hover:text-[#F5F1EB]"
                            
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                            msg.role === "assistant"
                                ? "bg-amber-500/10 border border-amber-500/20"
                                : "bg-zinc-700"
                        }`}>
                            {msg.role === "assistant"
                                ? <Bot className="w-3.5 h-3.5 text-amber-400" />
                                : <User className="w-3.5 h-3.5 text-zinc-300" />
                            }
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "assistant"
                                ? "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm"
                                : "bg-amber-500/90 text-zinc-950 font-medium rounded-tr-sm"
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* Loading bubble */}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            <span className="text-sm text-zinc-500">Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 border border-zinc-800 rounded-xl bg-zinc-900 p-2">
                <textarea
                    className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 resize-none outline-none px-2 py-1.5 max-h-28"
                    placeholder="Ask about strategies, risk, market concepts..."
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors self-end"
                >
                    <Send className="w-4 h-4 text-zinc-950" />
                </button>
            </div>
        </div>
    );
}
