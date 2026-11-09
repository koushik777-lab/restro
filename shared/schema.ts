import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Hatchback', 'Sedan', 'SUV', 'Tempo Traveller'
  image: text("image").notNull(),
  pricePerKm: integer("price_per_km").notNull(),
  capacity: integer("capacity").notNull(),
  ac: boolean("ac").default(true),
  rating: text("rating").default("4.5"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tripType: text("trip_type").notNull(), // 'oneway', 'roundtrip', 'local', 'airport'
  pickupLocation: text("pickup_location").notNull(),
  dropLocation: text("drop_location"),
  pickupDate: timestamp("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  returnDate: timestamp("return_date"),
  carId: integer("car_id").references(() => cars.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  status: text("status").default("pending"), // 'pending', 'confirmed', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state"),
  isPopular: boolean("is_popular").default(false),
});

// === SCHEMAS ===

export const insertCarSchema = createInsertSchema(cars).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings, {
  pickupDate: z.coerce.date(),
  returnDate: z.coerce.date().nullable().optional(),
}).omit({ id: true, createdAt: true, status: true });
export const insertCitySchema = createInsertSchema(cities).omit({ id: true });

// === EXPLICIT TYPES ===

export type Car = typeof cars.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type City = typeof cities.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertCar = z.infer<typeof insertCarSchema>;

// Request types
export type CreateBookingRequest = InsertBooking;
export type CalculateFareRequest = {
  tripType: string;
  distance: number;
  carId: number;
  duration?: number; // for local rentals
};

// Response types
export type FareEstimateResponse = {
  estimatedFare: number;
  distance: number;
  breakdown: { label: string; amount: number }[];
};
