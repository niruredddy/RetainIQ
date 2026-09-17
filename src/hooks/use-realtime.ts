import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Subscribes to realtime Postgres changes on the given tables and invalidates
 * the matching React Query keys, so every open screen refreshes live whenever
 * the database changes. RLS on the subscribed tables governs what the signed-in
 * user actually receives.
 */
export function useRealtimeInvalidate(
  tables: string[],
  queryKeys: string[][]
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        (payload) => {
          const table = (payload as { table?: string }).table;
          if (table && tables.includes(table)) {
            queryKeys.forEach((key) =>
              void queryClient.invalidateQueries({ queryKey: key })
            );
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
