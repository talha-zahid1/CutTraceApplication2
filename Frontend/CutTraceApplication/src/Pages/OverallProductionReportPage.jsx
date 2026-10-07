import React, { useState, useEffect } from "react";
import { Package, Recycle, Boxes, Trash2, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

// ============================================================
// OverallProductionReportPage
// Maps to: Overall_production_stats_view -> GET /overall_production_satistics_api/
// GET-only endpoint, no CRUD, so this is a single self-contained file.
// ============================================================

const dummyData = {
  total_fabric_received: 5200,
  fabric_used: 4700,
  total_products_manufactured: 3100,
  total_wastage: 380,
  total_wastage_percentage: 7.3,
  total_passed: 2850,
  total_failed: 14,
  products_by_name: [
    { name: "Cotton Shirt", total: 1200 },
    { name: "Denim Jacket", total: 900 },
    { name: "Poly Trouser", total: 1000 },
  ],
  products_by_quality: [
    { quality: "Grade A", total: 1600 },
    { quality: "Grade B", total: 1100 },
    { quality: "Grade C", total: 400 },
  ],
};

export default function OverallProductionReportPage() {
  const [data, setData] = useState(dummyData);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/overall_production_satistics_api/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });
  }, []);

  const fabricUtilization = ((data.fabric_used / data.total_fabric_received) * 100).toFixed(1);
  const passRate = ((data.total_passed / (data.total_passed + data.total_failed)) * 100).toFixed(1);

  const maxName = Math.max(...data.products_by_name.map((n) => n.total), 1);
  const maxQuality = Math.max(...data.products_by_quality.map((q) => q.total), 1);

  const passDeg = (passRate / 100) * 360;
  const donutGradient = `conic-gradient(#059669 0deg ${passDeg}deg, #e11d48 ${passDeg}deg 360deg)`;

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-5 mt-6">
        Overall Production Report
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <Tile icon={Package} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Fabric Received" value={`${data.total_fabric_received} kg`} />
        <Tile icon={Recycle} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Fabric Used" value={`${data.fabric_used} kg`} sub={`${fabricUtilization}% utilization`} />
        <Tile icon={Boxes} iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Manufactured" value={data.total_products_manufactured} />
        <Tile icon={Trash2} iconBg="bg-rose-50" iconColor="text-rose-600" label="Wastage" value={`${data.total_wastage_percentage.toFixed(1)}%`} sub={`${data.total_wastage} kg`} tone="rose" />
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
            <span className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 size={15} className="text-emerald-600" /> Passed
            </span>
            <span className="font-medium text-slate-800">{data.total_passed}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <XCircle size={15} className="text-rose-600" /> Failed
            </span>
            <span className="font-medium text-slate-800">{data.total_failed}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm font-medium text-slate-600 mb-3">By Product Name</p>
          <BarList
            items={data.products_by_name.map((i) => ({ label: i.name, value: i.total }))}
            max={maxName}
            color="bg-indigo-500"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm font-medium text-slate-600 mb-3">By Fabric Quality</p>
          <BarList
            items={data.products_by_quality.map((i) => ({ label: i.quality, value: i.total }))}
            max={maxQuality}
            color="bg-slate-500"
          />
        </div>
      </div>
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
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-24 truncate">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-600 w-12 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}