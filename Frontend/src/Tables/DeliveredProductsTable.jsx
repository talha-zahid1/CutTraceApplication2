import React, { useContext } from "react";
import { Pencil,Trash2, PackageCheck } from "lucide-react";
import { model_context } from "../Context/ApiContext";

const STATUS_STYLES = {
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

function statusStyle(status) {
  return STATUS_STYLES[status.toLowerCase()] || "bg-slate-100 text-slate-600";
}

export default function DeliveredProductsTable({ rows, onEdit, onDelete }) {
  
  const {role,setrole}=useContext(model_context)
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No delivered products found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        // Edit / Cancel sirf tab jab abhi "Delivered" hai (Cancelled ke baad locked)
        const isEditable = row.delivery_status.toLowerCase() === "delivered";

        return (
          <div
            key={row.delivery_id}
            className="flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <PackageCheck size={18} className="text-blue-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-800 truncate">{row.final_product_name}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(row.delivery_status)}`}>
                  {row.delivery_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {row.purchaser_name} &bull; {row.delivery_boy_name} &bull; #{row.delivery_id}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
                Qty {row.quantity} &bull; Total  {Number(row.total_sale_price).toLocaleString()} PKR
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
              <p className="text-sm font-semibold text-slate-700">Qty {row.quantity}</p>
              <p className="text-[11px] text-slate-400">Batch #{row.batch_id}</p>
            </div>

            <div className="hidden md:flex flex-col items-end shrink-0 w-32">
              <p className="text-sm font-semibold text-slate-700">Total Amount </p>
              <p className="text-[11px] mr-5 text-slate-400">{Number(row.total_sale_price).toLocaleString()} PKR</p>
              
            </div>
            <div className="hidden md:flex flex-col items-end shrink-0 w-32">
              <p className="text-sm font-semibold text-slate-700">Total Profit</p>
              <p className="text-[11px] text-slate-400"> {Number(row.net_profit).toLocaleString()} PKR</p>
            </div>

            <div className="hidden lg:block text-xs text-slate-400 shrink-0 w-24 text-right">
              {String(row.delivered_at).slice(0, 10)}
            </div>

            {role=='admin'&&<div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(row)}
                disabled={!isEditable}
                title={!isEditable ? "Cancelled entries can't be edited" : "Edit"}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(row)}
                disabled={!isEditable}
                title={!isEditable ? "Already cancelled" : "Cancel"}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <Trash2 size={15} />
              </button>
            </div>}
          </div>
        );
      })}
    </div>
  );
}
