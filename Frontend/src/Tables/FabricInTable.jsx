import React, { useContext } from "react";
import { Pencil, Trash2, Layers } from "lucide-react";
import { model_context } from "../Context/ApiContext";


function qualityStyle() {
  return "bg-indigo-50 text-indigo-600";
}

function formatDateTime(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function FabricInTable({ rows, onEdit, onDelete }) {
  
  const { role, setrole } = useContext(model_context)
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No fabric entries found.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-3">
      {rows.map((row) => (
        <div
          key={row.fabric_in_id}
          className="w-full min-w-0 rounded-xl border border-slate-100 bg-white px-3 py-3 sm:px-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
        >
          {/* Main row */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* Icon */}
            <div className="hidden sm:flex w-10 h-10 rounded-full bg-blue-50 items-center justify-center shrink-0">
              <Layers size={18} className="text-blue-500" />
            </div>

            {/* Main info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-800 break-words">
                  {row.supplier_name}
                </p>

                <span
                  className={`inline-flex items-center whitespace-nowrap text-[11px] font-medium px-2.5 py-0.5 rounded-full ${qualityStyle(
                    row.fabric_quality
                  )}`}
                >
                  {row.fabric_quality}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400 break-words md:truncate">
                To {row.receiver_name} &bull; {row.color} &bull; FID #
                {row.fabric_in_id}
              </p>
            </div>

            {/* Quantity (tablet and up) */}
            <div className="hidden md:flex flex-col items-end shrink-0 w-24">
              <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                {row.quantity_kg} kg
              </p>
              <p className="text-[11px] text-slate-400">quantity</p>
            </div>

            {/* Cost (tablet and up) */}
            <div className="hidden md:flex flex-col items-end shrink-0 w-28">
              <p className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Rs {Number(row.total_cost).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 whitespace-nowrap">
                Rs {row.price_per_kg}/kg
              </p>
            </div>

            {/* Date (desktop only) */}
            <div className="hidden lg:block shrink-0 w-40 text-right text-xs text-slate-400 whitespace-nowrap">
              {formatDateTime(row.received_at)}
            </div>

            {/* Actions */}
            {role=='admin' && <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(row)}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50"
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(row)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>}
          </div>

          {/* Footer for smaller screens: quantity, cost, date */}
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="md:hidden text-xs font-semibold text-slate-700 whitespace-nowrap">
              {row.quantity_kg} kg &bull; Rs{" "}
              {Number(row.total_cost).toLocaleString()}
              <span className="font-normal text-slate-400">
                {" "}
                (Rs {row.price_per_kg}/kg)
              </span>
            </p>
            <p className="text-[11px] text-slate-400 whitespace-nowrap">
              {formatDateTime(row.received_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}