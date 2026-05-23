/**
 * Knowledge Graph Node Types
 */
export interface UserNode {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export interface BrandNode {
  name: string;
}

export interface VendorNode {
  id: string;
  name: string;
}

export interface ProductAttributeNode {
  name: string;
  value: string;
}

export interface PreferenceCategoryNode {
  name: string;
}

export interface ProductNode {
  id: string;
  name: string;
  price: number;
}

/**
 * Relationship Properties
 */
export interface PrefersRel {
  weight: number;
  lastUpdated: number;
}

export interface DislikesRel {
  reason?: string;
  timestamp: number;
}

export interface SoldByRel {
  price: number;
  stock: number;
}
