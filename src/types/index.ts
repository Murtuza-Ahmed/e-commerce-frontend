export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  categorySlug: string;
  brand: string;
  variants: ProductVariant[];
  basePrice: number;
  compareAtPrice?: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isFlashSale?: boolean;
  status: 'active' | 'draft' | 'scheduled';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface AuthResponse extends TokenPair {
  user: User;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface Permission {
  id: string;
  key: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  level: number;
  isSystem: boolean;
  permissions?: Permission[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}
