import React, { useState, useEffect, useCallback } from "react";
import {
  Package, Recycle, Boxes, Trash2, CheckCircle2, XCircle,
  AlertCircle, RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

const EMPTY_DATA = {
  total_fabric_received: 0,
  fabric_used: 0,
  total_products_manufactured: 0,
  total_wastage: 0,
  total_wastage_percentage: 0,
  total_passed: 0,
  total_failed: 0,
  products_by_name: [],
  products_by_quality: [],
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
    "total_fabric_received", "fabric_used", "total_products_manufactured",
    "total_wastage", "total_wastage_percentage", "total_passed", "total_failed",
  ];

  return numericFields.every(
    (field) =>
      report[field] !== null &&
      report[field] !== undefined &&
      Number.isFinite(Number(report[field]))
  ) &&
    Array.isArray(report.products_by_name) &&
    report.products_by_name.every(
      (item) => item && typeof item.name === "string" && Number.isFinite(Number(item.total))
    ) &&
    Array.isArray(report.products_by_quality) &&
    report.products_by_quality.every(
      (item) => item && typeof item.quality === "string" && Number.isFinite(Number(item.total))
    );
};

export default function OverallProductionReportPage() {
  const [data, setData] = useState(EMPTY_DATA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("overall_production_satistics_api/");

      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Couldn't load overall production stats."
          )
        );
      }

      const report = response.data?.data;
      if (!isValidReport(report)) {
        throw new Error(
          response.data?.message ||
            "Invalid overall production statistics received from the server."
        );
      }

      setData({ ...EMPTY_DATA, ...report });
    } catch (err) {
      console.error(
        "Failed to fetch overall production statistics:",
        err.response?.data || err.message
      );
      setError(getErrorMessage(err, "Couldn't load overall production stats."));
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fabricReceived = Number(data.total_fabric_received) || 0;
  const fabricUsed = Number(data.fabric_used) || 0;
  const passed = Number(data.total_passed) || 0;
  const failed = Number(data.total_failed) || 0;
  const tested = passed + failed;

  const fabricUtilization = fabricReceived > 0
    ? ((fabricUsed / fabricReceived) * 100).toFixed(1)
    : "0.0";
  const passRate = tested > 0 ? ((passed / tested) * 100).toFixed(1) : "0.0";

  const maxName = Math.max(...data.products_by_name.map((item) => Number(item.total) || 0), 1);
  const maxQuality = Math.max(...data.products_by_quality.map((item) => Number(item.total) || 0), 1);
  const passDeg = (Number(passRate) / 100) * 360;
  const donutGradient = `conic-gradient(#059669 0deg ${passDeg}deg, #e11d48 ${passDeg}deg 360deg)`;

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />
      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-5 mt-6">
        Overall Production Report
      </h2>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">Loading overall production report...</p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">Unable to load overall production report</p>
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
            <Tile icon={Package} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Fabric Received" value={`${data.total_fabric_received} kg`} />
            <Tile icon={Recycle} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Fabric Used" value={`${data.fabric_used} kg`} sub={`${fabricUtilization}% utilization`} />
            <Tile icon={Boxes} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Manufactured" value={data.total_products_manufactured} />
            <Tile icon={Trash2} iconBg="bg-rose-50" iconColor="text-rose-600" label="Wastage" value={`${(Number(data.total_wastage_percentage) || 0).toFixed(1)}%`} sub={`${data.total_wastage} kg`} tone="rose" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <div className="w-full h-full rounded-full" style={{ background: donutGradient }} />
              <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                <p className="text-lg font-bold text-slate-800">{passRate}%</p>
                <p className="text-[10px] text-slate-400">Pass Rate</p>
              </div>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><CheckCircle2 size={15} className="text-emerald-600" /> Passed</span>
                <span className="font-medium text-slate-800">{data.total_passed}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><XCircle size={15} className="text-rose-600" /> Failed</span>
                <span className="font-medium text-slate-800">{data.total_failed}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <p className="text-sm font-medium text-slate-600 mb-3">By Product Name</p>
              {data.products_by_name.length ? (
                <BarList items={data.products_by_name.map((item) => ({ label: item.name, value: Number(item.total) || 0 }))} max={maxName} color="bg-indigo-500" />
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">No product data available yet.</p>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <p className="text-sm font-medium text-slate-600 mb-3">By Fabric Quality</p>
              {data.products_by_quality.length ? (
                <BarList items={data.products_by_quality.map((item) => ({ label: item.quality, value: Number(item.total) || 0 }))} max={maxQuality} color="bg-slate-500" />
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">No fabric quality data available yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Tile({ icon: Icon, iconBg, iconColor, label, value, sub, tone }) {
  const text = tone === "rose" ? "text-rose-600" : "text-slate-800";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
        <Icon size={15} className={iconColor} />
      </div>
      <p className={`text-xl font-bold ${text}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
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
          <span className="text-xs text-slate-600 w-12 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
