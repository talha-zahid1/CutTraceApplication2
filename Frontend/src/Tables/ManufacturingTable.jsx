
import React, { useContext } from "react";
import { Trash2, Pencil } from "lucide-react";
import { model_context } from "../Context/ApiContext";
const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  "ready to deliver": "bg-emerald-50 text-emerald-600",
  "ready for testing": "bg-blue-50 text-blue-600",
  flagged: "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-600",
};

function statusStyle(status) {
  return (
    STATUS_STYLES[String(status || "").toLowerCase()] ||
    "bg-sky-50 text-sky-600"
  );
}

// Example: 13-Oct-2026, 08:52 am
function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return String(value);

  const date = d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

  const time = d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${date}, ${time}`;
}

export default function ManufacturingTable({ rows, qualities, onEdit, onDelete }) {
  const getQualityName = (id) => {
    const found = (qualities || []).find(
      (q) => String(q.quality_id) === String(id)
    );
    return found ? found.name : "-";
  };
  const {role,setrole}=useContext(model_context)
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
        // Edit / Cancel sirf pending par ho sakta hai
        const isPending = String(row.status || "").toLowerCase() === "pending";
        
        return (
          <div
            key={row.manufactured_id}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            {/* Top: naam, badges, buttons */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-semibold text-slate-800">
                    {row.final_product_name}
                  </p>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {getQualityName(row.fabric_quality)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusStyle(
                      row.status
                    )}`}
                  >
                    {row.status || "-"}
                  </span>
                </div>

                <p className="text-sm text-slate-400 mt-1 break-words">
                  To {row.receiver_name} &bull; Master {row.master_name} &bull;
                  Tailor {row.tailor_name} &bull; Batch #{row.batch_id} &bull;
                  MID #{row.manufactured_id}
                </p>
              </div>

              {role=='admin'&&<div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(row)}
                  disabled={!isPending}
                  className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                >
                  <Pencil size={17} />
                </button>
                <button
                  onClick={() => onDelete(row)}
                  disabled={!isPending}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                >
                  <Trash2 size={17} />
                </button>
              </div>}
            </div>

            <div className="border-t border-slate-100 my-3" />

            {/* Bottom: numbers */}
            <p className="text-sm text-slate-800">
              <span className="font-semibold">
                {row.final_product_quantity} pcs
              </span>
              <span className="font-semibold"> &bull; FP {row.final_product_percentage}%</span>
              <span className="text-slate-400">
                {" "}
                (Wastage {row.wastage_kg} kg &bull; {row.wastage_percentage}%)
              </span>
            </p>

            <p className="text-sm text-slate-400 mt-1">
              {row.original_quantity_kg} kg in &bull;{" "}
              {formatDateTime(row.manufactured_at)}
            </p>

            {row.notes && (
              <p className="text-xs text-slate-400 mt-1.5 break-words">
                Notes: {row.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}