/**
 * Mock database for demo mode.
 * All data is served from src/data/*.ts — no Prisma, no PostgreSQL required.
 */
import { MOCK_PRODUCTS } from "@/data/products";
import { MOCK_CATEGORIES } from "@/data/categories";
import { MOCK_OCCASIONS } from "@/data/occasions";
import { MOCK_BUNDLES } from "@/data/bundles";
import { FEATURED_COLLECTION } from "@/data/collections";
import { MOCK_ORDERS } from "@/data/orders";

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductQueryParams {
  category?: string;
  occasion?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string;
  inStock?: boolean;
  sortBy?: string;
  search?: string;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
}

export function getProducts(params: ProductQueryParams = {}) {
  const {
    category, occasion, priceMin, priceMax, tags,
    inStock, sortBy, search, featured, bestseller, isNew,
    page = 1, limit = 20,
  } = params;

  let products = [...MOCK_PRODUCTS];

  if (category) products = products.filter((p) => p.category.slug === category);
  if (priceMin !== undefined) products = products.filter((p) => p.price >= priceMin!);
  if (priceMax !== undefined) products = products.filter((p) => p.price <= priceMax!);
  if (tags) {
    const tagList = tags.split(",").map((t) => t.trim());
    products = products.filter((p) => tagList.some((t) => p.tags.includes(t)));
  }
  if (inStock) products = products.filter((p) => p.inStock);
  if (featured) products = products.filter((p) => p.isFeatured);
  if (bestseller) products = products.filter((p) => p.isBestSeller);
  if (isNew) products = products.filter((p) => p.isNew);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (occasion) {
    // occasions not on MOCK_PRODUCTS — return all products as fallback
  }

  switch (sortBy) {
    case "price-asc": products.sort((a, b) => a.price - b.price); break;
    case "price-desc": products.sort((a, b) => b.price - a.price); break;
    case "bestseller": products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
    case "rating": products.sort((a, b) => b.rating - a.rating); break;
    default: products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const total = products.length;
  const skip = (page - 1) * limit;
  const data = products.slice(skip, skip + limit);

  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export function getProductBySlug(slug: string) {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductsByIds(ids: string[]) {
  return MOCK_PRODUCTS.filter((p) => ids.includes(p.id));
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function getCategories() {
  return MOCK_CATEGORIES;
}

export function getCategoryBySlug(slug: string) {
  const cat = MOCK_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  const products = MOCK_PRODUCTS.filter((p) => p.category.slug === slug);
  return { ...cat, products };
}

// ─── Occasions ────────────────────────────────────────────────────────────────

export function getOccasions() {
  return MOCK_OCCASIONS;
}

export function getOccasionBySlug(slug: string) {
  const occ = MOCK_OCCASIONS.find((o) => o.slug === slug);
  if (!occ) return null;
  const products = MOCK_PRODUCTS.slice(0, 16);
  return { ...occ, products };
}

// ─── Bundles ──────────────────────────────────────────────────────────────────

export function getBundles() {
  return MOCK_BUNDLES;
}

export function getBundleBySlug(slug: string) {
  return MOCK_BUNDLES.find((b) => b.slug === slug) ?? null;
}

// ─── Collections ──────────────────────────────────────────────────────────────

export function getCollections() {
  return [FEATURED_COLLECTION];
}

export function getCollectionBySlug(slug: string) {
  return FEATURED_COLLECTION.slug === slug ? FEATURED_COLLECTION : null;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function getOrders() {
  return MOCK_ORDERS;
}

export function getOrderById(id: string) {
  return MOCK_ORDERS.find((o) => o.id === id) ?? null;
}

export function trackOrder(orderNumber: string, email: string) {
  const order = MOCK_ORDERS.find(
    (o) =>
      o.id.toUpperCase() === orderNumber.toUpperCase() &&
      o.email.toLowerCase() === email.toLowerCase()
  );
  if (!order) return null;
  return {
    orderNumber: order.id,
    status: order.status.toUpperCase(),
    paymentStatus: "PAGADO",
    total: order.total,
    subtotal: order.total,
    shippingCost: 0,
    discountAmount: 0,
    createdAt: order.createdAt,
    shippingName: order.customer,
    shippingAddress: order.shippingAddress,
    shippingCity: null,
    shippingState: null,
    shippingZipCode: null,
    items: [],
    shippingMethod: null,
  };
}

// ─── Users (demo) ─────────────────────────────────────────────────────────────

export const DEMO_USERS = [
  {
    id: "user-demo-001",
    name: "Demo Usuario",
    email: "demo@fiestamania.com",
    role: "CUSTOMER" as const,
    password: "demo1234",
    createdAt: new Date("2026-01-01"),
    _count: { orders: 3 },
    orders: [{ total: 1250 }, { total: 875.5 }, { total: 320 }],
  },
  {
    id: "user-admin-001",
    name: "Admin FiestaMania",
    email: "admin@fiestamania.com",
    role: "ADMIN" as const,
    password: "admin1234",
    createdAt: new Date("2025-06-01"),
    _count: { orders: 0 },
    orders: [],
  },
];

export function getUserByEmail(email: string) {
  return DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserById(id: string) {
  return DEMO_USERS.find((u) => u.id === id) ?? null;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export function getAdminStats() {
  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0);
  return {
    productCount: MOCK_PRODUCTS.length,
    orderCount: MOCK_ORDERS.length,
    userCount: DEMO_USERS.length,
    totalRevenue,
    recentOrders: MOCK_ORDERS.slice(0, 5).map((o) => ({
      id: o.id,
      orderNumber: o.id,
      user: null as { name: string | null; email: string | null } | null,
      guestName: o.customer,
      guestEmail: o.email,
      total: o.total,
      status: o.status.toUpperCase(),
      paymentStatus: "PAGADO",
      createdAt: new Date(o.createdAt),
    })),
  };
}
