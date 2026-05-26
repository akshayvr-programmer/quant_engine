import { useEffect, useState, useMemo } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";

/* ───────────────── stats ───────────────── */

function computeStats(data) {

  if (!data.length) {

    return {
      totalPnL: "—",
      sharpe: "—",
      maxDD: "—",
      trades: 0
    };
  }

  const pnls = data.map(d => d.pnl ?? 0);

  const last = pnls[pnls.length - 1];

  const diffs =
      pnls
          .slice(1)
          .map((p, i) => p - pnls[i]);

  const mean =
      diffs.length
          ? diffs.reduce((a, b) => a + b, 0) / diffs.length
          : 0;

  const std =
      diffs.length
          ? Math.sqrt(
              diffs.reduce(
                  (s, d) => s + (d - mean) ** 2,
                  0
              ) / diffs.length
          )
          : 0;

  const sharpe =
      std > 0.001
          ? +(
              (mean / std) *
              Math.sqrt(252 * 78)
          ).toFixed(2)
          : "—";

  let peak = -Infinity;

  let maxDD = 0;

  for (const p of pnls) {

    if (p > peak) {
      peak = p;
    }

    if (peak - p > maxDD) {
      maxDD = peak - p;
    }
  }

  const trades =
      data.filter(
          d =>
              d.action?.includes("ENTER") ||
              d.action?.includes("EXIT")
      ).length;

  return {
    totalPnL: +last.toFixed(2),
    sharpe,
    maxDD: +maxDD.toFixed(2),
    trades
  };
}

/* ───────────────── tooltip ───────────────── */

const CLR = {
  price: "#d8d8d8",
  shortMA: "#00ff88",
  longMA: "#ff4455",
  pnl: "#00aaff",
  zscore: "#9966ff"
};

function ChartTip({ active, payload, label }) {

  if (!active || !payload?.length) {
    return null;
  }

  return (

      <div
          style={{
            background: "rgba(6,6,6,0.97)",
            border: "1px solid #1c1c1c",
            padding: "10px 14px",
            borderRadius: 8,
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            lineHeight: 1.9,
          }}
      >

        <div
            style={{
              color: "#333",
              marginBottom: 4
            }}
        >
          t = {label}
        </div>

        {payload.map(
            p =>
                p.value != null && (

                    <div
                        key={p.dataKey}
                        style={{
                          color:
                              CLR[p.dataKey] || "#888"
                        }}
                    >

                      {String(p.dataKey).padEnd(9)}
                      {" "}
                      {(+p.value).toFixed(4)}

                    </div>
                )
        )}

      </div>
  );
}

/* ───────────────── metric card ───────────────── */

function Metric({
                  label,
                  value,
                  accent,
                  sub,
                  delay = 0
                }) {

  return (

      <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #161616",
            borderTop: `2px solid ${accent}`,
            borderRadius: 12,
            padding: "18px 20px",
            animation:
                `rise .5s ease ${delay}ms both`,
          }}
      >

        <div
            style={{
              fontFamily:
                  '"IBM Plex Mono", monospace',
              fontSize: 9,
              color: "#2e2e2e",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
        >
          {label}
        </div>

        <div
            style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: 28,
              fontWeight: 800,
              color: accent,
              lineHeight: 1,
            }}
        >
          {value}
        </div>

        {sub && (

            <div
                style={{
                  fontFamily:
                      '"IBM Plex Mono", monospace',
                  fontSize: 9,
                  color: "#222",
                  marginTop: 7,
                }}
            >
              {sub}
            </div>
        )}

      </div>
  );
}

/* ───────────────── panel ───────────────── */

function Panel({
                 children,
                 delay = 0,
                 style = {}
               }) {

  return (

      <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #141414",
            borderRadius: 16,
            padding: "24px 28px",
            animation:
                `rise .5s ease ${delay}ms both`,
            ...style,
          }}
      >
        {children}
      </div>
  );
}

function PLabel({ children }) {

  return (

      <div
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: "#555",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
      >
        {children}
      </div>
  );
}

const tick = {
  fill: "#252525",
  fontSize: 10,
  fontFamily: '"IBM Plex Mono"',
};

/* ───────────────── main ───────────────── */

