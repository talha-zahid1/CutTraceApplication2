import React from "react";
import { Pencil, ShieldAlert } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  investigating: "bg-blue-50 text-blue-600",
  resolved: "bg-emerald-50 text-emerald-600",
  confirmed: "bg-red-50 text-red-600",
  rejected: "bg-slate-100 text-slate-600",
};

function statusStyle(status) {
  return STATUS_STYLES[status.toLowerCase()] || "bg-slate-100 text-slate-600";
}

export default function SuspiciousProductsTable({ rows, onEdit }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No suspicious products found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        // PUT sirf tab allowed hai jab investigation abhi resolved/confirmed na hui ho
        const status = row.investigation_status.toLowerCase();
        const isEditable = status !== "resolved" && status !== "confirmed";

        return (
          <div
            key={row.suspicious_id}
            className="flex items-start sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <ShieldAlert size={18} className="text-red-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  Suspicious #{row.suspicious_id}
                </p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(row.investigation_status)}`}>
                  {row.investigation_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Batch #{row.batch_id} &bull; Manufactured #{row.manufactured_id} &bull; Detected: {String(row.detected_at).slice(0, 10)}
              </p>
              <p className="text-xs text-slate-500 mt-1 italic truncate">
                {row.reason}
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end shrink-0 w-32">
              <p className="text-sm font-semibold text-slate-700">
                {row.actual_wastage_percentage}%{" "}
                <span className="text-xs text-slate-400 font-normal">
                  / {row.expected_wastage_percentage}%
                </span>
              </p>
              <p className="text-[11px] text-slate-400">wastage (actual/expected)</p>
            </div>

            <div className="hidden md:flex flex-col items-end shrink-0 w-32">
              <p className="text-sm font-semibold text-slate-700">
                {row.actual_final_product_quantity}{" "}
                <span className="text-xs text-slate-400 font-normal">
                  / {row.expected_final_product_quantity}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">output (actual/expected)</p>
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
