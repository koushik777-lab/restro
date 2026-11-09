import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { cars, cities } from "@shared/schema";

async function seedDatabase() {
  if (!db) return;
  const existingCars = await storage.getCars();
  if (existingCars.length === 0) {
    console.log("Seeding database...");

    await db.insert(cities).values([
      { name: "Bangalore", state: "Karnataka", isPopular: true },
      { name: "Mumbai", state: "Maharashtra", isPopular: true },
      { name: "Delhi", state: "Delhi", isPopular: true },
      { name: "Chennai", state: "Tamil Nadu", isPopular: true },
      { name: "Pune", state: "Maharashtra", isPopular: true },
      { name: "Hyderabad", state: "Telangana", isPopular: true },
      { name: "Ahmedabad", state: "Gujarat", isPopular: true },
      { name: "Jaipur", state: "Rajasthan", isPopular: true },
      { name: "Mysore", state: "Karnataka", isPopular: false },
      { name: "Coorg", state: "Karnataka", isPopular: false },
    ]);

    await db.insert(cars).values([
      {
        name: "Toyota Etios",
        type: "Sedan",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
        pricePerKm: 12,
        capacity: 4,
        ac: true,
        rating: "4.5"
      },
      {
        name: "Maruti Swift Dzire",
        type: "Sedan",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
        pricePerKm: 11,
        capacity: 4,
        ac: true,
        rating: "4.3"
      },
      {
        name: "Toyota Innova Crysta",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
        pricePerKm: 18,
        capacity: 7,
        ac: true,
        rating: "4.8"
      },
      {
        name: "Suzuki Ertiga",
        type: "SUV",
        image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop",
        pricePerKm: 15,
        capacity: 7,
        ac: true,
        rating: "4.4"
      },
      {
        name: "Indica",
        type: "Hatchback",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop",
        pricePerKm: 9,
        capacity: 4,
        ac: true,
        rating: "4.0"
      }
    ]);
    console.log("Database seeded!");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed data on startup
  seedDatabase().catch(console.error);

  app.get(api.cars.list.path, async (req, res) => {
    const cars = await storage.getCars();
    res.json(cars);
  });

  app.get(api.cars.get.path, async (req, res) => {
    const car = await storage.getCar(Number(req.params.id));
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  });

  app.get(api.cities.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const popular = req.query.popular === 'true';
    const cities = await storage.getCities(search, popular);
    res.json(cities);
  });

  app.post(api.bookings.create.path, async (req, res) => {
    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.bookings.get.path, async (req, res) => {
    const booking = await storage.getBooking(Number(req.params.id));
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  });

  return httpServer;
}
