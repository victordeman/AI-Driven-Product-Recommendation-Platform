import { ShoppingBag, Sparkles, User, ShieldCheck, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="text-primary" />
            <span>AI Marketplace</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
            <Link href="/recommendations" className="text-sm font-medium hover:text-primary transition-colors">Personalized</Link>
            <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">Profile</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile"><User className="mr-2 h-4 w-4" /> Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6 bg-background">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            AI-Driven Shopping Experience
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 sm:text-6xl">
            Your Personal Marketplace, <span className="text-primary">Evolved</span>.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            A conversational AI marketplace that learns your preferences using GraphRAG and multi-vendor sourcing to find exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base" asChild>
              <Link href="/products">Browse Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 h-12 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold">GraphRAG Intelligence</h3>
            <p className="text-muted-foreground">Our AI understands your unique preferences by reasoning over a personalized knowledge graph.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-bold">Multi-Vendor Sourcing</h3>
            <p className="text-muted-foreground">We aggregate products from multiple vendors, ensuring the best quality and match for you.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold">Persistent AI Concierge</h3>
            <p className="text-muted-foreground">A dedicated AI assistant is always available to help you find, filter, and decide on products.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg opacity-70">
            <ShoppingBag />
            <span>AI Marketplace</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">GitHub</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AI Marketplace Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
