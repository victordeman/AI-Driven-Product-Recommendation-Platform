import { db } from "../packages/database/db";
import { products, vendors, productAttributes } from "../packages/database/schema";
import { generateEmbedding } from "../packages/ai/lib/embeddings";
import { getNeo4jDriver } from "../packages/ai/lib/neo4j-client";

const SAMPLE_PRODUCTS = [
  {
    name: "Sony WH-1000XM5",
    description: "Industry leading noise canceling headphones with Auto NC Optimizer.",
    price: 34800,
    brand: "Sony",
    category: "Audio",
    attributes: [
      { name: "Type", value: "Over-ear" },
      { name: "Features", value: "Noise-Cancelling" }
    ]
  },
  {
    name: "Dell XPS 15",
    description: "Powerhouse performance with 13th Gen Intel Core processors and 4K display.",
    price: 189900,
    brand: "Dell",
    category: "Computing",
    attributes: [
      { name: "Display", value: "4K" },
      { name: "Processor", value: "Intel Core i7" }
    ]
  }
];

async function seed() {
  console.log("Seeding started...");
  try {
    const [vendor] = await db.insert(vendors).values({
      name: "Main Electronics Store",
      apiUrl: "https://api.example.com",
    }).returning();
    const neo4jDriver = getNeo4jDriver();
    for (const productData of SAMPLE_PRODUCTS) {
      const embedding = await generateEmbedding(`${productData.name} ${productData.description}`);
      const [product] = await db.insert(products).values({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        vendorId: vendor.id,
        embedding: embedding,
        metadata: { brand: productData.brand, category: productData.category }
      }).returning();
      for (const attr of productData.attributes) {
        await db.insert(productAttributes).values({
          productId: product.id,
          name: attr.name,
          value: attr.value
        });
      }
      const session = neo4jDriver.session();
      try {
        await session.run(`
          MERGE (p:Product {id: $id})
          SET p.name = $name, p.price = $price
          MERGE (v:Vendor {id: $vendorId})
          SET v.name = $vendorName
          MERGE (p)-[:SOLD_BY]->(v)
          MERGE (b:Brand {name: $brand})
          MERGE (p)-[:BELONGS_TO]->(b)
          MERGE (c:PreferenceCategory {name: $category})
          MERGE (p)-[:IN_CATEGORY]->(c)
        `, {
          id: product.id,
          name: product.name,
          price: product.price,
          vendorId: vendor.id,
          vendorName: vendor.name,
          brand: productData.brand,
          category: productData.category
        });
      } finally {
        await session.close();
      }
    }
    console.log("Seeding complete.");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    process.exit(0);
  }
}

seed();
