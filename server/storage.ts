import { db } from "./db";
import {
  cars, cities, bookings,
  type Car, type City, type Booking,
  type InsertBooking
} from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

export interface IStorage {
  getCars(): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  getCities(search?: string, popular?: boolean): Promise<City[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getCars(): Promise<Car[]> {
    return await db!.select().from(cars);
  }

  async getCar(id: number): Promise<Car | undefined> {
    const [car] = await db!.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async getCities(search?: string, popular?: boolean): Promise<City[]> {
    let query = db!.select().from(cities);

    if (search) {
      // Simple case-insensitive prefix search
      return await db!.select().from(cities).where(ilike(cities.name, `${search}%`));
    }

    if (popular) {
      return await db!.select().from(cities).where(eq(cities.isPopular, true));
    }

    return await query;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db!.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db!.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
}

export class MemoryStorage implements IStorage {
  private cars: Car[];
  private cities: City[];
  private bookings: Booking[];
  private currentBookingId: number;

  constructor() {
    this.bookings = [];
    this.currentBookingId = 1;

    // Seed data
    this.cars = [
      {
        id: 1,
        name: "Toyota Etios",
        type: "Sedan",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
        pricePerKm: 12,
        capacity: 4,
        ac: true,
        rating: "4.5"
      },
      {
        id: 2,
        name: "Maruti Swift Dzire",
        type: "Sedan",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
        pricePerKm: 11,
        capacity: 4,
        ac: true,
        rating: "4.3"
      },
      {
        id: 3,
        name: "Toyota Innova Crysta",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
        pricePerKm: 18,
        capacity: 7,
        ac: true,
        rating: "4.8"
      },
      {
        id: 4,
        name: "Suzuki Ertiga",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop",
        pricePerKm: 15,
        capacity: 7,
        ac: true,
        rating: "4.4"
      },
      {
        id: 5,
        name: "Indica",
        type: "Hatchback",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop",
        pricePerKm: 9,
        capacity: 4,
        ac: true,
        rating: "4.0"
      }
    ];

    this.cities = [
      { id: 1, name: "Bangalore", state: "Karnataka", isPopular: true },
      { id: 2, name: "Mumbai", state: "Maharashtra", isPopular: true },
      { id: 3, name: "Delhi", state: "Delhi", isPopular: true },
      { id: 4, name: "Chennai", state: "Tamil Nadu", isPopular: true },
      { id: 5, name: "Pune", state: "Maharashtra", isPopular: true },
      { id: 6, name: "Hyderabad", state: "Telangana", isPopular: true },
      { id: 7, name: "Ahmedabad", state: "Gujarat", isPopular: true },
      { id: 8, name: "Jaipur", state: "Rajasthan", isPopular: true },
      { id: 9, name: "Mysore", state: "Karnataka", isPopular: false },
      { id: 10, name: "Coorg", state: "Karnataka", isPopular: false },
    ];
  }

  async getCars(): Promise<Car[]> {
    return this.cars;
  }

  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.find(c => c.id === id);
  }

  async getCities(search?: string, popular?: boolean): Promise<City[]> {
    let result = this.cities;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().startsWith(lowerSearch));
    }

    if (popular) {
      result = result.filter(c => c.isPopular);
    }

    return result;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: this.currentBookingId++,
      status: "pending",
      dropLocation: booking.dropLocation ?? null,
      returnDate: booking.returnDate ?? null,
      customerEmail: booking.customerEmail ?? null,
      carId: booking.carId ?? null,
      createdAt: new Date(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.find(b => b.id === id);
  }
}

export const storage = db ? new DatabaseStorage() : new MemoryStorage();