export default function App() {

  const [fullData, setFullData] =
      useState([]);

  const [visible, setVisible] =
      useState([]);

  const [done, setDone] =
      useState(false);

  const [loading, setLoading] =
      useState(true);

  useEffect(() => {

    const link =
        document.createElement("link");

    link.rel = "stylesheet";

    link.href =
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@700;800&display=swap";

    document.head.appendChild(link);

    const style =
        document.createElement("style");

    style.textContent = `
            @keyframes rise {
                from {
                    opacity:0;
                    transform:translateY(10px)
                }
                to {
                    opacity:1;
                    transform:none
                }
            }

            @keyframes blink {
                0%,100% { opacity:1 }
                50% { opacity:0 }
            }
        `;

    document.head.appendChild(style);

  }, []);

  useEffect(() => {

    let iv;

    fetch("/engine_output.json")
        .then(r => r.json())
        .then(json => {

          setFullData(json);

          setLoading(false);

          let idx = 0;

          iv = setInterval(() => {

            idx++;

            setVisible(
                json
                    .slice(0, idx)
                    .filter(
                        d =>
                            d.price != null &&
                            d.shortMA != null &&
                            d.longMA != null
                    )
            );

            if (idx >= json.length) {

              clearInterval(iv);

              setDone(true);
            }

          }, 10);

        });

    return () => clearInterval(iv);

  }, []);

  const stats =
      useMemo(
          () => computeStats(visible),
          [visible]
      );

  const progress =
      fullData.length
          ? (
          visible.length /
          fullData.length
      ) * 100
          : 0;

  const pnlPos =
      typeof stats.totalPnL === "number" &&
      stats.totalPnL >= 0;

  const signals =
      useMemo(
          () =>
              visible
                  .filter(
                      d =>
                          d.action?.includes("ENTER") ||
                          d.action?.includes("EXIT")
                  )
                  .slice(-7)
                  .reverse(),
          [visible]
      );

  const zDomain =
      useMemo(() => {

        if (!fullData.length) {
          return [-3, 3];
        }

        const zs =
            fullData.map(
                d => d.zscore ?? 0
            );

        return [
          Math.min(
              Math.min(...zs),
              -2.5
          ),
          Math.max(
              Math.max(...zs),
              2.5
          )
        ];

      }, [fullData]);

  if (loading) {

    return (

        <div
            style={{
              minHeight: "100vh",
              background: "#020202",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily:
                  '"IBM Plex Mono", monospace',
              fontSize: 12,
              color: "#222",
            }}
        >
          loading engine output...
        </div>
    );
  }

  return (

      <div
          style={{
            minHeight: "100vh",
            background: "#020202",
            color: "#e0e0e0",
          }}
      >

        <div
            style={{
              height: 2,
              background: "#111",
            }}
        >

          <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                    "linear-gradient(90deg,#00aaff,#00ff88)",
                transition:
                    "width .08s linear",
              }}
          />

        </div>

        <div
            style={{
              padding: "32px 36px"
            }}
        >

          <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 36,
              }}
          >

            <div>

              <div
                  style={{
                    fontFamily:
                        '"IBM Plex Mono", monospace',
                    fontSize: 10,
                    color: "#222",
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
              >
                Quant Analytics Platform · Replay Engine
              </div>

              <div
                  style={{
                    fontFamily:
                        '"Syne", sans-serif',
                    fontSize: 52,
                    fontWeight: 800,
                    lineHeight: .95,
                    letterSpacing: "-.02em",
                  }}
              >

                            <span
                                style={{
                                  color: "#efefef"
                                }}
                            >
                                Market
                            </span>

                <br />

                <span
                    style={{
                      color: "#1e1e1e"
                    }}
                >
                                Structure
                            </span>

              </div>

            </div>

          </div>

          <div
              style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(4,1fr)",
                gap: 12,
                marginBottom: 20,
              }}
          >

            <Metric
                label="Strategy PnL"
                value={`${pnlPos ? "+" : ""}${stats.totalPnL}`}
                accent={
                  pnlPos
                      ? "#00ff88"
                      : "#ff4455"
                }
                sub="cumulative"
            />

            <Metric
                label="Sharpe Ratio"
                value={stats.sharpe}
                accent="#00aaff"
                sub="annualized"
            />

            <Metric
                label="Max Drawdown"
                value={stats.maxDD}
                accent="#ff8844"
                sub="peak-to-trough"
            />

            <Metric
                label="Signals Fired"
                value={stats.trades}
                accent="#9966ff"
                sub="ENTER + EXIT"
            />

          </div>

          <Panel
              style={{
                marginBottom: 16
              }}
          >

            <PLabel>
              Market Structure
            </PLabel>

            <ResponsiveContainer
                width="100%"
                height={340}
            >

              <LineChart
                  data={visible}
              >

                <CartesianGrid
                    stroke="#0d0d0d"
                    vertical={false}
                />

                <XAxis
                    dataKey="timestamp"
                    tick={tick}
                />

                <YAxis
                    tick={tick}
                />

                <Tooltip
                    content={<ChartTip />}
                />

                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#d8d8d8"
                    strokeWidth={1.5}
                    dot={false}
                />

                <Line
                    type="monotone"
                    dataKey="shortMA"
                    stroke="#00ff88"
                    strokeWidth={1.5}
                    dot={false}
                />

                <Line
                    type="monotone"
                    dataKey="longMA"
                    stroke="#ff4455"
                    strokeWidth={1.5}
                    dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </Panel>

          <Panel
              style={{
                marginBottom: 16
              }}
          >

            <PLabel>
              Z-Score
            </PLabel>

            <ResponsiveContainer
                width="100%"
                height={180}
            >

              <LineChart
                  data={visible}
              >

                <CartesianGrid
                    stroke="#0d0d0d"
                    vertical={false}
                />

                <XAxis
                    dataKey="timestamp"
                    tick={tick}
                />

                <YAxis
                    tick={tick}
                    domain={zDomain}
                />

                <Tooltip
                    content={<ChartTip />}
                />

                <ReferenceLine
                    y={0}
                    stroke="#333"
                />

                <ReferenceLine
                    y={2}
                    stroke="#ff445540"
                />

                <ReferenceLine
                    y={-2}
                    stroke="#00ff8840"
                />

                <Line
                    type="monotone"
                    dataKey={(d) =>
                        d.zscore ?? 0
                    }
                    stroke="#9966ff"
                    strokeWidth={1.5}
                    dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </Panel>

          <div
              style={{
                display: "grid",
                gridTemplateColumns:
                    "2fr 1fr",
                gap: 16,
              }}
          >

            <Panel>

              <PLabel>
                Strategy PnL
              </PLabel>

              <ResponsiveContainer
                  width="100%"
                  height={200}
              >

                <AreaChart
                    data={visible}
                >

                  <defs>

                    <linearGradient
                        id="pnlGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                      <stop
                          offset="0%"
                          stopColor="#00aaff"
                          stopOpacity={0.18}
                      />

                      <stop
                          offset="100%"
                          stopColor="#00aaff"
                          stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                      stroke="#0d0d0d"
                      vertical={false}
                  />

                  <XAxis
                      dataKey="timestamp"
                      tick={tick}
                  />

                  <YAxis
                      tick={tick}
                  />

                  <Tooltip
                      content={<ChartTip />}
                  />

                  <Area
                      type="monotone"
                      dataKey="pnl"
                      stroke="#00aaff"
                      strokeWidth={2}
                      fill="url(#pnlGrad)"
                      dot={false}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </Panel>

            <Panel>

              <PLabel>
                Signal Log
              </PLabel>

              {signals.map(
                  (s, idx) => (

                      <div
                          key={`${s.timestamp}-${idx}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                                "44px 1fr 1fr",
                            padding: "9px 0",
                            borderBottom:
                                "1px solid #0d0d0d",
                          }}
                      >

                                    <span
                                        style={{
                                          color: "#252525"
                                        }}
                                    >
                                        {s.timestamp}
                                    </span>

                        <span
                            style={{
                              color:
                                  s.action?.includes("ENTER")
                                      ? "#00ff88"
                                      : "#ff4455",
                              fontWeight: 600,
                            }}
                        >
                                        {s.action}
                                    </span>

                        <span
                            style={{
                              color:
                                  idx === 0
                                      ? "#666"
                                      : "#252525"
                            }}
                        >
                                        {s.price?.toFixed(2)}
                                    </span>

                      </div>
                  )
              )}

            </Panel>

          </div>

        </div>

      </div>
  );
}