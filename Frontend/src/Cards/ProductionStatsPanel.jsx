import React, { useState, useEffect, useCallback } from "react";
import { api } from "../services/auth";
import { AlertCircle, Info, RefreshCw } from "lucide-react";

const TABS = [
  { key: "suspicious", label: "Suspicious" },
  { key: "delivered", label: "Delivered" },
  { key: "production", label: "Production" },
];

const num = (n) => Number(n ?? 0);
const fixed1 = (n) => num(n).toFixed(1);

const getErrorMessage = (err) =>
  err.response?.data?.message ||
  err.response?.data?.detail ||
  err.message ||
  "Unable to load production statistics. Please try again.";

export default function ProductionStatsPanel() {
  const [activeTab, setActiveTab] = useState("suspicious");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const [sus, del, prod] = await Promise.all([
        api.get("suspicious_batches_satistics_api/"),
        api.get("delivered_product_statistics_api/"),
        api.get("overall_production_satistics_api/"),
      ]);

      const responses = [
        {
          response: sus,
          message: "Failed to load suspicious statistics.",
        },
        {
          response: del,
          message: "Failed to load delivery statistics.",
        },
        {
          response: prod,
          message: "Failed to load overall production statistics.",
        },
      ];

      for (const item of responses) {
        if (!item.response.data?.status) {
          throw new Error(
            item.response.data?.message || item.message
          );
        }

        if (
          !item.response.data?.data ||
          typeof item.response.data.data !== "object"
        ) {
          throw new Error(item.message);
        }
      }

      setData({
        suspicious: sus.data.data,
        delivered: del.data.data,
        production: prod.data.data,
      });
    } catch (err) {
      console.error("Production stats error:", err);
      setError(getErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const current = data ? data[activeTab] : null;

  return (
    <div className="rounded-2xl shadow-2xl bg-[#F4F5F7] [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] border border-slate-100 p-5 w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center flex-wrap justify-between gap-2 mb-2">
        <h3 className="text-xl font-semibold text-gray-600 tracking-wider">
          Production Stats
        </h3>

        <div className="flex bg-slate-100  rounded-lg p-1 mt-1 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Message text="Loading production statistics..." />
        ) : error ? (
          <Message
            text={error}
            tone="red"
            onRetry={fetchData}
          />
        ) : !current ? (
          <Message text="No data available." />
        ) : (
          <>
            {activeTab === "suspicious" && (
              <SuspiciousView data={current} />
            )}

            {activeTab === "delivered" && (
              <DeliveredView data={current} />
            )}

            {activeTab === "production" && (
              <ProductionView data={current} />
            )}
          </>
        )}
      </div>
    </div>
  );
}


function Message({ text, tone, onRetry }) {
  const isError = tone === "red";

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-48 mt-15 gap-3 text-center">
      {isError && (
        <AlertCircle size={28} className="text-red-500" />
      )}

      <p
        className={`text-sm font-medium ${
          isError ? "text-red-500" : "text-slate-500"
        }`}
      >
        {isError ? "Unable to load production statistics" : text}
      </p>

      {isError && (
        <>
          <p className="text-sm text-slate-500 break-words">
            {text}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </>
      )}
    </div>
  );
}


/* ============================================================
   TAB 1 - SUSPICIOUS
============================================================ */
function SuspiciousView({ data }) {
  const byQuality = Array.isArray(data?.suspicious_batches_by_quality)
    ? data.suspicious_batches_by_quality
    : [];

  const maxQuality = Math.max(
    ...byQuality.map((q) => num(q?.total)),
    1
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Tile
          label="Suspicious Batches"
          value={num(data?.total_suspicious_batches)}
        />

        <Tile
          label="Mismatched %"
          value={`${fixed1(data?.total_mismatched_percentage)}%`}
          badge={{
            text: fixed1(data?.total_mismatched_percentage),
            tone: "red",
          }}
        />

        <Tile
          label="Resolved"
          value={num(data?.resolved_products)}
          tone="green"
        />

        <Tile
          label="Rejected"
          value={num(data?.rejected_products)}
          tone="red"
        />
      </div>

      <p className="text-xs font-medium text-slate-500 mb-2">
        By Fabric Quality
      </p>

      <BarList
        items={byQuality.map((item) => ({
          label: item?.fabric_quality__name,
          value: num(item?.total),
        }))}
        max={maxQuality}
        color="bg-blue-400"
      />
    </div>
  );
}

