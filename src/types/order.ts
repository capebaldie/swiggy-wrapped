export type PaymentMethod = "UPI" | "CARD" | "CASH" | "WALLET" | "NETBANKING";

export type Cuisine =
  | "NORTH_INDIAN"
  | "SOUTH_INDIAN"
  | "CHINESE"
  | "BIRYANI"
  | "PIZZA"
  | "BURGER"
  | "DESSERT"
  | "BEVERAGES"
  | "STREET_FOOD"
  | "CONTINENTAL"
  | "THAI"
  | "HEALTHY"
  | "BAKERY"
  | "MUGHLAI"
  | "ANDHRA";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: Cuisine;
  area: string;
  city: string;
  rating: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  isVeg: boolean;
}

export interface Order {
  id: string;
  userId: string;
  placedAt: string;
  deliveredAt: string | null;
  restaurant: Restaurant;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  taxes: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  rating: number | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export const CUISINE_LABEL: Record<Cuisine, string> = {
  NORTH_INDIAN: "North Indian",
  SOUTH_INDIAN: "South Indian",
  CHINESE: "Chinese",
  BIRYANI: "Biryani",
  PIZZA: "Pizza",
  BURGER: "Burger",
  DESSERT: "Dessert",
  BEVERAGES: "Beverages",
  STREET_FOOD: "Street Food",
  CONTINENTAL: "Continental",
  THAI: "Thai",
  HEALTHY: "Healthy",
  BAKERY: "Bakery",
  MUGHLAI: "Mughlai",
  ANDHRA: "Andhra",
};

export const CUISINE_GLYPH: Record<Cuisine, string> = {
  NORTH_INDIAN: "🍛",
  SOUTH_INDIAN: "🥞",
  CHINESE: "🥡",
  BIRYANI: "🍚",
  PIZZA: "🍕",
  BURGER: "🍔",
  DESSERT: "🍰",
  BEVERAGES: "☕",
  STREET_FOOD: "🌯",
  CONTINENTAL: "🥗",
  THAI: "🍜",
  HEALTHY: "🥑",
  BAKERY: "🥐",
  MUGHLAI: "🍢",
  ANDHRA: "🌶️",
};
