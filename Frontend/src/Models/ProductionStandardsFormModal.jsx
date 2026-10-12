import React, { useState, useEffect } from "react";
import { X, Ruler, Truck, Package, Scale } from "lucide-react";

const emptyForm = {
  fabric_quality: "",
  final_product_name: "",
  standard_total_weight: "",
  standard_final_product_quantity: "",
  standard_wastage_quantity: "",
};

export default function ProductionStandardsFormModal({ open, initialData, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, open]);

  if (!open) return null;

  const isEdit = Boolean(initialData);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Ruler size={18} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-800 font-semibold text-base truncate">
              {isEdit ? "Edit Standard" : "Add Standard"}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {isEdit ? "Update the standard details" : "Fill in the production standard details"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">
          {/* Product */}
          <Section icon={Package} label="Product">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Final Product Name">
                <input
                  type="text"
                  required
                  value={form.final_product_name}
                  onChange={(e) => handleChange("final_product_name", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Fabric Quality (ID)">
                <input
                  type="number"
                  required
                  value={form.fabric_quality}
                  onChange={(e) => handleChange("fabric_quality", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* Standards */}
          <Section icon={Scale} label="Standard Quantities">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Total Weight (kg)">
                <input
                  type="number"
                  step="0.001"
                  required
                  value={form.standard_total_weight}
                  onChange={(e) => handleChange("standard_total_weight", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Final Product Qty (kg)">
                <input
                  type="number"
                  step="0.001"
                  required
                  value={form.standard_final_product_quantity}
                  onChange={(e) => handleChange("standard_final_product_quantity", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Wastage Qty (kg)">
                <input
                  type="number"
                  step="0.001"
                  required
                  value={form.standard_wastage_quantity}
                  onChange={(e) => handleChange("standard_wastage_quantity", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

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
              <Truck size={15} />
              {isEdit ? "Save Changes" : "Add Standard"}
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
