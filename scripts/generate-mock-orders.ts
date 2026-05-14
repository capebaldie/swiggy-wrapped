import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import seedrandom from "seedrandom";
import type {
  Cuisine,
  MockDataset,
  Order,
  OrderItem,
  PaymentMethod,
  Restaurant,
  User,
} from "../src/types/order";

const rng = seedrandom("swiggy-wrapped-v1");
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
const between = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;
const cid = (prefix: string) =>
  `${prefix}_${Math.floor(rng() * 1e10).toString(36)}${Math.floor(rng() * 1e10).toString(36)}`;

const USER: User = {
  id: "user_demo",
  email: "demo@swiggywrapped.app",
  name: "Jacob Elordi.",
  avatarUrl: null,
};

const RESTAURANTS: Omit<Restaurant, "id">[] = [
  {
    name: "Tandoori Trail",
    cuisine: "NORTH_INDIAN",
    area: "Koramangala",
    city: "Bangalore",
    rating: 4.3,
  },
  {
    name: "Dosa Diaries",
    cuisine: "SOUTH_INDIAN",
    area: "Indiranagar",
    city: "Bangalore",
    rating: 4.5,
  },
  {
    name: "Wok This Way",
    cuisine: "CHINESE",
    area: "HSR Layout",
    city: "Bangalore",
    rating: 4.1,
  },
  {
    name: "Biryani Bazaar",
    cuisine: "BIRYANI",
    area: "BTM Layout",
    city: "Bangalore",
    rating: 4.4,
  },
  {
    name: "Crust Republic",
    cuisine: "PIZZA",
    area: "Koramangala",
    city: "Bangalore",
    rating: 4.2,
  },
  {
    name: "Patty Project",
    cuisine: "BURGER",
    area: "Indiranagar",
    city: "Bangalore",
    rating: 4.0,
  },
  {
    name: "Sugar & Spoon",
    cuisine: "DESSERT",
    area: "Jayanagar",
    city: "Bangalore",
    rating: 4.6,
  },
  {
    name: "Brew Theory",
    cuisine: "BEVERAGES",
    area: "MG Road",
    city: "Bangalore",
    rating: 4.2,
  },
  {
    name: "Chaat Chowk",
    cuisine: "STREET_FOOD",
    area: "Malleshwaram",
    city: "Bangalore",
    rating: 4.3,
  },
  {
    name: "Cafe Meridian",
    cuisine: "CONTINENTAL",
    area: "Church Street",
    city: "Bangalore",
    rating: 4.1,
  },
  {
    name: "Bangkok Bowl",
    cuisine: "THAI",
    area: "Whitefield",
    city: "Bangalore",
    rating: 4.0,
  },
  {
    name: "Green Plate Co.",
    cuisine: "HEALTHY",
    area: "HSR Layout",
    city: "Bangalore",
    rating: 4.4,
  },
  {
    name: "Loaf Story",
    cuisine: "BAKERY",
    area: "Frazer Town",
    city: "Bangalore",
    rating: 4.5,
  },
  {
    name: "Nawab's Kitchen",
    cuisine: "MUGHLAI",
    area: "Shivajinagar",
    city: "Bangalore",
    rating: 4.3,
  },
  {
    name: "Andhra Aatithyam",
    cuisine: "ANDHRA",
    area: "Domlur",
    city: "Bangalore",
    rating: 4.2,
  },
];

const restaurants: Restaurant[] = RESTAURANTS.map((r) => ({
  ...r,
  id: cid("rest"),
}));

const DISH_POOL: Record<
  Cuisine,
  { name: string; price: number; isVeg: boolean }[]
