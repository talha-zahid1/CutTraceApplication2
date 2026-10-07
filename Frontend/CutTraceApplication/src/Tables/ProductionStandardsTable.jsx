import React from "react";
import { Pencil, Trash2, Ruler } from "lucide-react";

// Is model me status field nahi hai, is liye koi row locked nahi hoti —
// Edit aur Delete hamesha enabled rehte hain.
export default function ProductionStandardsTable({ rows, onEdit, onDelete }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No standards found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.standard_id}
          className="flex items-center gap-2 sm:gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Ruler size={18} className="text-blue-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{row.final_product_name}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Quality {row.fabric_quality} &bull; SID#{row.standard_id}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
              weight {row.standard_total_weight} kg &bull; {row.standard_wastage_quantity} kg wastage
            </p>
          </div>

          {/* FIX: tight, equal widths, no extra margins — pehle wali overflow yahi se ho rahi thi */}
          <div className="hidden sm:flex flex-col items-end shrink-0 w-20">
            <p className="text-[11px] text-slate-400">Total weight</p>
            <p className="text-sm font-semibold text-slate-700">{row.standard_total_weight} kg</p>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 w-20">
            <p className="text-[11px] text-slate-400">FP Quantity</p>
            <p className="text-sm mr-5 font-semibold text-slate-700">{row.standard_final_product_quantity}</p>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 w-24">
            <p className="text-[11px] text-slate-400">Wastage</p>
            <p className="text-sm font-semibold text-slate-700">{row.standard_wastage_quantity} kg</p>
          </div>

          <div className="hidden lg:block text-xs text-slate-400 shrink-0 w-20 text-right">
            {String(row.updated_at || row.created_at).slice(0, 10)}
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