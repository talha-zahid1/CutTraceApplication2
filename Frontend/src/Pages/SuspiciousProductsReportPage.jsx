import React, { useState, useEffect } from "react";
import { ShieldAlert, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

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

const dummyData = {
  total_suspicious_batches: 14,
  total_mismatched_percentage: 8.4,
  rejected_products: 3,
  resolved_products: 9,
  total_mismatched_products: 27,
  suspicious_batches_by_quality: [
    { fabric_quality__name: "Grade A", total: 6 },
    { fabric_quality__name: "Grade B", total: 5 },
    { fabric_quality__name: "Grade C", total: 3 },
  ],
  suspicious_batches_by_name: [
    { manufactured_id__final_product_name: "Cotton Shirt", total: 5 },
    { manufactured_id__final_product_name: "Denim Jacket", total: 4 },
    { manufactured_id__final_product_name: "Poly Trouser", total: 5 },
  ],
};

export default function SuspiciousProductsReportPage() {
  const [data, setData] = useState(dummyData);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/suspicious_batches_satistics_api/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });
  }, []);

  const maxQuality = Math.max(...data.suspicious_batches_by_quality.map((q) => q.total), 1);
  const maxName = Math.max(...data.suspicious_batches_by_name.map((n) => n.total), 1);
  const isOverTarget = data.total_mismatched_percentage > 0;

  const investigated = data.resolved_products + data.rejected_products;
  const resolutionRate = investigated > 0
    ? ((data.resolved_products / investigated) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-5 mt-6">
        Suspicious Products Report
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <Tile icon={ShieldAlert} iconBg="bg-slate-100" iconColor="text-slate-600" label="Suspicious Batches" value={data.total_suspicious_batches} />
        <Tile
          icon={TrendingUp}
          iconBg={isOverTarget ? "bg-rose-50" : "bg-emerald-50"}
          iconColor={isOverTarget ? "text-rose-600" : "text-emerald-600"}
          label="Mismatched %"
          value={`${data.total_mismatched_percentage.toFixed(1)}%`}
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
          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${resolutionRate}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Total mismatched products across all batches:{" "}
          <span className="text-slate-700 font-medium">{data.total_mismatched_products}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm font-medium text-slate-600 mb-3">By Fabric Quality</p>
          <BarList
            items={data.suspicious_batches_by_quality.map((i) => ({
              label: i.fabric_quality__name,
              value: i.total,
            }))}
            max={maxQuality}
            color="bg-indigo-500"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm font-medium text-slate-600 mb-3">By Product</p>
          <BarList
            items={data.suspicious_batches_by_name.map((i) => ({
              label: i.manufactured_id__final_product_name,
              value: i.total,
            }))}
            max={maxName}
            color="bg-slate-500"
          />
        </div>
      </div>
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
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-24 truncate">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-600 w-10 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}