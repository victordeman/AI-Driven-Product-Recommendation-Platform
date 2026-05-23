import { AIService } from "@repo/ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@repo/database/db";
import { products, vendors } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { ShoppingBag, Search, Filter, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProductsPage() {
  const { userId } = await auth();

  // In a real app, we'd use the userId to personalize this listing
  const allProducts = await db.select({
    id: products.id,
    name: products.name,
    description: products.description,
    price: products.price,
    currency: products.currency,
    vendorName: vendors.name,
  })
  .from(products)
  .leftJoin(vendors, eq(products.vendorId, vendors.id))
  .limit(20);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="text-primary" />
            <span className="hidden sm:inline">AI Marketplace</span>
          </Link>
          <div className="flex-1 max-w-md mx-8 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter products..."
              className="w-full pl-10 pr-4 h-10 rounded-full border bg-muted/50 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden"><Search size={18} /></Button>
            <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Catalog</h1>
            <p className="text-muted-foreground">Aggregated from multiple trusted vendors.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {allProducts.length} results
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <div key={product.id} className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square bg-muted relative">
                <div className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur px-2 py-1 text-[10px] font-bold border">
                  {product.vendorName || "Generic"}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4 flex-1">
                  {product.description || "No description available."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl">
                    {product.currency === "USD" ? "$" : ""}{(product.price ?? 0) / 100}
                  </span>
                  <Button size="sm" variant="secondary">View Details</Button>
                </div>
              </div>
            </div>
          ))}

          {allProducts.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Info size={32} className="text-muted-foreground" />
              </div>
              <p className="text-xl font-medium">No products found</p>
              <p className="text-muted-foreground">Try adjusting your filters or talk to the AI concierge.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
