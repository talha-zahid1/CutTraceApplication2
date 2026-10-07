import React from "react";
import { Pencil, Trash2, Layers } from "lucide-react";

const QUALITY_STYLES = {
  "Grade A": "bg-blue-50 text-blue-600",
  "Grade B": "bg-purple-50 text-purple-600",
  "Grade C": "bg-amber-50 text-amber-600",
};

function qualityStyle(quality) {
  return QUALITY_STYLES[quality] || "bg-slate-100 text-slate-600";
}

export default function FabricInTable({ rows, onEdit, onDelete }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No fabric entries found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.fabric_in_id}
          // FIX: mobile pe kam gap aur padding
          className="flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
        >
          {/* FIX: mobile pe chhota icon */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-blue-500" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-slate-800 truncate">{row.supplier_name}</p>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${qualityStyle(row.fabric_quality)}`}>
                {row.fabric_quality}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              To {row.receiver_name} &bull; {row.color} &bull; #{row.fabric_in_id}
            </p>
            {/* FIX: mobile pe quantity aur cost yahan dikhta hai (sm se upar chhup jata hai) */}
            <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
              {row.quantity_kg} kg &bull; Rs {Number(row.total_cost).toLocaleString()}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
            <p className="text-sm font-semibold text-slate-700">{row.quantity_kg} kg</p>
            <p className="text-[11px] text-slate-400">quantity</p>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 w-28">
            <p className="text-sm font-semibold text-slate-700">Rs {Number(row.total_cost).toLocaleString()}</p>
            <p className="text-[11px] text-slate-400">Rs {row.price_per_kg}/kg</p>
          </div>

          <div className="hidden lg:block text-xs text-slate-400 shrink-0 w-24 text-right">
            {row.received_at}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(row)}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(row)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}