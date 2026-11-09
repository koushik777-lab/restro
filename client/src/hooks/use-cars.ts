import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useCars() {
  return useQuery({
    queryKey: [api.cars.list.path],
    queryFn: async () => {
      const res = await fetch(api.cars.list.path);
      if (!res.ok) throw new Error("Failed to fetch cars");
      return api.cars.list.responses[200].parse(await res.json());
    },
  });
}

export function useCar(id: number) {
  return useQuery({
    queryKey: [api.cars.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.cars.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch car");
      return api.cars.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
