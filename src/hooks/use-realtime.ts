import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const TABLE_KEYS: Record<string, string[][]> = {
  employees: [["employees"]],
  workflows: [["workflows"], ["workflow-count"]],
  workflow_nodes: [["workflow-nodes"]],
  mobility_plan: [["mobility-plan"]],
  retention_tasks: [
    ["retention-tasks"],
    ["retention-events"],
    ["workflows"],
    ["workflow-count"],
  ],
};
export function useRealtimeInvalidate() {
  const cache = useQueryClient();
  const [status, setStatus] = useState("Connecting");
  useEffect(() => {
    let channel = supabase.channel("retainiq-changes");
    Object.entries(TABLE_KEYS).forEach(([table, keys]) => {
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          keys.forEach(
            (queryKey) => void cache.invalidateQueries({ queryKey }),
          );
        },
      );
    });
    channel.subscribe((state) => {
      setStatus(
        state === "SUBSCRIBED"
          ? "Connected"
          : state === "CHANNEL_ERROR" ||
              state === "TIMED_OUT" ||
              state === "CLOSED"
            ? "Disconnected"
            : "Connecting",
      );
      if (state === "SUBSCRIBED")
        Object.values(TABLE_KEYS)
          .flat()
          .forEach((queryKey) => void cache.invalidateQueries({ queryKey }));
    });
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [cache]);
  return status;
}
