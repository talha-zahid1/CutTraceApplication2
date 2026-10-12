import React from "react";
import { Pencil, PackageCheck } from "lucide-react";

const STATUS_STYLES = {
  ready: "bg-blue-50 text-blue-600",
  delivered: "bg-emerald-50 text-emerald-600",
};

function statusStyle(status) {
  return STATUS_STYLES[status.toLowerCase()] || "bg-slate-100 text-slate-600";
}

export default function ReadyToDeliverTable({ rows, qualities, onEdit }) {
  const getQualityName = (id) => {
    const found = qualities.find((q) => String(q.quality_id) === String(id));
    return found ? found.name : "-";
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No entries found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        // Once delivered, the record has been consumed by delivered_view —
        // treat it as no longer editable here.
        const isEditable = row.status.toLowerCase() !== "delivered";

        return (
          <div
            key={row.ready_to_deliver_id}
            className="flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <PackageCheck size={18} className="text-blue-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-800 truncate">{row.final_product_name}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(row.status)}`}>
                  {row.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Batch #{row.batch_id} &bull; Manufactured #{row.manufactured_id} &bull; RD#{row.ready_to_deliver_id}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
                {row.quantity} pcs &bull; {getQualityName(row.fabric_quality)} &bull; Wastage: {row.wastage_percentage}%
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
              <p className="text-sm font-semibold text-slate-700">{row.quantity} pcs</p>
              <p className="text-[11px] text-slate-400">{row.wastage_percentage}% wastage</p>
            </div>

            <div className="hidden md:flex flex-col items-end shrink-0 w-28">
              <p className="text-sm font-semibold text-slate-700">{getQualityName(row.fabric_quality)}</p>
              <p className="text-[11px] text-slate-400">{String(row.prepared_at).slice(0, 10)}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(row)}
                disabled={!isEditable}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <Pencil size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
