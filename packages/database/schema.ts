import { pgTable, text, timestamp, uuid, integer, vector, index, jsonb } from "drizzle-orm/pg-core";

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  apiUrl: text("api_url"),
  apiKeyEncrypted: text("api_key_encrypted"),
  syncFrequency: text("sync_frequency").default("daily"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price"),
  currency: text("currency").default("USD"),
  vendorId: uuid("vendor_id").references(() => vendors.id),
  embedding: vector("embedding", { dimensions: 1536 }),
  metadata: jsonb("metadata"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
  embeddingIdx: index("embedding_idx").using("hnsw", table.embedding.op("vector_cosine_ops")),
}));

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productAttributes = pgTable("product_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
}, (table) => ({
  productIdIdx: index("product_id_idx").on(table.productId),
  nameValueIdx: index("name_value_idx").on(table.name, table.value),
}));

export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("chat_sessions_user_id_idx").on(table.userId),
}));

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => chatSessions.id).notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  sessionIdIdx: index("chat_messages_session_id_idx").on(table.sessionId),
}));
