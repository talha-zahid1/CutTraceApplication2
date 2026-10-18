import React from "react";
import { Pencil, PackageCheck } from "lucide-react";

const STATUS_STYLES = {
  ready: "bg-blue-50 text-blue-600",
  delivered: "bg-emerald-50 text-emerald-600",
};

function statusStyle(status) {
  return (
    STATUS_STYLES[String(status || "").toLowerCase()] ||
    "bg-slate-100 text-slate-600"
  );
}

// Example: 11 Oct 2026, 10:49 pm
function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return String(value);

  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${date}, ${time}`;
}

export default function ReadyToDeliverTable({ rows, qualities, onEdit }) {
  const getQualityName = (id) => {
    const found = (qualities || []).find(
      (q) => String(q.quality_id) === String(id)
    );
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
        const isEditable =
          String(row.status || "").toLowerCase() !== "delivered";

        return (
          <div
            key={row.ready_to_deliver_id}
            className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            {/* Top row (original layout) */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <PackageCheck size={18} className="text-blue-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {row.final_product_name}
                  </p>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(
                      row.status
                    )}`}
                  >
                    {row.status || "-"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-0.5 break-words sm:truncate">
                  Batch #{row.batch_id} &bull; Manufactured #
                  {row.manufactured_id} &bull; RD#{row.ready_to_deliver_id}
                </p>
              </div>

              {/* Desktop / tablet numbers (original) */}
              <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
                <p className="text-sm font-semibold text-slate-700">
                  {row.quantity} pcs
                </p>
                <p className="text-[11px] text-slate-400">
                  {row.wastage_percentage}% wastage
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end shrink-0 w-32">
                <p className="text-sm font-semibold text-slate-700">
                  {getQualityName(row.fabric_quality)}
                </p>
                <p className="text-[11px] text-slate-400">
                  {formatDateTime(row.prepared_at)}
                </p>
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

            {/* Mobile / tablet (md se neeche): divider, pills, bold date, notes */}
            <div className="md:hidden mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  {row.quantity} pcs
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {getQualityName(row.fabric_quality)}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  FP {row.final_product_percentage}%
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-600">
                  Wastage {row.wastage_kg} kg &bull;{" "}
                  {row.wastage_percentage}%
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700 mt-2.5">
                {formatDateTime(row.prepared_at)}
              </p>

              {row.notes && (
                <p className="text-xs text-slate-400 mt-1 break-words">
                  Notes: {row.notes}
                </p>
              )}
            </div>

            {/* Desktop: notes neeche */}
            {row.notes && (
              <p className="hidden md:block text-xs text-slate-400 mt-2 break-words">
                Notes: {row.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}