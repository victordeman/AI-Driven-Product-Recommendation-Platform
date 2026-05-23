import { AIService } from "@repo/ai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ShoppingBag, User, Settings, Database, Activity, GitGraph, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraphVisualizer } from "@/components/profile/graph-visualizer";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return null;

  const aiService = new AIService(userId);
  const knowledge = await aiService.getUserKnowledge();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="text-primary" />
            <span>AI Marketplace</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild><Link href="/products">Products</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link href="/recommendations">Personalized</Link></Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="p-4 bg-muted/50 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.emailAddresses[0].emailAddress}</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="w-full justify-start text-primary" asChild>
              <Link href="/profile"><User className="mr-2 h-4 w-4" /> Personal Info</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/recommendations"><Activity className="mr-2 h-4 w-4" /> My Interests</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/profile"><Settings className="mr-2 h-4 w-4" /> Preferences</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin"><ShieldCheckIcon className="mr-2 h-4 w-4" /> Admin Access</Link>
            </Button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <GitGraph className="text-primary" size={24} />
                Your Preference Knowledge Graph
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">Knowledge Context</CardTitle>
                    <Database className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4">
                      <GraphVisualizer knowledge={knowledge} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Explicit Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {knowledge.explicitPreferences.length > 0 ? (
                          knowledge.explicitPreferences.map((pref: any) => (
                            <Badge key={pref.name} variant="secondary" className="px-3 py-1">
                              {pref.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic py-2">No explicit preferences recorded yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Implied Attributes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {knowledge.impliedAttributes.length > 0 ? (
                          knowledge.impliedAttributes.map((attr: string) => (
                            <Badge key={attr} variant="outline" className="px-3 py-1">
                              {attr}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic py-2">Keep chatting to unlock insights.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
