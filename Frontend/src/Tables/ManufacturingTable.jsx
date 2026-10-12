import React from "react";
import { Trash2, Pencil, Factory } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  "ready to deliver": "bg-emerald-50 text-emerald-600",
  flagged: "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-600",
};

function statusStyle(status) {
  return STATUS_STYLES[status.toLowerCase()] || "bg-slate-100 text-slate-600";
}

export default function ManufacturingTable({ rows, qualities, onEdit, onDelete }) {
  // fabric_quality backend se id aati hai, is se naam nikalte hain
  const getQualityName = (id) => {
    const found = qualities.find((q) => String(q.quality_id) === String(id));
    return found ? found.name : "-";
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No manufactured entries found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        // Edit / Cancel sirf pending par ho sakta hai (backend isi tarah enforce karta hai)
        const isPending = row.status.toLowerCase() === "pending";

        return (
          <div
            key={row.manufactured_id}
            className="flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Factory size={18} className="text-blue-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-800 truncate">{row.final_product_name}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(row.status)}`}>
                  {row.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Master: {row.master_name} &bull; Tailor: {row.tailor_name} &bull; Batch #{row.batch_id}
              </p>
              {/* Mobile pe extra details */}
              <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
                {row.final_product_quantity} pcs &bull; {getQualityName(row.fabric_quality)} &bull; Wastage: {row.wastage_percentage}%
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
              <p className="text-sm font-semibold text-slate-700">{row.final_product_quantity} pcs</p>
              <p className="text-[11px] text-slate-400">{row.wastage_percentage}% wastage</p>
            </div>

            <div className="hidden md:flex flex-col items-end shrink-0 w-28">
              <p className="text-sm font-semibold text-slate-700">{getQualityName(row.fabric_quality)}</p>
              <p className="text-[11px] text-slate-400">{row.original_quantity_kg} kg in</p>
            </div>

            <div className="hidden lg:block text-xs text-slate-400 shrink-0 w-24 text-right">
              {String(row.manufactured_at).slice(0, 10)}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(row)}
                disabled={!isPending}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(row)}
                disabled={!isPending}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
