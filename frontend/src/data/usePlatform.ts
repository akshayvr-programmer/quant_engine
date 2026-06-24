import { useEffect, useState } from "react";
import type { PlatformData } from "../types";
import { platformData as mock } from "./mockData";

/**
 * Polls /dashboard.json (written by the C++ engine) and shallow-merges it over
 * the mock payload. Subsystems the exporter hasn't emitted yet keep their mock
 * data, so every view stays complete while the backend wiring grows.
 */
export function usePlatform(pollMs = 2000): {
  data: PlatformData;
  live: boolean;
} {
  const [data, setData] = useState<PlatformData>(mock);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/dashboard.json", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => {
          if (!alive) return;
          setData({ ...mock, ...d });
          setLive(true);
        })
        .catch(() => alive && setLive(false));
    load();
    const id = setInterval(load, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return { data, live };
}
