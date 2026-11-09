import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateBookingInput } from "@shared/routes";

export function useBooking(id: number) {
  return useQuery({
    queryKey: [api.bookings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.bookings.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch booking");
      return api.bookings.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      // Validate with Zod schema before sending
      const validated = api.bookings.create.input.parse(data);
      
      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.bookings.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create booking");
      }
      
      return api.bookings.create.responses[201].parse(await res.json());
    },
  });
}
