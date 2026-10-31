import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { TrendingUp, AlertCircle, BarChart3, LineChart, Info } from "lucide-react";

interface PerformanceDataPoint {
  year: string;
  islamicReturn: number; // Annual % return
  conventionalReturn: number;
  cashReturn: number;
  islamicGrowth: number; // Value of $10,000 invested
  conventionalGrowth: number;
  cashGrowth: number;
  milestone?: string;
  milestoneFr?: string;
}

const HISTORICAL_DATA: PerformanceDataPoint[] = [
  {
    year: "2014",
    islamicReturn: 4.2,
    conventionalReturn: 4.2,
    cashReturn: 0.9,
    islamicGrowth: 10420,
    conventionalGrowth: 10420,
    cashGrowth: 10090,
  },
  {
    year: "2015",
    islamicReturn: -2.3,
    conventionalReturn: -2.4,
    cashReturn: 0.8,
    islamicGrowth: 10180,
    conventionalGrowth: 10170,
    cashGrowth: 10171,
  },
  {
    year: "2016",
    islamicReturn: 8.5,
    conventionalReturn: 7.9,
    cashReturn: 0.7,
    islamicGrowth: 11045,
    conventionalGrowth: 10973,
    cashGrowth: 10242,
  },
  {
    year: "2017",
    islamicReturn: 24.1,
    conventionalReturn: 24.0,
    cashReturn: 0.9,
    islamicGrowth: 13707,
    conventionalGrowth: 13607,
    cashGrowth: 10334,
  },
  {
    year: "2018",
    islamicReturn: -6.4,
    conventionalReturn: -9.4,
    cashReturn: 1.4,
    islamicGrowth: 12830,
    conventionalGrowth: 12328,
    cashGrowth: 10479,
    milestone: "Trade tensions volatility",
    milestoneFr: "Volatilité liée aux tensions commerciales",
  },
  {
    year: "2019",
    islamicReturn: 29.5,
    conventionalReturn: 26.6,
    cashReturn: 1.8,
    islamicGrowth: 16615,
    conventionalGrowth: 15607,
    cashGrowth: 10668,
  },
  {
    year: "2020",
    islamicReturn: 23.8,
    conventionalReturn: 16.3,
    cashReturn: 0.5,
    islamicGrowth: 20569,
    conventionalGrowth: 18151,
    cashGrowth: 10721,
    milestone: "COVID-19 dip & tech rebound",
    milestoneFr: "Baisse COVID-19 et rebond technologique",
  },
  {
    year: "2021",
    islamicReturn: 18.7,
    conventionalReturn: 18.5,
    cashReturn: 0.3,
    islamicGrowth: 24415,
    conventionalGrowth: 21509,
    cashGrowth: 10753,
  },
  {
    year: "2022",
    islamicReturn: -18.4,
    conventionalReturn: -18.4,
    cashReturn: 2.2,
    islamicGrowth: 19923,
    conventionalGrowth: 17551,
    cashGrowth: 10990,
    milestone: "Global rate hikes & bear market",
    milestoneFr: "Hausses de taux et repli des marchés",
  },
  {
    year: "2023",
    islamicReturn: 23.9,
    conventionalReturn: 22.2,
    cashReturn: 4.8,
    islamicGrowth: 24685,
    conventionalGrowth: 21447,
    cashGrowth: 11518,
    milestone: "AI innovation & recovery",
    milestoneFr: "Innovation technologique et reprise",
  },
  {
    year: "2024",
    islamicReturn: 19.4,
    conventionalReturn: 17.5,
    cashReturn: 4.5,
    islamicGrowth: 29474,
    conventionalGrowth: 25200,
    cashGrowth: 12036,
  },
  {
    year: "2025",
    islamicReturn: 11.8,
    conventionalReturn: 10.9,
    cashReturn: 2.8,
    islamicGrowth: 32952,
    conventionalGrowth: 27947,
    cashGrowth: 12373,
  },
  {
    year: "2026 YTD",
    islamicReturn: 5.4,
    conventionalReturn: 4.8,
    cashReturn: 1.8,
    islamicGrowth: 34731,
    conventionalGrowth: 29288,
    cashGrowth: 12596,
  },
];

