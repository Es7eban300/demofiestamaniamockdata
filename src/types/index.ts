// ─── Auth Types ────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN";
}

// ─── Core Domain Types ─────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export type ProductBadge = "new" | "sale" | "bestseller" | "limited";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  heroImage: string;
  color: string;
  productCount: number;
}

export interface Occasion {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  productCount: number;
  color: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: Category;
  categoryId: string;
  tags: string[];
  badges: ProductBadge[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  attributes?: ProductAttribute[];
  createdAt: string;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  image: string;
  collection: string;
  savings: number;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
}

export interface CtaButton {
  label: string;
  href: string;
}

export interface AIEssentialCategory {
  id: string;
  name: string;
  icon: string;
  href: string;
}

export interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  children?: NavDropdownItem[];
}

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

// ─── Cart Types ─────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variantColor?: { hex: string; label: string };
}

// ─── Filter Types ───────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  inStock?: boolean;
  sortBy?: SortOption;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "bestseller"
  | "rating";

export type FilterTab = "Todos" | "Vajilla" | "Decoración" | "Globos" | "Sombreros";

// ─── Checkout Types ──────────────────────────────────────────────────────────────

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  saveInfo: boolean;
}

export type CheckoutStep = "informacion" | "envio" | "pago";

// ─── Admin Types ──────────────────────────────────────────────────────────────

export type OrderStatus = "pendiente" | "completado" | "cancelado" | "enviado";

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
}

export type AdminUserRole = "admin" | "cliente";
export type AdminUserStatus = "activo" | "inactivo";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
}
