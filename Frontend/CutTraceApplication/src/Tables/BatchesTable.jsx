import {Trash2,Pencil , Layers } from "lucide-react";
const STAGE_STYLES = {
  "Fabric In": "bg-blue-50 text-blue-600",
  "Ready to Manufacture": "bg-purple-50 text-purple-600",
  "Manufactured": "bg-amber-50 text-amber-600",
  "Testing": "bg-indigo-50 text-indigo-600",
  "Ready to Deliver": "bg-green-50 text-green-600",
  "Delivered": "bg-red-50 text-red-600",
};
const STATUS_STYLES = {
  "In Progress": "bg-amber-50 text-amber-600",
  "Pending": "bg-slate-100 text-slate-600",
  "Completed": "bg-emerald-50 text-emerald-600",
};

function statusStyle(status) {
  return STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
}
function stageStyle(quality) {
  return STAGE_STYLES[quality] || "bg-slate-100 text-slate-600";
}
const BatchesTable = ({ rows, onedit,onDelete }) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400 text-sm">
        No Batches found.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.batch_id}
          className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 hover:shadow-sm hover:border-slate-200 transition-shadow"
        >
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-blue-500" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-sm font-semibold text-slate-800 truncate">{`Batch #${row.batch_id}`}</p>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${stageStyle(row.current_stage)}`}
              >
                {row.current_stage}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {`From Fabric In #${row.fabric_in_id}`}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyle(row.current_status)}`}
            >
              {row.current_status}
            </span>
          </div>

          <div className="hidden md:flex flex-col items-end shrink-0 w-28">
            <p className="text-sm font-semibold text-slate-700">
              {row.created_at}
            </p>
            <p className="text-[11px] text-slate-400">
              Updated: {row.updated_at || "Not yet"}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button 
            className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50"
            onClick={()=>{onedit(row)}}
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
};

export default BatchesTable;