> = {
  NORTH_INDIAN: [
    { name: "Paneer Butter Masala", price: 290, isVeg: true },
    { name: "Dal Makhani", price: 240, isVeg: true },
    { name: "Butter Naan", price: 60, isVeg: true },
    { name: "Jeera Rice", price: 180, isVeg: true },
    { name: "Tandoori Roti", price: 35, isVeg: true },
    { name: "Chicken Tikka", price: 340, isVeg: false },
    { name: "Kadhai Paneer", price: 280, isVeg: true },
    { name: "Raita", price: 80, isVeg: true },
  ],
  SOUTH_INDIAN: [
    { name: "Masala Dosa", price: 140, isVeg: true },
    { name: "Idli Sambar", price: 90, isVeg: true },
    { name: "Filter Coffee", price: 60, isVeg: true },
    { name: "Medu Vada", price: 110, isVeg: true },
    { name: "Rava Kesari", price: 90, isVeg: true },
    { name: "Pongal", price: 130, isVeg: true },
    { name: "Uttapam", price: 160, isVeg: true },
    { name: "Curd Rice", price: 120, isVeg: true },
  ],
  CHINESE: [
    { name: "Hakka Noodles", price: 220, isVeg: true },
    { name: "Veg Manchurian", price: 230, isVeg: true },
    { name: "Chilli Paneer", price: 270, isVeg: true },
    { name: "Chicken Fried Rice", price: 260, isVeg: false },
    { name: "Schezwan Momos", price: 180, isVeg: true },
    { name: "Hot & Sour Soup", price: 140, isVeg: true },
    { name: "Chilli Chicken", price: 310, isVeg: false },
    { name: "Spring Rolls", price: 160, isVeg: true },
  ],
  BIRYANI: [
    { name: "Hyderabadi Chicken Biryani", price: 320, isVeg: false },
    { name: "Veg Dum Biryani", price: 260, isVeg: true },
    { name: "Mutton Biryani", price: 420, isVeg: false },
    { name: "Mirchi ka Salan", price: 110, isVeg: true },
    { name: "Boiled Egg", price: 30, isVeg: false },
    { name: "Raita", price: 60, isVeg: true },
    { name: "Chicken 65", price: 280, isVeg: false },
    { name: "Phirni", price: 110, isVeg: true },
  ],
  PIZZA: [
    { name: "Margherita", price: 280, isVeg: true },
    { name: "Farmhouse Pizza", price: 360, isVeg: true },
    { name: "Pepperoni Pizza", price: 480, isVeg: false },
    { name: "Garlic Bread", price: 140, isVeg: true },
    { name: "BBQ Chicken Pizza", price: 460, isVeg: false },
    { name: "Cheese Burst Pizza", price: 420, isVeg: true },
    { name: "Choco Lava Cake", price: 130, isVeg: true },
    { name: "Coke 500ml", price: 60, isVeg: true },
  ],
  BURGER: [
    { name: "Classic Cheeseburger", price: 220, isVeg: false },
    { name: "Paneer Burger", price: 190, isVeg: true },
    { name: "Crispy Chicken Burger", price: 240, isVeg: false },
    { name: "Loaded Fries", price: 160, isVeg: true },
    { name: "Onion Rings", price: 130, isVeg: true },
    { name: "Chocolate Shake", price: 150, isVeg: true },
    { name: "Veg Wrap", price: 180, isVeg: true },
    { name: "Cold Coffee", price: 140, isVeg: true },
  ],
  DESSERT: [
    { name: "Gulab Jamun (2pc)", price: 90, isVeg: true },
    { name: "Rasmalai", price: 130, isVeg: true },
    { name: "Brownie", price: 110, isVeg: true },
    { name: "Cheesecake Slice", price: 220, isVeg: true },
    { name: "Kulfi Falooda", price: 160, isVeg: true },
    { name: "Tiramisu", price: 240, isVeg: true },
    { name: "Ice Cream Sundae", price: 180, isVeg: true },
    { name: "Mango Mousse", price: 150, isVeg: true },
  ],
  BEVERAGES: [
    { name: "Masala Chai", price: 40, isVeg: true },
    { name: "Filter Coffee", price: 50, isVeg: true },
    { name: "Cappuccino", price: 160, isVeg: true },
    { name: "Cold Brew", price: 180, isVeg: true },
    { name: "Fresh Lime Soda", price: 70, isVeg: true },
    { name: "Mango Smoothie", price: 180, isVeg: true },
    { name: "Hot Chocolate", price: 170, isVeg: true },
    { name: "Iced Tea", price: 140, isVeg: true },
  ],
  STREET_FOOD: [
    { name: "Pani Puri", price: 70, isVeg: true },
    { name: "Bhel Puri", price: 80, isVeg: true },
    { name: "Pav Bhaji", price: 140, isVeg: true },
    { name: "Vada Pav", price: 40, isVeg: true },
    { name: "Dahi Puri", price: 90, isVeg: true },
    { name: "Samosa Chaat", price: 100, isVeg: true },
    { name: "Aloo Tikki", price: 80, isVeg: true },
    { name: "Kachori", price: 60, isVeg: true },
  ],
  CONTINENTAL: [
    { name: "Penne Arrabbiata", price: 280, isVeg: true },
    { name: "Grilled Chicken", price: 360, isVeg: false },
    { name: "Caesar Salad", price: 240, isVeg: true },
    { name: "Mushroom Risotto", price: 320, isVeg: true },
    { name: "Spaghetti Aglio", price: 260, isVeg: true },
    { name: "Mac & Cheese", price: 290, isVeg: true },
    { name: "Garden Salad", price: 180, isVeg: true },
    { name: "Bruschetta", price: 200, isVeg: true },
  ],
  THAI: [
    { name: "Pad Thai Noodles", price: 280, isVeg: true },
    { name: "Green Curry", price: 320, isVeg: true },
    { name: "Tom Yum Soup", price: 220, isVeg: true },
    { name: "Sticky Rice", price: 130, isVeg: true },
    { name: "Thai Basil Chicken", price: 340, isVeg: false },
    { name: "Massaman Curry", price: 330, isVeg: false },
    { name: "Mango Sticky Rice", price: 220, isVeg: true },
    { name: "Thai Iced Tea", price: 150, isVeg: true },
  ],
  HEALTHY: [
    { name: "Quinoa Bowl", price: 280, isVeg: true },
    { name: "Grilled Veg Salad", price: 240, isVeg: true },
    { name: "Greek Yogurt Parfait", price: 200, isVeg: true },
    { name: "Hummus & Pita", price: 220, isVeg: true },
    { name: "Smoothie Bowl", price: 260, isVeg: true },
    { name: "Avocado Toast", price: 240, isVeg: true },
    { name: "Power Salad", price: 290, isVeg: true },
    { name: "Cold Pressed Juice", price: 180, isVeg: true },
  ],
  BAKERY: [
    { name: "Almond Croissant", price: 120, isVeg: true },
    { name: "Chocolate Croissant", price: 130, isVeg: true },
    { name: "Sourdough Loaf", price: 220, isVeg: true },
    { name: "Cinnamon Roll", price: 140, isVeg: true },
    { name: "Banana Bread", price: 160, isVeg: true },
    { name: "Cheese Danish", price: 130, isVeg: true },
    { name: "Blueberry Muffin", price: 120, isVeg: true },
    { name: "Garlic Focaccia", price: 180, isVeg: true },
  ],
  MUGHLAI: [
    { name: "Chicken Korma", price: 360, isVeg: false },
    { name: "Mutton Rogan Josh", price: 440, isVeg: false },
    { name: "Galouti Kebab", price: 380, isVeg: false },
    { name: "Sheermal", price: 70, isVeg: true },
    { name: "Nihari", price: 420, isVeg: false },
    { name: "Shahi Paneer", price: 310, isVeg: true },
    { name: "Kakori Kebab", price: 360, isVeg: false },
    { name: "Phirni", price: 110, isVeg: true },
  ],
  ANDHRA: [
    { name: "Andhra Chicken Curry", price: 320, isVeg: false },
    { name: "Gongura Mutton", price: 420, isVeg: false },
    { name: "Pesarattu", price: 130, isVeg: true },
    { name: "Pulihora", price: 160, isVeg: true },
    { name: "Andhra Meals", price: 290, isVeg: true },
    { name: "Royyala Vepudu", price: 380, isVeg: false },
    { name: "Mirchi Bajji", price: 90, isVeg: true },
    { name: "Pootharekulu", price: 120, isVeg: true },
  ],
};

