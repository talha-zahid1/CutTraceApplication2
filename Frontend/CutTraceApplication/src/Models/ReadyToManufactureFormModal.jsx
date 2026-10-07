import React, { useState, useEffect } from "react";
import {
  X,
  ClipboardList,
  Truck,
  Users,
  Palette,
  StickyNote,
} from "lucide-react";

const emptyForm = {
  batch_id: "",
  master_name: "",
  tailor_name: "",
  delivery_boy_name: "",
  final_product_name: "",
  fabric_quantity_kg: "",
  fabric_quality: "",
  color: "",
  status: "pending",
  notes: "",
};

export default function ReadyToManufactureFormModal({
  open,
  initialData,
  batches,
  qualities,
  onClose,
  onSave,
}) {
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
    //   fetch(`/ready_to_manufacture_api/${initialData.ready_manufacture_id}/`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(form),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       if (res.status) onSave(form);
    //     });
    // } else {
    //   fetch("/ready_to_manufacture_api/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(form),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       if (res.status) onSave(form);
    //     });
    // }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-blue-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-slate-800 font-semibold text-base truncate">
              {isEdit ? "Edit Entry" : "Add Ready to Manufacture"}
            </h3>

            <p className="text-xs text-slate-400 truncate">
              {isEdit
                ? "Update the details below"
                : "Fill in the manufacturing details"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">

          {/* Batch & Product */}
          <Section icon={ClipboardList} label="Batch & Product">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Batch ID */}
              <Field label="Batch ID">
                <input
                  type="number"
                  required
                  value={form.batch_id}
                  onChange={(e) =>
                    handleChange("batch_id", e.target.value)
                  }
                  className="input"
                  placeholder="Enter batch ID"
                />
              </Field>

              {/* Final Product Name */}
              <Field label="Final Product Name">
                <input
                  type="text"
                  required
                  value={form.final_product_name}
                  onChange={(e) =>
                    handleChange("final_product_name", e.target.value)
                  }
                  className="input"
                  placeholder="e.g. Polyester Hoodie"
                />
              </Field>

            </div>
          </Section>

          {/* People */}
          <Section icon={Users} label="People">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <Field label="Master Name">
                <input
                  type="text"
                  required
                  value={form.master_name}
                  onChange={(e) =>
                    handleChange("master_name", e.target.value)
                  }
                  className="input"
                />
              </Field>

              <Field label="Tailor Name">
                <input
                  type="text"
                  required
                  value={form.tailor_name}
                  onChange={(e) =>
                    handleChange("tailor_name", e.target.value)
                  }
                  className="input"
                />
              </Field>

              <Field label="Delivery Boy">
                <input
                  type="text"
                  required
                  value={form.delivery_boy_name}
                  onChange={(e) =>
                    handleChange("delivery_boy_name", e.target.value)
                  }
                  className="input"
                />
              </Field>

            </div>
          </Section>

          {/* Fabric Details */}
          <Section icon={Palette} label="Fabric Details">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Quantity */}
              <Field label="Quantity (kg)">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.fabric_quantity_kg}
                  onChange={(e) =>
                    handleChange("fabric_quantity_kg", e.target.value)
                  }
                  className="input"
                />
              </Field>

              <Field label="Quality">
  <input
    type="text"
    required
    value={form.fabric_quality}
    onChange={(e) =>
      handleChange("fabric_quality", e.target.value)
    }
    className="input"
    placeholder="Enter quality"
  />
</Field>
              {/* Color */}
              <Field label="Color">
                <input
                  type="text"
                  required
                  value={form.color}
                  onChange={(e) =>
                    handleChange("color", e.target.value)
                  }
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
              onChange={(e) =>
                handleChange("notes", e.target.value)
              }
              className="input resize-none"
              placeholder="Enter notes"
            />
          </Section>

          {/* Buttons */}
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
              {isEdit ? "Save Changes" : "Add Entry"}
            </button>

          </div>
        </form>
      </div>

      {/* Input Styling */}
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
          .input {
            font-size: 0.875rem;
          }
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

        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>

      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>

      {children}
    </div>
  );
}