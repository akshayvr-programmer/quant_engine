import { useEffect, useState } from "react";
import type { DashboardData } from "../types";
import { dashboardData as mock } from "./mockData";

export function useDashboard(pollMs = 2000): DashboardData {
  const [data, setData] = useState<DashboardData>(mock);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/dashboard.json", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => alive && setData(d))
        .catch(() => {}); // keep last good data / mock
    load();
    const id = setInterval(load, pollMs);
    return () => { alive = false; clearInterval(id); };
  }, [pollMs]);
  return data;
}
