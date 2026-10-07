import React, { useState, useEffect } from "react";

// ============================================================
// StatusHistoryCard
// Top: donut of delivered_products.delivery_status breakdown
//   (already available as `delivery_by_status` in
//   delivered_products_stats_view's response).
// Bottom: Recent Deliveries list - individual delivered_products
//   records, latest first. Added to fill the card's height evenly
//   with the Inspection Values card next to it, and to actually
//   surface useful info instead of empty space.
//
// NOTE: current delivered_view POST always sets status to
// 'Delivered', and DELETE (cancel) is not implemented yet, so
// in practice only "Delivered" will appear until that's built.
// Dummy data below shows all 3 states so the design reads
// correctly once backend supports them.
// ============================================================

const dummyData = {
  total_products_delivered: 1240,
  delivery_by_status: [
    { delivery_status: "Delivered", total: 1180 },
    { delivery_status: "Pending", total: 45 },
    { delivery_status: "Cancelled", total: 15 },
  ],
};

// Recent records - use delivered_products fields directly:
// final_product_name, purchaser_name, delivered_at, delivery_status
const dummyRecent = [
  {
    final_product_name: "Cotton Shirt",
    purchaser_name: "Al-Karam Traders",
    delivered_at: "2024-12-03",
    delivery_status: "Delivered",
  },
  {
    final_product_name: "Denim Jacket",
    purchaser_name: "City Textiles",
    delivered_at: "2024-12-02",
    delivery_status: "Delivered",
  },
  {
    final_product_name: "Poly Trouser",
    purchaser_name: "Zain Fabrics",
    delivered_at: "2024-12-02",
    delivery_status: "Pending",
  },
  {
    final_product_name: "Cotton Shirt",
    purchaser_name: "Noor Garments",
    delivered_at: "2024-12-01",
    delivery_status: "Delivered",
  },
  {
    final_product_name: "Denim Jacket",
    purchaser_name: "Al-Karam Traders",
    delivered_at: "2024-11-30",
    delivery_status: "Cancelled",
  },
];

const COLORS = {
  Delivered: "#60a5fa", // blue-400
  Pending: "#fbbf24", // amber-400
  Cancelled: "#f87171", // red-400
};

const STATUS_BADGE = {
  Delivered: "bg-blue-50 text-blue-500",
  Pending: "bg-amber-50 text-amber-600",
  Cancelled: "bg-red-50 text-red-500",
};

export default function StatusHistoryCard() {
  const [data, setData] = useState(dummyData);
  const [recent, setRecent] = useState(dummyRecent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/api/production/delivered-products-stats/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });

    // TODO: API CALL HERE (recent deliveries)
    // IMPORTANT: backend needs to support returning individual
    // delivered_products records sorted latest-first (-delivered_at)
    // and limited to a small count (e.g. 5). Existing delivered_view
    // GET just returns all records unsorted/unlimited - either add
    // ordering/limit support there, or add a dedicated endpoint.
    // Adjust the query params below once that's decided.
    // fetch("/api/production/delivered-products/?ordering=-delivered_at&limit=5", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setRecent(res.data);
    //   })
    //   .finally(() => setLoading(false));
  }, []);

  const total = data.delivery_by_status.reduce((sum, s) => sum + s.total, 0);

  let cumulative = 0;
  const stops = data.delivery_by_status.map((s) => {
    const start = (cumulative / total) * 360;
    cumulative += s.total;
    const end = (cumulative / total) * 360;
    const color = COLORS[s.delivery_status] || "#94a3b8";
    return `${color} ${start}deg ${end}deg`;
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="bg-[#F4F5F7] p-5 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] rounded-2xl shadow-2xl  border border-slate-100 p-5 w-full h-full flex flex-col transition-all duration-200 hover:-translate-y-1 ">
      <h3 className="text-slate-800 font-semibold text-lg mb-5">Status History</h3>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-36 h-36 shrink-0">
          <div className="w-full h-full rounded-full" style={{ background: gradient }} />
          <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-slate-800">{data.total_products_delivered}</p>
            <p className="text-[10px] text-slate-400 text-center leading-tight">
              Total Delivered
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {data.delivery_by_status.map((item, i) => {
            const pct = ((item.total / total) * 100).toFixed(0);
            return (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: COLORS[item.delivery_status] || "#94a3b8" }}
                  />
                  {item.delivery_status}
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {item.total}{" "}
                  <span className="text-xs text-slate-400 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 flex-1">
        <p className="text-xs font-medium text-slate-500 mb-3">Recent Deliveries</p>
        <div className="divide-y divide-slate-100">
          {recent.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="min-w-0">
                <p className="text-sm text-slate-700 truncate">{item.final_product_name}</p>
                <p className="text-xs text-slate-400 truncate">{item.purchaser_name}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400">{item.delivered_at}</span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    STATUS_BADGE[item.delivery_status] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.delivery_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
