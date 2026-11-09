import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCities(search?: string, popular?: boolean) {
  return useQuery({
    queryKey: [api.cities.list.path, { search, popular }],
    queryFn: async () => {
      // Build query string manually since backend expects query params
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (popular) params.append("popular", "true");
      
      const url = `${api.cities.list.path}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch cities");
      return api.cities.list.responses[200].parse(await res.json());
    },
  });
}
