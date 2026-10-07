import React, { useState, useEffect } from "react";
import { X, PackageCheck, Save, StickyNote } from "lucide-react";

// ============================================================
// ReadyToDeliverNotesModal
// Edit-only — no POST/DELETE on this endpoint. The backend's PUT
// is partial=True, so we only send what a user would actually
// change here: `notes`. Everything else (quantity, wastage,
// quality, status) is computed/generated upstream and shown as
// read-only reference info.
// ============================================================

export default function ReadyToDeliverNotesModal({ open, data, qualityName, onClose, onSave }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (data) setNotes(data.notes || "");
  }, [data, open]);

  if (!open || !data) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { notes };

    // TODO: API CALL HERE
    // fetch(`/ready_to_deliver_api/${data.ready_to_deliver_id}/`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) onSave(payload);
    //   });

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <PackageCheck size={18} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-800 font-semibold text-base truncate">
              {data.final_product_name}
            </h3>
            <p className="text-xs text-slate-400 truncate">Ready to Deliver #{data.ready_to_deliver_id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Read-only reference info */}
        <div className="px-4 sm:px-6 pt-5">
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-2 text-sm">
            <Row label="Batch" value={`#${data.batch_id}`} />
            <Row label="Manufactured" value={`#${data.manufactured_id}`} />
            <Row label="Quantity" value={`${data.quantity} pcs`} />
            <Row label="Quality" value={qualityName} />
            <Row label="Wastage" value={`${data.wastage_kg} kg (${data.wastage_percentage}%)`} />
            <Row label="Final Product %" value={`${data.final_product_percentage}%`} />
            <Row label="Prepared" value={String(data.prepared_at).slice(0, 10)} />
            <Row label="Status" value={data.status} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-5">
          <Field label="Notes" icon={StickyNote}>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input resize-none"
              placeholder="Add a note..."
            />
          </Field>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          min-width: 0;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 16px;
          color: #334155;
          background: #f8fafc;
        }
        @media (min-width: 640px) {
          .input { font-size: 0.875rem; }
        }
        .input:focus {
          outline: none;
          background: #fff;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.15);
        }
      `}</style>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-slate-700 font-medium text-right break-words">{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
