// Number / currency / time formatting. Centralised so every figure in the
// app reads consistently — and so financial values always carry an explicit
// sign where direction matters.

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const num0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** $999,432 */
export const money = (v: number) => usd0.format(v);

/** $184.32 */
export const price = (v: number) => usd2.format(v);

/** 1,000 */
export const count = (v: number) => num0.format(v);

/** +$124 / -$43 — leading sign is part of the value, not decoration. */
export function signedMoney(v: number): string {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${usd0.format(Math.abs(v))}`;
}

/** +1.2% / -0.4% */
export function signedPct(v: number): string {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${Math.abs(v).toFixed(2)}%`;
}

/** Tone for a value: positive, negative, or flat. Drives colour only. */
export function tone(v: number): "pos" | "neg" | "flat" {
  if (v > 0) return "pos";
  if (v < 0) return "neg";
  return "flat";
}

const toneText: Record<"pos" | "neg" | "flat", string> = {
  pos: "text-emerald-300",
  neg: "text-rose-300",
  flat: "text-zinc-400",
};

export const toneClass = (v: number) => toneText[tone(v)];

/** 14:32:07 — local session time, 24h. */
export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// --- Additional helpers for the platform views ------------------------------

/** $1.01M / $24.3k / $432 — compact, for headline figures. */
export function compactMoney(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

/** 1.12 / 0.96 — fixed 2dp number. */
export const num2 = (v: number) => v.toFixed(2);

/** 40.0% from a 0..1 ratio. */
export const ratioPct = (v: number) => `${(v * 100).toFixed(1)}%`;