/* ============================================================
   TAB 2 - DELIVERED
============================================================ */
function DeliveredView({ data }) {
  const fmt = (n) => `Rs ${num(n).toLocaleString()}`;
  const isProfit = num(data?.total_profit) >= 0;

  const byPurchaser = Array.isArray(data?.total_delivery_by_purchaser)
    ? data.total_delivery_by_purchaser
    : [];

  const byStatus = Array.isArray(data?.delivery_by_status)
    ? data.delivery_by_status
    : [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Tile
          label="Products Delivered"
          value={num(data?.total_products_delivered)}
        />

        <Tile
          label="Total Sales"
          value={fmt(data?.total_sales)}
        />
      </div>

      <div
        className={`rounded-xl p-3 mb-5 flex items-center justify-between ${
          isProfit ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div>
          <p
            className={`text-xl font-bold ${
              isProfit ? "text-green-600" : "text-red-500"
            }`}
          >
            {fmt(data?.total_profit)}
          </p>

          <p
            className={`text-xs mt-1 ${
              isProfit
                ? "text-green-700/70"
                : "text-red-500/70"
            }`}
          >
            Net Profit
          </p>
        </div>

        <span
          className={`text-lg ${
            isProfit ? "text-green-500" : "text-red-500"
          }`}
        >
          {isProfit ? "▲" : "▼"}
        </span>
      </div>

      <p className="text-xs font-medium text-slate-500 mb-2">
        By Purchaser
      </p>

      <div className="divide-y divide-slate-100 mb-4">
        {byPurchaser.length === 0 && (
          <p className="text-xs text-slate-400 py-1.5">
            No deliveries yet
          </p>
        )}

        {byPurchaser.map((item, i) => (
          <div
            key={`${item?.purchaser_name}-${i}`}
            className="flex items-center justify-between py-1.5"
          >
            <span className="text-sm text-slate-600 truncate">
              {item?.purchaser_name}
            </span>

            <span className="text-sm font-medium text-slate-800">
              {item?.total}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {byStatus.map((item, i) => (
          <span
            key={`${item?.delivery_status}-${i}`}
            className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600"
          >
            {item?.delivery_status}: {item?.total}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TAB 3 - PRODUCTION
============================================================ */
function ProductionView({ data }) {
  const passed = num(data?.total_passed);
  const failed = num(data?.total_failed);
  const tested = passed + failed;

  const passRate =
    tested > 0
      ? ((passed / tested) * 100).toFixed(1)
      : "0.0";

  const byName = Array.isArray(data?.products_by_name)
    ? data.products_by_name
    : [];

  const maxName = Math.max(
    ...byName.map((item) => num(item?.total)),
    1
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Tile
          label="Fabric Received"
          value={`${num(data?.total_fabric_received)} kg`}
        />

        <Tile
          label="Fabric Used"
          value={`${num(data?.fabric_used)} kg`}
        />

        <Tile
          label="Manufactured"
          value={num(data?.total_products_manufactured)}
        />

        <Tile
          label="Wastage %"
          value={`${fixed1(data?.total_wastage_percentage)}%`}
          tone="red"
        />
      </div>

      <div className="bg-slate-50 rounded-xl p-3 mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-slate-500">Pass Rate</p>
          <p className="text-sm font-semibold text-slate-800">
            {passRate}%
          </p>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>

      <p className="text-xs font-medium text-slate-500 mb-2">
        By Product Name
      </p>

      <BarList
        items={byName.map((item) => ({
          label: item?.name,
          value: num(item?.total),
        }))}
        max={maxName}
        color="bg-indigo-400"
      />
    </div>
  );
}

/* ============================================================
   SHARED COMPONENTS
============================================================ */
function Tile({ label, value, tone, badge }) {
  const bg =
    tone === "green"
      ? "bg-green-50"
      : tone === "red"
      ? "bg-red-50"
      : "bg-slate-50";

  const text =
    tone === "green"
      ? "text-green-600"
      : tone === "red"
      ? "text-red-500"
      : "text-slate-800";

  return (
    <div className={`${bg} rounded-xl p-3`}>
      <div className="flex items-center gap-2">
        <p className={`text-xl font-bold ${text}`}>
          {value}
        </p>

        {badge && (
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium ${
              badge.tone === "red"
                ? "bg-red-50 text-red-500"
                : "bg-green-50 text-green-600"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-1">
        {label}
      </p>
    </div>
  );
}

function BarList({ items = [], max = 1, color }) {
  if (items.length === 0) {
    return (
      <p className="text-xs text-slate-400">
        No data yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className="flex items-center gap-2"
        >
          <span className="text-xs text-slate-500 w-20 truncate">
            {item.label}
          </span>

          <div className="flex-1 bg-slate-100 rounded-full h-2">
            <div
              className={`${color} h-2 rounded-full`}
              style={{
                width: `${Math.min(
                  (num(item.value) / max) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <span className="text-xs text-slate-600 w-10 text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