interface ChartProps {
  isFr?: boolean;
}

export const IslamicIndexPerformanceChart: React.FC<ChartProps> = ({ isFr = false }) => {
  const [viewMode, setViewMode] = useState<"cumulative" | "annual">("cumulative");

  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;
  const formatPercent = (val: number) => `${val > 0 ? "+" : ""}${val.toFixed(1)}%`;

  return (
    <div className="p-5 sm:p-7 bg-[#fcfaf5] border border-[#d6cebd] rounded-xs shadow-xs space-y-6">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d6cebd]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#75581f] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#2e4a3b]" />
            <span>
              {isFr
                ? "Historique de l'Indice de Référence (MSCI ACWI Islamic)"
                : "Benchmark Index Historical Growth (MSCI ACWI Islamic)"}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#1c1b18]">
            {isFr
              ? "Tendance de Croissance & Cycles de Marché Réels"
              : "Growth Trend & Authentic Market Cycles"}
          </h3>
          <p className="text-xs text-[#625d52] max-w-xl mt-1">
            {isFr
              ? "Données historiques illustrant les phases de hausse et les années de correction (notamment 2018 et 2022), démontrant l'importance de la discipline d'investissement à long terme."
              : "Historical benchmark performance showing both expansion years and pullbacks (such as 2018 and 2022), demonstrating why a multi-year horizon is vital."}
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f2ecdf] border border-[#d6cebd] rounded-xs shrink-0 self-start sm:self-center">
          <button
            onClick={() => setViewMode("cumulative")}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === "cumulative"
                ? "bg-[#2e4a3b] text-[#f7f3eb] shadow-xs"
                : "text-[#46423a] hover:bg-[#ece6da]"
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>{isFr ? "Croissance de 10 000 $" : "Growth of $10,000"}</span>
          </button>
          <button
            onClick={() => setViewMode("annual")}
            className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === "annual"
                ? "bg-[#2e4a3b] text-[#f7f3eb] shadow-xs"
                : "text-[#46423a] hover:bg-[#ece6da]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isFr ? "Rendement Annuel (%)" : "Annual Returns (%)"}</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "cumulative" ? (
            <AreaChart data={HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="islamicGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e4a3b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2e4a3b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="conventionalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#75581f" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#75581f" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d9cc" vertical={false} />
              <XAxis dataKey="year" stroke="#625d52" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#625d52"
                fontSize={11}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
                domain={[8000, 38000]}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PerformanceDataPoint;
                    return (
                      <div className="p-3 bg-[#1a2c22] text-[#f7f3eb] border border-[#d6c298] rounded-xs shadow-xl text-xs space-y-1.5 min-w-[200px]">
                        <div className="font-bold border-b border-[#2e4a3b] pb-1 flex justify-between">
                          <span>{label}</span>
                          {data.milestone && (
                            <span className="text-[0.65rem] text-[#d6c298] font-normal italic">
                              {isFr ? data.milestoneFr : data.milestone}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-[#d6c298]">
                          <span>{isFr ? "Indice Islamique :" : "Islamic Index:"}</span>
                          <span className="font-mono font-bold">{formatCurrency(data.islamicGrowth)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#ece6da]/80">
                          <span>{isFr ? "Indice Mondial Conv. :" : "Conventional World:"}</span>
                          <span className="font-mono">{formatCurrency(data.conventionalGrowth)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#ece6da]/60">
                          <span>{isFr ? "Liquidités / CPG :" : "Cash / GIC:"}</span>
                          <span className="font-mono">{formatCurrency(data.cashGrowth)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(value) => {
                  if (value === "islamicGrowth") return isFr ? "Indice MSCI ACWI Islamic (Actions Halal)" : "MSCI ACWI Islamic Index (Halal Equities)";
                  if (value === "conventionalGrowth") return isFr ? "Indice Mondial Conventionnel (MSCI ACWI)" : "Conventional Global Equity (MSCI ACWI)";
                  if (value === "cashGrowth") return isFr ? "Liquidités & CPG (Intérêt nominal)" : "Cash / GIC Benchmark";
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="islamicGrowth"
                stroke="#2e4a3b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#islamicGrad)"
              />
              <Area
                type="monotone"
                dataKey="conventionalGrowth"
                stroke="#75581f"
                strokeWidth={1.8}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#conventionalGrad)"
              />
              <Area
                type="monotone"
                dataKey="cashGrowth"
                stroke="#8d8677"
                strokeWidth={1.5}
                fill="none"
              />
            </AreaChart>
          ) : (
            <BarChart data={HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d9cc" vertical={false} />
              <ReferenceLine y={0} stroke="#1c1b18" strokeWidth={1} />
              <XAxis dataKey="year" stroke="#625d52" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#625d52"
                fontSize={11}
                tickFormatter={(val) => `${val}%`}
                domain={[-25, 35]}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PerformanceDataPoint;
                    return (
                      <div className="p-3 bg-[#1a2c22] text-[#f7f3eb] border border-[#d6c298] rounded-xs shadow-xl text-xs space-y-1 min-w-[190px]">
                        <div className="font-bold border-b border-[#2e4a3b] pb-1">{label}</div>
                        <div className="flex justify-between items-center text-[#d6c298]">
                          <span>{isFr ? "Rendement Islamique :" : "Islamic Return:"}</span>
                          <span className="font-mono font-bold">{formatPercent(data.islamicReturn)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#ece6da]/80">
                          <span>{isFr ? "Rendement Conventionnel :" : "Conventional Return:"}</span>
                          <span className="font-mono">{formatPercent(data.conventionalReturn)}</span>
                        </div>
                        {data.milestone && (
                          <div className="text-[0.65rem] text-[#ece6da]/70 pt-1 border-t border-[#2e4a3b] italic">
                            {isFr ? data.milestoneFr : data.milestone}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                formatter={(value) => {
                  if (value === "islamicReturn") return isFr ? "Rendement Annuel Indice Islamique (%)" : "Islamic Index Annual Return (%)";
                  if (value === "conventionalReturn") return isFr ? "Rendement Mondial Conv. (%)" : "Conventional World Return (%)";
                  return value;
                }}
              />
              <Bar dataKey="islamicReturn" fill="#2e4a3b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="conventionalReturn" fill="#75581f" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Down-Year & Volatility Transparency Callout */}
      <div className="p-3.5 bg-[#ece6da]/50 border-l-2 border-[#75581f] text-xs text-[#46423a] space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#1c1b18]">
          <AlertCircle className="w-4 h-4 text-[#75581f]" />
          <span>{isFr ? "Transparence sur le risque et les années de repli :" : "Market Risk & Down-Year Transparency:"}</span>
        </div>
        <p className="leading-relaxed">
          {isFr
            ? "Comme tout investissement en actions réelles, les indices islamiques connaissent des années de baisse (ex. -18,4 % en 2022 lors de la hausse rapide des taux mondiaux). La détention d'actions exige un horizon temporel suffisant (généralement 5 ans ou plus) pour absorber la volatilité à court terme. Les rendements passés d'un indice ne garantissent pas les rendements futurs."
            : "Like all real equity investments, Shari'ah-compliant indices experience down years (such as -18.4% in 2022 during aggressive central bank rate hikes). Equity investing requires an adequate time horizon (typically 5+ years) to weather short-term volatility. Past benchmark performance is no guarantee of future returns."}
        </p>
      </div>
    </div>
  );
};
