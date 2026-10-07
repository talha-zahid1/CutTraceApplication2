import React, { useState, useEffect } from "react";
import { X, PackageCheck, Truck, Wallet, StickyNote } from "lucide-react";

const emptyForm = {
  ready_to_deliver_id: "",
  delivery_boy_name: "",
  purchaser_name: "",
  total_sale_price: "",
  price_per_item: "",
  original_cost: "",
  other_expenses: "",
  total_cost: "",
  net_profit: "",
  notes: "",
};

// Sirf woh fields jo backend POST me req.data.get(...) se leta hai (aur PUT me bhi
// wahi editable fields honge). batch_id, quantity, final_product_name, fabric_quality
// backend khud ready_to_deliver record se nikalta hai, is liye yahan nahi hain.
export default function DeliveredProductsFormModal({ open, initialData, onClose, onSave }) {
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
            <PackageCheck size={18} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-800 font-semibold text-base truncate">
              {isEdit ? "Edit Delivery" : "Mark as Delivered"}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {isEdit ? "Update the delivery details" : "Fill in the delivery details"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">
          {/* Reference (naya record banate waqt hi lagta hai, edit me locked) */}
          <Section icon={PackageCheck} label="Reference">
            <Field label="Ready to Deliver ID">
              <input
                type="number"
                required
                disabled={isEdit}
                value={form.ready_to_deliver_id}
                onChange={(e) => handleChange("ready_to_deliver_id", e.target.value)}
                className="input disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </Field>
          </Section>

          {/* Delivery */}
          <Section icon={Truck} label="Delivery">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Delivery Boy">
                <input
                  type="text"
                  required
                  value={form.delivery_boy_name}
                  onChange={(e) => handleChange("delivery_boy_name", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Purchaser Name">
                <input
                  type="text"
                  required
                  value={form.purchaser_name}
                  onChange={(e) => handleChange("purchaser_name", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* Pricing */}
          <Section icon={Wallet} label="Pricing">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Total Sale Price">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.total_sale_price}
                  onChange={(e) => handleChange("total_sale_price", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Price / Item">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price_per_item}
                  onChange={(e) => handleChange("price_per_item", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Original Cost">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.original_cost}
                  onChange={(e) => handleChange("original_cost", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Other Expenses">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.other_expenses}
                  onChange={(e) => handleChange("other_expenses", e.target.value)}
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
              <Field label="Net Profit">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.net_profit}
                  onChange={(e) => handleChange("net_profit", e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </Section>

          {/* Notes */}
          <Section icon={StickyNote} label="Notes">
            <textarea
              rows={3}
              required
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="input resize-none"
            />
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
              {isEdit ? "Save Changes" : "Mark Delivered"}
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
