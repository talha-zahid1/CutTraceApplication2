import React, { useContext } from "react";
import { Trash2, Pencil, ClipboardList } from "lucide-react";
import { model_context } from "../Context/ApiContext";
const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  cancelled: "bg-red-50 text-red-600",
};

function statusStyle(status) {
  return (
    STATUS_STYLES[String(status || "").toLowerCase()] ||
    "bg-slate-100 text-slate-600"
  );
}

// Backend se aaya hua datetime ko date + time mein dikhata hai
function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function ActionButtons({ row, isPending, onEdit, onDelete }) {
  const { role, setrole } = useContext(model_context)
  return (
    <div className="flex items-center gap-1 shrink-0">
      {role=='admin'&&<button
        onClick={() => onEdit(row)}
        disabled={!isPending}
        className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
      >
        <Pencil size={15} />
      </button>
      
      }
      {role=='admin'&&<button
        onClick={() => onDelete(row)}
        disabled={!isPending}
        className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
      >
        <Trash2 size={15} />
      </button>}
    </div>
  );
}

export default function ReadyToManufactureTable({
  rows,
  qualities = [],
  onEdit,
  onDelete,
}) {
  // fabric_quality backend se id aati hai, is se naam nikalte hain
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
    <div className="w-full min-w-0 space-y-3">
      {rows.map((row) => {
        // Edit / Cancel sirf pending par ho sakta hai
        const isPending = String(row.status || "").toLowerCase() === "pending";

        const statusBadge = (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 capitalize ${statusStyle(
              row.status
            )}`}
          >
            {row.status}
          </span>
        );

        return (
          <div
            key={row.ready_manufacture_id}
            className="w-full min-w-0 rounded-xl border border-slate-100 bg-white hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            {/* ================= MOBILE LAYOUT (sm se neeche) ================= */}
            <div className="sm:hidden p-3">
              {/* Header: naam + status + actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800 break-words">
                      {row.final_product_name}
                    </p>
                    {statusBadge}
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5 break-words">
                    Master: {row.master_name} &bull; Tailor: {row.tailor_name}{" "}
                    <span className="whitespace-nowrap">
                      &bull; RMId #{row.ready_manufacture_id}
                    </span>
                  </p>
                </div>

                <ActionButtons
                  row={row}
                  isPending={isPending}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>

              {/* Divider + details */}
              <div className="border-t border-slate-100 mt-3 pt-3 space-y-1">
                <p className="text-xs text-slate-500 break-words">
                  <span className="font-semibold text-slate-700">
                    {row.fabric_quantity_kg} kg
                  </span>{" "}
                  &bull; {getQualityName(row.fabric_quality)} &bull;{" "}
                  {row.color}
                </p>

                <p className="text-xs text-slate-500 break-words">
                  Batch #{row.batch_id} &bull; Delivery: {row.delivery_boy_name}
                </p>

                <p className="text-xs text-slate-400">
                  Assigned: {formatDateTime(row.assigned_at)}
                </p>

                <p className="text-xs text-slate-400">
                  
                  Updated: {row.updated_at ? formatDateTime(row.updated_at) : "—"}
                </p>
              </div>
            </div>

            {/* ================= DESKTOP / TABLET LAYOUT (sm+) ================= */}
            <div className="hidden sm:flex items-center gap-4 p-4">
              {/* Icon */}
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <ClipboardList size={18} className="text-blue-500" />
              </div>

              {/* Main info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-x-2 gap-y-1 flex-wrap min-w-0">
                  <p className="text-sm font-semibold text-slate-800 break-words min-w-0">
                    {row.final_product_name}
                  </p>
                  {statusBadge}
                </div>

                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  Master: {row.master_name} &bull; Tailor: {row.tailor_name}{" "}
                  <span className="whitespace-nowrap">
                    &bull; RMId #{row.ready_manufacture_id}
                  </span>
                </p>
              </div>

              {/* Quantity */}
              <div className="flex flex-col items-end shrink-0 w-20 md:w-24">
                <p className="text-sm font-semibold text-slate-700">
                  {row.fabric_quantity_kg} kg
                </p>
                <p className="text-[11px] text-slate-400">
                  Batch #{row.batch_id}
                </p>
              </div>

              {/* Quality & color (md+) */}
              <div className="hidden md:flex flex-col items-end shrink-0 w-28 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate max-w-full">
                  {getQualityName(row.fabric_quality)}
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-full">
                  {row.color}
                </p>
              </div>

              {/* Assigned / Updated (lg+) */}
              <div className="hidden lg:flex flex-col items-end gap-1 shrink-0 w-40 text-right">
                <div>
                  <p className="text-[11px] text-slate-400">Assigned</p>
                  <p className="text-xs text-slate-500">
                    {formatDateTime(row.assigned_at)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Updated</p>
                  <p className="text-xs text-slate-500">
                    {row.updated_at ? formatDateTime(row.updated_at) : "—"}
                  </p>
                </div>
              </div>

              <ActionButtons
                row={row}
                isPending={isPending}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}