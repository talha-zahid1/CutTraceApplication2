import React from "react";
import { Pencil, ShieldAlert } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  investigating: "bg-blue-50 text-blue-600",
  resolved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
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
        const status = String(row.investigation_status || "").toLowerCase();
        const isEditable = status !== "resolved" && status !== "rejected";

        return (
          <div
            key={row.suspicious_id}
            className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            {/* Top row (original layout) */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <ShieldAlert size={18} className="text-red-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    Suspicious #{row.suspicious_id}
                  </p>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(
                      row.investigation_status
                    )}`}
                  >
                    {row.investigation_status || "-"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-0.5 sm:truncate break-words">
                  Batch #{row.batch_id} &bull; Manufactured #
                  {row.manufactured_id}
                  <span className="hidden sm:inline">
                    {" "}
                    &bull; Detected: {formatDateTime(row.detected_at)}
                  </span>
                </p>

                {/* Reason: desktop par yahin, mobile par neeche */}
                <p className="hidden sm:block text-xs text-slate-500 mt-1 italic truncate">
                  {row.reason}
                </p>
              </div>

              {/* Desktop numbers (original) */}
              <div className="hidden sm:flex flex-col items-end shrink-0 w-32">
                <p className="text-sm font-semibold text-slate-700">
                  {row.actual_wastage_percentage}%{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    / {row.expected_wastage_percentage}%
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">
                  wastage (actual/expected)
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end shrink-0 w-32">
                <p className="text-sm font-semibold text-slate-700">
                  {row.actual_final_product_quantity}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    / {row.expected_final_product_quantity}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">
                  output (actual/expected)
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

            {/* Mobile only: divider, pills, bold date, reason */}
            <div className="sm:hidden mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-600">
                  Wastage {row.actual_wastage_percentage}% /{" "}
                  {row.expected_wastage_percentage}%
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  Output {row.actual_final_product_quantity} /{" "}
                  {row.expected_final_product_quantity}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700 mt-2.5">
                {formatDateTime(row.detected_at)}
              </p>

              {row.reason && (
                <p className="text-xs text-slate-400 mt-1 italic break-words">
                  {row.reason}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}