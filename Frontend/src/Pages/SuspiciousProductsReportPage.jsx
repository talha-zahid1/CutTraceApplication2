import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert, TrendingUp, CheckCircle2, XCircle,
  AlertCircle, RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

// ============================================================
// SuspiciousProductsReportPage
// Maps to: suspicious_batches_stats_view -> GET /suspicious_batches_satistics_api/
// GET-only endpoint, single self-contained file.
//
// NOTE: this page is under "Reports" and shows AGGREGATE stats —
// different from the "Suspicious Products" page under Production
// (SuspiciousProductsPage.jsx), which lists individual records to
// investigate/update.
//
// Field names below assume the two backend bugs are fixed:
//   fabric_quality__quality_name -> fabric_quality__name
//   ready_to_manufacture_id__final_product_name -> manufactured_id__final_product_name
// ============================================================

const EMPTY_DATA = {
  total_suspicious_batches: 0,
  total_mismatched_percentage: 0,
  rejected_products: 0,
  resolved_products: 0,
  total_mismatched_products: 0,
  suspicious_batches_by_quality: [],
  suspicious_batches_by_name: [],
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
    "total_suspicious_batches", "total_mismatched_percentage", "rejected_products",
    "resolved_products", "total_mismatched_products",
  ];

  return numericFields.every(
    (field) =>
      report[field] !== null &&
      report[field] !== undefined &&
      Number.isFinite(Number(report[field]))
  ) &&
    Array.isArray(report.suspicious_batches_by_quality) &&
    report.suspicious_batches_by_quality.every(
      (item) => item && typeof item.fabric_quality__name === "string" && Number.isFinite(Number(item.total))
    ) &&
    Array.isArray(report.suspicious_batches_by_name) &&
    report.suspicious_batches_by_name.every(
      (item) => item && typeof item.manufactured_id__final_product_name === "string" && Number.isFinite(Number(item.total))
    );
};

export default function SuspiciousProductsReportPage() {
  const [data, setData] = useState(EMPTY_DATA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("suspicious_batches_satistics_api/");

      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Couldn't load suspicious products stats."
          )
        );
      }

      const report = response.data?.data;
      if (!isValidReport(report)) {
        throw new Error(
          response.data?.message ||
            "Invalid suspicious products statistics received from the server."
        );
      }

      setData({ ...EMPTY_DATA, ...report });
    } catch (err) {
      console.error(
        "Failed to fetch suspicious products statistics:",
        err.response?.data || err.message
      );
      setError(getErrorMessage(err, "Couldn't load suspicious products stats."));
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mismatchedPct = Number(data.total_mismatched_percentage) || 0;
  const isOverTarget = mismatchedPct > 0;

  const resolved = Number(data.resolved_products) || 0;
  const rejected = Number(data.rejected_products) || 0;
  const investigated = resolved + rejected;
  const resolutionRate = investigated > 0
    ? ((resolved / investigated) * 100).toFixed(1)
    : "0.0";

  const maxQuality = Math.max(...data.suspicious_batches_by_quality.map((item) => Number(item.total) || 0), 1);
  const maxName = Math.max(...data.suspicious_batches_by_name.map((item) => Number(item.total) || 0), 1);

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />
      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-5 mt-6">
        Suspicious Products Report
      </h2>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">Loading suspicious products report...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">Unable to load suspicious products report</p>
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
            <Tile icon={ShieldAlert} iconBg="bg-slate-100" iconColor="text-slate-600" label="Suspicious Batches" value={data.total_suspicious_batches} />
            <Tile
              icon={TrendingUp}
              iconBg={isOverTarget ? "bg-rose-50" : "bg-emerald-50"}
              iconColor={isOverTarget ? "text-rose-600" : "text-emerald-600"}
              label="Mismatched %"
              value={`${mismatchedPct.toFixed(1)}%`}
              tone={isOverTarget ? "rose" : "emerald"}
            />
            <Tile icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Resolved" value={data.resolved_products} tone="emerald" />
            <Tile icon={XCircle} iconBg="bg-rose-50" iconColor="text-rose-600" label="Rejected" value={data.rejected_products} tone="rose" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm text-slate-500">Resolution Rate</p>
              <p className="text-sm font-semibold text-slate-800">
                {resolutionRate}%{" "}
                <span className="text-xs text-slate-400 font-normal">
                  ({data.resolved_products} resolved / {data.rejected_products} rejected)
                </span>
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, Math.max(0, Number(resolutionRate)))}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Total mismatched products across all batches:{" "}
              <span className="text-slate-700 font-medium">{data.total_mismatched_products}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <p className="text-sm font-medium text-slate-600 mb-3">By Fabric Quality</p>
              {data.suspicious_batches_by_quality.length ? (
                <BarList
                  items={data.suspicious_batches_by_quality.map((item) => ({
                    label: item.fabric_quality__name,
                    value: Number(item.total) || 0,
                  }))}
                  max={maxQuality}
                  color="bg-indigo-500"
                />
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">No fabric quality data available yet.</p>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <p className="text-sm font-medium text-slate-600 mb-3">By Product</p>
              {data.suspicious_batches_by_name.length ? (
                <BarList
                  items={data.suspicious_batches_by_name.map((item) => ({
                    label: item.manufactured_id__final_product_name,
                    value: Number(item.total) || 0,
                  }))}
                  max={maxName}
                  color="bg-slate-500"
                />
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">No product data available yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Tile({ icon: Icon, iconBg, iconColor, label, value, tone }) {
  const text = tone === "emerald" ? "text-emerald-600" : tone === "rose" ? "text-rose-600" : "text-slate-800";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
        <Icon size={15} className={iconColor} />
      </div>
      <p className={`text-xl font-bold ${text}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function BarList({ items, max, color }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-24 truncate">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(100, Math.max(0, (item.value / max) * 100))}%` }} />
          </div>
          <span className="text-xs text-slate-600 w-10 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}