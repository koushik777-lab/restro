import { z } from 'zod';
import { insertBookingSchema, bookings, cars, cities } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  cars: {
    list: {
      method: 'GET' as const,
      path: '/api/cars' as const,
      responses: {
        200: z.array(z.custom<typeof cars.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cars/:id' as const,
      responses: {
        200: z.custom<typeof cars.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  cities: {
    list: {
      method: 'GET' as const,
      path: '/api/cities' as const,
      input: z.object({
        search: z.string().optional(),
        popular: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof cities.$inferSelect>()),
      },
    }
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings' as const,
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/bookings/:id' as const,
      responses: {
        200: z.custom<typeof bookings.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// EXPORTED TYPES
// ============================================
export type CarResponse = z.infer<typeof api.cars.list.responses[200]>[number];
export type CityResponse = z.infer<typeof api.cities.list.responses[200]>[number];
export type CreateBookingInput = z.infer<typeof api.bookings.create.input>;
export type BookingResponse = z.infer<typeof api.bookings.create.responses[201]>;
