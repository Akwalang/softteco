import { useQueryClient } from "@tanstack/react-query";

export const useQueryStore = <T extends Record<string, unknown>>(key: (string | number)[]): T => {
  return useQueryClient().getQueryData(key) as T;
};
