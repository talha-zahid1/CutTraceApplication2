import { Trash2, Pencil, Layers } from "lucide-react";
import { useContext } from "react";
import { model_context } from "../Context/ApiContext";

const STAGE_STYLES = {
  "Fabric In": "bg-blue-50 text-blue-600",
  "Ready to Manufacture": "bg-purple-50 text-purple-600",
  Manufactured: "bg-amber-50 text-amber-600",
  Testing: "bg-indigo-50 text-indigo-600",
  "Ready to Deliver": "bg-green-50 text-green-600",
  Delivered: "bg-red-50 text-red-600",
};

const STATUS_STYLES = {
  "In Progress": "bg-amber-50 text-amber-600",
  Manufacturing: "bg-amber-50 text-amber-600",
  Pending: "bg-slate-100 text-slate-600",
  Completed: "bg-emerald-50 text-emerald-600",
};

const DEFAULT_STYLE = "bg-slate-100 text-slate-600";

const statusStyle = (status) => STATUS_STYLES[status] || DEFAULT_STYLE;
const stageStyle = (stage) => STAGE_STYLES[stage] || DEFAULT_STYLE;

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const Badge = ({ className, children }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap text-[11px] font-medium px-2.5 py-0.5 rounded-full ${className}`}
  >
    {children}
  </span>
);

const BatchesTable = ({ rows, onedit, onDelete }) => {
  const { role } = useContext(model_context);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No Batches found.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-3">
      {rows.map((row) => {
        const fabricText =
          row.fabric_in_ids?.length > 0
            ? row.fabric_in_ids
                .map((f) =>
                  typeof f === "object"
                    ? `Fabric In #${f.fabric_in_id} (${f.quantity_used} kg)`
                    : `Fabric In #${f}`
                )
                .join(", ")
            : "No fabric entries";

        return (
          <div
            key={row.batch_id}
            className="w-full min-w-0 rounded-xl border border-slate-100 bg-white px-3 py-3 sm:px-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
          >
            {/* Main row */}
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              {/* Icon */}
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-blue-50 items-center justify-center shrink-0">
                <Layers size={18} className="text-blue-500" />
              </div>

              {/* Batch info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                    {`Batch #${row.batch_id}`}
                  </p>
                  <Badge className={stageStyle(row.current_stage)}>
                    {row.current_stage}
                  </Badge>
                </div>

                <p className="mt-1 text-xs text-slate-400 break-words md:truncate">
                  {fabricText}
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-600">
                  Total: {row.total_quantity_kg ?? 0} kg
                </p>
              </div>

              {/* Status (tablet and up) */}
              <div className="hidden md:flex w-32 shrink-0 justify-center">
                <Badge className={statusStyle(row.current_status)}>
                  {row.current_status}
                </Badge>
              </div>

              {/* Dates (desktop only) */}
              <div className="hidden lg:flex flex-col items-end w-44 shrink-0 text-right">
                <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  {formatDate(row.created_at)}
                </p>
                <p className="text-[11px] text-slate-400 whitespace-nowrap">
                  Updated: {formatDate(row.updated_at) || "Not yet"}
                </p>
              </div>

              {/* Actions */}
              {role == "admin" && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                    onClick={() => onedit(row)}
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
                </div>
              )}
            </div>

            {/* Footer for smaller screens: status + dates */}
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="md:hidden">
                <Badge className={statusStyle(row.current_status)}>
                  {row.current_status}
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-600 whitespace-nowrap">
                {formatDate(row.created_at)}
              </p>
              <p className="text-[11px] text-slate-400 whitespace-nowrap">
                Updated: {formatDate(row.updated_at) || "Not yet"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BatchesTable;