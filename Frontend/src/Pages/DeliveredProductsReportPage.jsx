import React, { useState, useEffect } from "react";
import { Truck, Wallet, Banknote, Receipt } from "lucide-react";
import Navbar from "../components/Navbar";

// ============================================================
// DeliveredProductsReportPage
// Maps to: delivered_products_stats_view -> GET /delivered_product_satistics_api/
// GET-only endpoint, single self-contained file.
// ============================================================

const dummyData = {
  total_products_delivered: 1240,
  total_sales: 860000,
  total_cost: 540000,
  total_expenses: 45000,
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
};

const STATUS_COLORS = {
  Delivered: "#4f46e5",
  Pending: "#d97706",
  Cancelled: "#e11d48",
};

export default function DeliveredProductsReportPage() {
  const [data, setData] = useState(dummyData);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/delivered_product_satistics_api/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });
  }, []);

  const fmt = (n) => `Rs ${Number(n).toLocaleString()}`;
  const isProfit = data.total_profit >= 0;

  const profitMargin = ((data.total_profit / data.total_sales) * 100).toFixed(1);

  const maxPurchaser = Math.max(...data.total_delivery_by_purchaser.map((p) => p.total), 1);

  const statusTotal = data.delivery_by_status.reduce((sum, s) => sum + s.total, 0);
  let cumulative = 0;
  const stops = data.delivery_by_status.map((s) => {
    const start = (cumulative / statusTotal) * 360;
    cumulative += s.total;
    const end = (cumulative / statusTotal) * 360;
    return `${STATUS_COLORS[s.delivery_status] || "#64748b"} ${start}deg ${end}deg`;
  });
  const donutGradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-5 mt-6">
        Delivered Products Report
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <Tile icon={Truck} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Products Delivered" value={data.total_products_delivered} />
        <Tile icon={Wallet} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Total Sales" value={fmt(data.total_sales)} />
        <Tile icon={Receipt} iconBg="bg-slate-100" iconColor="text-slate-600" label="Total Cost" value={fmt(data.total_cost)} />
        <Tile icon={Banknote} iconBg="bg-slate-100" iconColor="text-slate-600" label="Other Expenses" value={fmt(data.total_expenses)} />
      </div>

      <div
        className={`rounded-2xl shadow-sm border border-slate-100 p-5 mb-5 flex items-center justify-between ${
          isProfit ? "bg-emerald-50" : "bg-rose-50"
        }`}
      >
        <div>
          <p className={`text-2xl font-bold ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
            {fmt(data.total_profit)}
          </p>
          <p className={`text-xs mt-1 ${isProfit ? "text-emerald-700/70" : "text-rose-600/70"}`}>
            Net Profit &bull; {profitMargin}% margin on sales
          </p>
        </div>
        <span className={`text-2xl ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
          {isProfit ? "▲" : "▼"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm font-medium text-slate-600 mb-3">By Purchaser</p>
          <div className="space-y-2.5">
            {data.total_delivery_by_purchaser.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-28 truncate">{item.purchaser_name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${(item.total / maxPurchaser) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 w-6 text-right">{item.total}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-5">
          <div className="relative w-28 h-28 shrink-0">
            <div className="w-full h-full rounded-full" style={{ background: donutGradient }} />
            <div className="absolute inset-2.5 bg-white rounded-full flex flex-col items-center justify-center">
              <p className="text-base font-bold text-slate-800">{statusTotal}</p>
              <p className="text-[10px] text-slate-400">Deliveries</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {data.delivery_by_status.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: STATUS_COLORS[item.delivery_status] || "#64748b" }}
                  />
                  {item.delivery_status}
                </span>
                <span className="font-medium text-slate-800">{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
        <Icon size={15} className={iconColor} />
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}