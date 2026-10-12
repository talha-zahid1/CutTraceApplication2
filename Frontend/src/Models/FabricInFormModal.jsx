import React, { useState, useEffect } from "react";
import { X, Layers, Truck, User, Palette, Wallet, StickyNote } from "lucide-react";
import { api } from "../services/auth";

const emptyForm = {
  supplier_name: "",
  receiver_name: "",
  quantity_kg: "",
  fabric_quality: "",
  color: "",
  price_per_kg: "",
  total_cost: "",
  notes: "",
};

export default function FabricInFormModal({ open, initialData, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const isEdit = Boolean(initialData);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      console.log(form)
      const resp = isEdit
        ? await api.put(`fabric_in_api/${initialData.fabric_in_id}/`, form)
        : await api.post("fabric_in_api/", form);

      if (resp.data?.status === false) {
        setError(resp.data.message || "Failed to save fabric entry.");
        return; // modal stays open so the form data is not lost
      }

      onSave();
    } catch (err) {
      console.error("Failed to save fabric in:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to save fabric entry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-3 sm:p-4">
      {/* FIX: max-h-[90dvh] (mobile browser bar ke liye) */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">
        {/* FIX: mobile pe kam padding, header sticky */}
        <div className="sticky top-0 bg-white z-10 flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-800 font-semibold text-base truncate">
              {isEdit ? "Edit Fabric Entry" : "Add Fabric Entry"}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {isEdit ? "Update the details below" : "Fill in the fabric intake details"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">
          {/* Parties */}
          <Section icon={User} label="Parties">
            {/* FIX: mobile pe 1 column, sm se 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Supplier Name">
                <input
                  type="text"
                  required
                  value={form.supplier_name}
                  onChange={(e) => handleChange("supplier_name", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Receiver Name">
                <input
                  type="text"
                  required
                  value={form.receiver_name}
                  onChange={(e) => handleChange("receiver_name", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* Fabric details */}
          <Section icon={Palette} label="Fabric Details">
            {/* FIX: mobile pe 1 column, sm se 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Quantity (kg)">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.quantity_kg}
                  onChange={(e) => handleChange("quantity_kg", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Quality">
                <input
                  type="text"
                  required
                  placeholder="e.g. polyster Cotton"
                  value={form.fabric_quality}
                  onChange={(e) => handleChange("fabric_quality", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Color">
                <input
                  type="text"
                  required
                  value={form.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* Cost */}
          <Section icon={Wallet} label="Cost">
            {/* Yeh 2 column hi rehne diya (number fields chhote hain) */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price / kg">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price_per_kg}
                  onChange={(e) => handleChange("price_per_kg", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Total Cost">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.total_cost}
                  onChange={(e) => handleChange("total_cost", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* Notes */}
          <Section icon={StickyNote} label="Notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="input resize-none"
            />
          </Section>

          {error && (
            <p className="text-sm text-red-500 break-words">{error}</p>
          )}

          {/* FIX: mobile pe buttons full width */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200 disabled:opacity-60"
            >
              <Truck size={15} />
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Fabric"}
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
          font-size: 16px; /* FIX: iPhone pe input focus par zoom nahi hoga */
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

function Section({ icon: Icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon size={13} className="text-slate-400" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}