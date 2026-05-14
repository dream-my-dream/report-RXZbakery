export const ROUTE_PATHS = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PREORDER: '/preorder',
} as const;

export type BreadCategory = '經典日常 Classic Bread' | '職人歐式 Artisan Bread' | '療癒系甜點 Sweet Healing Desserts';

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  sodium: number;
  fiber: number;
}

export interface Product {
  id: string;
  name: string;
  category: BreadCategory;
  price: number;
  description: string;
  image: string;
  ingredients: Array<{
    name: string;
    origin: string;
  }>;
  allergens: string[];
  nutrition: NutritionInfo;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupDate: string;
  pickupTime: string;
  specialNotes?: string;
  totalAmount: number;
  createdAt: string;
}

export function formatPrice(price: number): string {
  return `NT$ ${price}`;
}

export function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getMinPickupDate(): Date {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  return today;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
