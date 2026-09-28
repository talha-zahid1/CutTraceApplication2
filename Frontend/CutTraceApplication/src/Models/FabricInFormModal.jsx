import React, { useState, useEffect } from "react";
import { X, Layers, Truck, User, Palette, Wallet, StickyNote } from "lucide-react";

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

    // TODO: API CALL HERE
    // if (isEdit) {
    //   fetch(`/api/production/fabric-in/${initialData.fabric_in_id}/`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(form),
    //   }).then((res) => res.json()).then((res) => { if (res.status) onSave(form); });
    // } else {
    //   fetch("/api/production/fabric-in/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(form),
    //   }).then((res) => res.json()).then((res) => { if (res.status) onSave(form); });
    // }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-800 font-semibold text-base">
              {isEdit ? "Edit Fabric Entry" : "Add Fabric Entry"}
            </h3>
            <p className="text-xs text-slate-400">
              {isEdit ? "Update the details below" : "Fill in the fabric intake details"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {/* Parties */}
          <Section icon={User} label="Parties">
            <div className="grid grid-cols-2 gap-3">
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
            <div className="grid grid-cols-3 gap-3">
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
                  placeholder="e.g. Grade A"
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

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200"
            >
              <Truck size={15} />
              {isEdit ? "Save Changes" : "Add Fabric"}
            </button>
          </div>
        </form>
      </div>

      {/* Tailwind can't target a custom ".input" class without config,
          so it's defined inline here via a <style> tag for this modal only. */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #334155;
          background: #f8fafc;
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
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
