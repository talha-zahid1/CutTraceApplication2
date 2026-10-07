import React, { useState, useEffect } from "react";

// ============================================================
// ProductionStatsPanel
// Single panel (matches "Production Pipeline" card size) with
// tabs to switch between the 3 stats views instead of stacking
// 3 separate cards.
//
// Tabs map to:
//   Suspicious -> suspicious_batches_stats_view
//   Delivered  -> delivered_products_stats_view
//   Production -> Overall_production_stats_view
// ============================================================

const dummy = {
  suspicious: {
    total_suspicious_batches: 14,
    total_mismatched_percentage: 8.4,
    rejected_products: 3,
    resolved_products: 9,
    suspicious_batches_by_quality: [
      { fabric_quality__quality_name: "Grade A", total: 6 },
      { fabric_quality__quality_name: "Grade B", total: 5 },
      { fabric_quality__quality_name: "Grade C", total: 3 },
    ],
  },
  delivered: {
    total_products_delivered: 1240,
    total_sales: 860000,
    total_profit: 275000,
    total_delivery_by_purchaser: [
      { purchaser_name: "Al-Karam Traders", total: 12 },
      { purchaser_name: "City Textiles", total: 8 },
      { purchaser_name: "Zain Fabrics", total: 5 },
    ],
    delivery_by_status: [
      { delivery_status: "Delivered", total: 20 },
      { delivery_status: "Pending", total: 4 },
      { delivery_status: "Cancelled", total: 1 },
    ],
  },
  production: {
    total_fabric_received: 5200,
    fabric_used: 4700,
    total_products_manufactured: 3100,
    total_wastage_percentage: 7.3,
    total_passed: 2850,
    total_failed: 14,
    products_by_name: [
      { name: "Cotton Shirt", total: 1200 },
      { name: "Denim Jacket", total: 900 },
      { name: "Poly Trouser", total: 1000 },
    ],
  },
};

const TABS = [
  { key: "suspicious", label: "Suspicious" },
  { key: "delivered", label: "Delivered" },
  { key: "production", label: "Production" },
];

export default function ProductionStatsPanel() {
  const [activeTab, setActiveTab] = useState("suspicious");
  const [data, setData] = useState(dummy);

  useEffect(() => {
    // TODO: API CALL HERE (fetch all 3 once, or fetch per-tab on switch)
    // Promise.all([
    //   fetch("/api/production/suspicious-batches-stats/").then((r) => r.json()),
    //   fetch("/api/production/delivered-products-stats/").then((r) => r.json()),
    //   fetch("/api/production/overall-production-stats/").then((r) => r.json()),
    // ]).then(([sus, del, prod]) => {
    //   setData({ suspicious: sus.data, delivered: del.data, production: prod.data });
    // });
  }, []);

  return (
    <div className=" rounded-2xl shadow-2xl bg-[#F4F5F7] p-5 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] border border-slate-100 p-5 w-full h-full flex flex-col">
      {/* Header with tab switcher (mirrors the icon-toggle position on Production Pipeline card) */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="text-xl font-semibold text-gray-600 tracking-wider ">Production Stats</h3>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
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

      <div className="flex-1 overflow-y-auto over">
        {activeTab === "suspicious" && <SuspiciousView data={data.suspicious} />}
        {activeTab === "delivered" && <DeliveredView data={data.delivered} />}
        {activeTab === "production" && <ProductionView data={data.production} />}
      </div>
    </div>
  );
}

function SuspiciousView({ data }) {
  const maxQuality = Math.max(...data.suspicious_batches_by_quality.map((q) => q.total), 1);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Tile label="Suspicious Batches" value={data.total_suspicious_batches} />
        <Tile
          label="Mismatched %"
          value={`${data.total_mismatched_percentage.toFixed(1)}%`}
          badge={{ text: `${data.total_mismatched_percentage.toFixed(1)}`, tone: "red" }}
        />
        <Tile label="Resolved" value={data.resolved_products} tone="green" />
        <Tile label="Rejected" value={data.rejected_products} tone="red" />
      </div>
      <p className="text-xs font-medium text-slate-500 mb-2">By Fabric Quality</p>
      <BarList
        items={data.suspicious_batches_by_quality.map((i) => ({
          label: i.fabric_quality__quality_name,
          value: i.total,
        }))}
        max={maxQuality}
        color="bg-blue-400"
      />
    </div>
  );
}

function DeliveredView({ data }) {
  const fmt = (n) => `Rs ${Number(n).toLocaleString()}`;
  const isProfit = data.total_profit >= 0;
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Tile label="Products Delivered" value={data.total_products_delivered} />
        <Tile label="Total Sales" value={fmt(data.total_sales)} />
      </div>
      <div
        className={`rounded-xl p-3 mb-5 flex items-center justify-between ${
          isProfit ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div>
          <p className={`text-xl font-bold ${isProfit ? "text-green-600" : "text-red-500"}`}>
            {fmt(data.total_profit)}
          </p>
          <p className={`text-xs mt-1 ${isProfit ? "text-green-700/70" : "text-red-500/70"}`}>
            Net Profit
          </p>
        </div>
        <span className={`text-lg ${isProfit ? "text-green-500" : "text-red-500"}`}>
          {isProfit ? "▲" : "▼"}
        </span>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-2">By Purchaser</p>
      <div className="divide-y divide-slate-100 mb-4">
        {data.total_delivery_by_purchaser.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <span className="text-sm text-slate-600 truncate">{item.purchaser_name}</span>
            <span className="text-sm font-medium text-slate-800">{item.total}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {data.delivery_by_status.map((item, i) => (
          <span
            key={i}
            className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600"
          >
            {item.delivery_status}: {item.total}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductionView({ data }) {
  const passRate = (
    (data.total_passed / (data.total_passed + data.total_failed)) *
    100
  ).toFixed(1);
  const maxName = Math.max(...data.products_by_name.map((n) => n.total), 1);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Tile label="Fabric Received" value={`${data.total_fabric_received} kg`} />
        <Tile label="Fabric Used" value={`${data.fabric_used} kg`} />
        <Tile label="Manufactured" value={data.total_products_manufactured} />
        <Tile
          label="Wastage %"
          value={`${data.total_wastage_percentage.toFixed(1)}%`}
          tone="red"
        />
      </div>
      <div className="bg-slate-50 rounded-xl p-3 mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-slate-500">Pass Rate</p>
          <p className="text-sm font-semibold text-slate-800">{passRate}%</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${passRate}%` }} />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-2">By Product Name</p>
      <BarList
        items={data.products_by_name.map((i) => ({ label: i.name, value: i.total }))}
        max={maxName}
        color="bg-indigo-400"
      />
    </div>
  );
}

function Tile({ label, value, tone, badge }) {
  const bg =
    tone === "green" ? "bg-green-50" : tone === "red" ? "bg-red-50" : "bg-slate-50";
  const text =
    tone === "green" ? "text-green-600" : tone === "red" ? "text-red-500" : "text-slate-800";
  return (
    <div className={`${bg} rounded-xl p-3`}>
      <div className="flex items-center gap-2">
        <p className={`text-xl font-bold ${text}`}>{value}</p>
        {badge && (
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium ${
              badge.tone === "red" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function BarList({ items, max, color }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-20 truncate">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-600 w-10 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