const PAYMENT_METHODS: { method: PaymentMethod; weight: number }[] = [
  { method: "UPI", weight: 65 },
  { method: "CARD", weight: 20 },
  { method: "WALLET", weight: 8 },
  { method: "CASH", weight: 5 },
  { method: "NETBANKING", weight: 2 },
];

const weightedPick = <T>(
  items: { method?: T; weight: number; value?: T }[],
) => {
  const total = items.reduce((s, it) => s + it.weight, 0);
  let r = rng() * total;
  for (const it of items) {
    if ((r -= it.weight) <= 0) return it;
  }
  return items[items.length - 1];
};

// Day weighting: Sun=0..Sat=6 — heavier Fri/Sat
const DAY_WEIGHTS = [1.0, 0.7, 0.7, 0.9, 1.0, 1.6, 1.7];

// Hour bands: lunch / dinner / late-night / snack
type HourBand = { hours: number[]; weight: number };
const HOUR_BANDS: HourBand[] = [
  { hours: [12, 13, 14], weight: 35 },
  { hours: [19, 20, 21, 22], weight: 40 },
  { hours: [23, 0, 1, 2], weight: 15 },
  { hours: [16, 17, 18], weight: 10 },
];

function pickHour(): number {
  const totalW = HOUR_BANDS.reduce((s, b) => s + b.weight, 0);
  let r = rng() * totalW;
  for (const band of HOUR_BANDS) {
    if ((r -= band.weight) <= 0) return pick(band.hours);
  }
  return 20;
}

