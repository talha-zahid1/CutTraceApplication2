import React, { useState, useEffect, useCallback } from "react";
import {
  Truck, Wallet, Banknote, Receipt,
  AlertCircle, RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

// ============================================================
// DeliveredProductsReportPage
// Maps to: delivered_products_stats_view -> GET /delivered_product_satistics_api/
// GET-only endpoint, single self-contained file.
// ============================================================

const EMPTY_DATA = {
  total_products_delivered: 0,
  total_sales: 0,
  total_cost: 0,
  total_expenses: 0,
  total_profit: 0,
  total_delivery_by_purchaser: [],
  delivery_by_status: [],
};

const STATUS_COLORS = {
  Delivered: "#4f46e5",
  Pending: "#d97706",
  Cancelled: "#e11d48",
};

const getErrorMessage = (err, fallback) => {
  const body = err.response?.data;
  if (typeof body?.message === "string") return body.message;
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.error === "string") return body.error;
  if (body?.error) return JSON.stringify(body.error);
  return err.message || fallback;
};

const isValidReport = (report) => {
  if (!report || typeof report !== "object" || Array.isArray(report)) return false;

  const numericFields = [
    "total_products_delivered", "total_sales", "total_cost",
    "total_expenses", "total_profit",
  ];

  return numericFields.every(
    (field) =>
      report[field] !== null &&
      report[field] !== undefined &&
      Number.isFinite(Number(report[field]))
  ) &&
    Array.isArray(report.total_delivery_by_purchaser) &&
    report.total_delivery_by_purchaser.every(
      (item) => item && typeof item.purchaser_name === "string" && Number.isFinite(Number(item.total))
    ) &&
    Array.isArray(report.delivery_by_status) &&
    report.delivery_by_status.every(
      (item) => item && typeof item.delivery_status === "string" && Number.isFinite(Number(item.total))
    );
};

export default function DeliveredProductsReportPage() {
  const [data, setData] = useState(EMPTY_DATA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("delivered_product_statistics_api/");
      
      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Couldn't load delivered products stats."
          )
        );
      }

      const report = response.data?.data;
      if (!isValidReport(report)) {
        throw new Error(
          response.data?.message ||
            "Invalid delivered products statistics received from the server."
        );
      }

      setData({ ...EMPTY_DATA, ...report });
    } catch (err) {
      console.error(
        "Failed to fetch delivered products statistics:",
        err.response?.data || err.message
      );
      setError(getErrorMessage(err, "Couldn't load delivered products stats."));
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fmt = (n) => `Rs ${(Number(n) || 0).toLocaleString()}`;
  const totalProfit = Number(data.total_profit) || 0;
  const totalSales = Number(data.total_sales) || 0;
  const isProfit = totalProfit >= 0;

  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0.0";

  const maxPurchaser = Math.max(
    ...data.total_delivery_by_purchaser.map((p) => Number(p.total) || 0),
    1
  );

  const statusTotal = data.delivery_by_status.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
  let cumulative = 0;
  const stops = statusTotal > 0
    ? data.delivery_by_status.map((s) => {
        const start = (cumulative / statusTotal) * 360;
        cumulative += Number(s.total) || 0;
        const end = (cumulative / statusTotal) * 360;
        return `${STATUS_COLORS[s.delivery_status] || "#64748b"} ${start}deg ${end}deg`;
      })
    : ["#e2e8f0 0deg 360deg"];
  const donutGradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-5 mt-6">
        Delivered Products Report
      </h2>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">Loading delivered products report...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">Unable to load delivered products report</p>
          <p className="max-w-lg break-words text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      ) : (
        <>
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
              {data.total_delivery_by_purchaser.length ? (
                <div className="space-y-2.5">
                  {data.total_delivery_by_purchaser.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-28 truncate">{item.purchaser_name}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${((Number(item.total) || 0) / maxPurchaser) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-6 text-right">{item.total}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">No purchaser data available yet.</p>
              )}
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
                {data.delivery_by_status.length ? (
                  data.delivery_by_status.map((item, i) => (
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
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No delivery status data available yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
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