"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MessageCircle, X, Send, Loader2, User, Bot, ShoppingBag, RotateCcw } from "lucide-react";
import { cn } from "../../lib/utils";
import { usePathname } from "next/navigation";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const pathname = usePathname();

  const chat = useChat({
    api: "/api/chat",
    body: { sessionId, pageContext: pathname },
    onResponse: (response) => {
      const serverSessionId = response.headers.get("x-session-id");
      if (serverSessionId && serverSessionId !== sessionId) {
        setSessionId(serverSessionId);
      }
    },
  });

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = chat as any;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Context-aware quick actions
  const getQuickActions = () => {
    const baseActions = [
      { label: "🌿 Eco-friendly", query: "Show me eco-friendly options" },
      { label: "🎁 Gift Ideas", query: "I'm looking for a gift" },
    ];

    if (pathname === "/products") {
      return [
        ...baseActions,
        { label: "🔍 Best Value", query: "Filter for products with best price/quality ratio" },
        { label: "📦 Fast Shipping", query: "Show products with fast shipping" },
      ];
    }

    if (pathname === "/recommendations") {
      return [
        ...baseActions,
        { label: "🤔 Explain these", query: "Explain why these specific products were recommended" },
        { label: "📉 Lower prices", query: "Show similar recommendations but cheaper" },
      ];
    }

    return [
      ...baseActions,
      { label: "⭐ Top Rated", query: "What are the top rated brands?" },
      { label: "🚫 No Cheap Imports", query: "I dislike cheap imports" },
    ];
  };

  const quickActions = getQuickActions();

  const resetChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl transition-all animate-in slide-in-from-bottom-5 sm:w-[450px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary-foreground/20 p-1">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="font-semibold leading-none">Marketplace AI</h3>
                <p className="text-[10px] text-primary-foreground/70 mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  {sessionId ? `Session Active` : 'Always Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={resetChat}
                title="Reset Chat"
              >
                <RotateCcw size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in duration-500">
                <div className="rounded-full bg-muted p-4">
                  <Bot size={32} className="text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">How can I help you today?</p>
                  <p className="text-xs text-muted-foreground max-w-[250px]">
                    I'm currently viewing <span className="font-bold text-primary">{pathname}</span> with you.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full pt-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => append({ role: "user", content: action.query })}
                      className="flex items-center justify-start rounded-lg border bg-card p-2 text-xs font-medium hover:bg-accent transition-colors text-left"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m: any) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start gap-3",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
                    m.role === "user" ? "bg-background" : "bg-primary text-primary-foreground"
                  )}
                >
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm shadow-sm max-w-[85%]",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  )}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-primary text-primary-foreground">
                  <Bot size={14} />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 text-sm">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/30 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/30 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/30 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-card p-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full border-muted bg-muted/50 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full shrink-0"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </Button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              AI concierge for <span className="font-medium">{pathname}</span>
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </Button>
    </div>
  );
}