// Date range: 2024-05-15 to 2025-05-14 (matches current date 2026-05-14 minus 1y, i.e., previous year wrap)
const END = new Date("2025-05-14T00:00:00.000Z").getTime();
const START = new Date("2024-05-15T00:00:00.000Z").getTime();

function pickDate(): Date {
  while (true) {
    const t = START + rng() * (END - START);
    const d = new Date(t);
    const dow = d.getUTCDay();
    if (rng() < DAY_WEIGHTS[dow] / 1.7) {
      const hour = pickHour();
      d.setUTCHours(hour, between(0, 59), between(0, 59), 0);
      return d;
    }
  }
}

function buildOrder(): Order {
  const restaurant = pick(restaurants);
  const dishes = DISH_POOL[restaurant.cuisine];
  const itemCount = between(1, 4);
  const usedNames = new Set<string>();
  const items: OrderItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    let dish = pick(dishes);
    let tries = 0;
    while (usedNames.has(dish.name) && tries < 4) {
      dish = pick(dishes);
      tries++;
    }
    usedNames.add(dish.name);
    const quantity = rng() < 0.75 ? 1 : 2;
    items.push({
      id: cid("item"),
      name: dish.name,
      quantity,
      unitPrice: dish.price * 100,
      isVeg: dish.isVeg,
    });
  }
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const deliveryFee = between(19, 49) * 100;
  const packagingFee = between(10, 35) * 100;
  const taxes = Math.round(subtotal * 0.05);
  const discount =
    rng() < 0.2 ? Math.round(subtotal * (0.1 + rng() * 0.15)) : 0;
  const total = subtotal + deliveryFee + packagingFee + taxes - discount;
  const placedAt = pickDate();
  const deliveredAt = new Date(
    placedAt.getTime() + between(28, 55) * 60 * 1000,
  );
  const payment = weightedPick(
    PAYMENT_METHODS.map((p) => ({ value: p.method, weight: p.weight })),
  );

  return {
    id: cid("ord"),
    userId: USER.id,
    placedAt: placedAt.toISOString(),
    deliveredAt: deliveredAt.toISOString(),
    restaurant,
    items,
    subtotal,
    deliveryFee,
    packagingFee,
    taxes,
    discount,
    total,
    paymentMethod: (payment.value ?? "UPI") as PaymentMethod,
    rating: rng() < 0.6 ? between(3, 5) : null,
  };
}

const ORDER_COUNT = 140;
const orders: Order[] = Array.from({ length: ORDER_COUNT }, buildOrder).sort(
  (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
);

const dataset: MockDataset = { user: USER, restaurants, orders };

const outDir = join(process.cwd(), "data");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "mock-orders.json"),
  JSON.stringify(dataset, null, 2),
);

console.log(
  `✓ Generated ${orders.length} orders across ${restaurants.length} restaurants → data/mock-orders.json`,
);
