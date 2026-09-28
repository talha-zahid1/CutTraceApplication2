import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

// ============================================================
// DeleteConfirmModal - reusable confirm-delete popup.
// Used by FabricInPage (and can be reused by other modules'
// delete actions later).
// ============================================================

export default function DeleteConfirmModal({ open, itemLabel, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-slate-800 font-semibold text-base mb-1.5">Delete this entry?</h3>
        <p className="text-sm text-slate-500 mb-4">
          This action can't be undone. The following entry will be permanently removed:
        </p>

        {itemLabel && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 mb-5">
            <p className="text-sm font-medium text-slate-700 truncate">{itemLabel}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm shadow-red-200"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
