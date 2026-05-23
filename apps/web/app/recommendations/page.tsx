import { AIService } from "@repo/ai";
import { auth } from "@clerk/nextjs/server";
import { ShoppingBag, Sparkles, TrendingUp, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RecommendationsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const aiService = new AIService(userId);
  const [knowledge, recommendations] = await Promise.all([
    aiService.getUserKnowledge(),
    aiService.getRecommendedProducts(6)
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="text-primary" />
            <span>AI Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link href="/products">All Products</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link href="/profile">Profile</Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-medium mb-2">
            <Sparkles size={18} />
            AI-Personalized
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Recommended For You</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            These results are generated using GraphRAG reasoning over your knowledge graph.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Reasoning Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Reasoning Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Explicit Preferences</p>
                  <div className="flex flex-wrap gap-1">
                    {knowledge.explicitPreferences.length > 0 ? (
                      knowledge.explicitPreferences.map((pref: any) => (
                        <Badge key={pref.name} variant="outline" className="text-[10px] bg-background">
                          {pref.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">None recorded.</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Implied Attributes</p>
                  <div className="flex flex-wrap gap-1">
                    {knowledge.impliedAttributes.length > 0 ? (
                      knowledge.impliedAttributes.map((attr: string) => (
                        <Badge key={attr} variant="secondary" className="text-[10px]">
                          {attr}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">Chat to discover.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl border p-6 bg-primary text-primary-foreground">
              <h4 className="font-bold mb-2 text-sm">Need better results?</h4>
              <p className="text-xs opacity-90 mb-4">Tell our assistant about your latest interests to update your recommendation engine.</p>
              <Button variant="secondary" size="sm" className="w-full text-xs">Update Preferences</Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="aspect-[4/3] bg-muted relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary/90 backdrop-blur text-[10px] border-none">
                        Match: {Math.round(product.score * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 flex-1">
                    <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                    <div className="mt-2 space-y-1">
                      {product.reasoning.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <CheckCircle2 size={10} className="text-green-500" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-2">
                    <div className="text-lg font-bold">
                      ${(product.price ?? 0) / 100}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="secondary" size="sm" className="w-full text-xs">View Match</Button>
                  </CardFooter>
                </Card>
              ))}

              {recommendations.length === 0 && (
                <div className="col-span-full py-20 text-center flex flex-col items-center border-2 border-dashed rounded-2xl bg-card">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Info size={32} className="text-muted-foreground" />
                  </div>
                  <p className="font-medium text-lg">No matches yet</p>
                  <p className="text-sm text-muted-foreground max-w-[250px] mt-1">
                    Tell us more about what you're looking for in the chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
