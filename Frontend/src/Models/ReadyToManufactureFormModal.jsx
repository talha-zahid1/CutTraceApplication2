import React, { useState, useEffect } from "react";
import {
  X,
  ClipboardList,
  Truck,
  Users,
  Palette,
  StickyNote,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "../services/auth";

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

// Batch API ke fields yahan se adjust kar sakte ho
const getBatchId = (batch) => batch.batch_id ?? batch.id;

const getBatchQuantity = (batch) =>
  batch.quantity_kg ??
  batch.total_quantity_kg ??
  batch.fabric_quantity_kg ??
  batch.total_quantity ??
  batch.quantity;

const getBatchLabel = (batch) => {
  const qty = getBatchQuantity(batch);
  const hasQty = qty !== undefined && qty !== null && qty !== "";

  return hasQty
    ? `Batch #${getBatchId(batch)} • ${qty} kg`
    : `Batch #${getBatchId(batch)}`;
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
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      // batch_id kabhi object aata hai, kabhi sirf id
      const batchId =
        initialData.batch_id && typeof initialData.batch_id === "object"
          ? initialData.batch_id.batch_id
          : initialData.batch_id;

      setForm({ ...emptyForm, ...initialData, batch_id: batchId ?? "" });
    } else {
      setForm(emptyForm);
    }
    setError(null);
    setSaving(false);
  }, [initialData, open]);

  if (!open) return null;

  const isEdit = Boolean(initialData);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Batch select hone par uski quantity form mein khud set ho jati hai
  const handleBatchChange = (value) => {
    const selected = (batches || []).find(
      (b) => String(getBatchId(b)) === String(value)
    );
    const qty = selected ? getBatchQuantity(selected) : "";

    setForm((prev) => ({
      ...prev,
      batch_id: value,
      fabric_quantity_kg: qty ?? "",
    }));
  };

  const saveEntry = async () => {
    setSaving(true);
    setError(null);

    try {
      let resp;

      if (isEdit) {
        resp = await api.put(
          `ready_to_manufacture_api/${initialData.ready_manufacture_id}/`,
          form
        );
      } else {
        resp = await api.post("ready_to_manufacture_api/", form);
      }

      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message ||
            (resp.data?.error ? JSON.stringify(resp.data.error) : "") ||
            "Failed to save Ready To Manufacture entry."
        );
      }

      console.log(form);
      onSave(form);
    } catch (err) {
      console.error(
        "Failed to save Ready To Manufacture entry:",
        err.response?.data || err.message
      );

      const data = err.response?.data;
      const message =
        data?.message ||
        (data?.error
          ? typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error)
          : "") ||
        err.message ||
        "Something went wrong";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEntry();
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
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {error ? (
          /* Error UI */
          <div className="px-4 sm:px-6 py-12 flex flex-col items-center text-center">
            <AlertCircle size={36} className="text-red-500 mb-3" />

            <p className="text-red-500 font-semibold text-base">
              Unable to save Ready to Manufacture details
            </p>

            <p className="text-slate-500 text-sm mt-3 break-words max-w-full">
              {error}
            </p>

            <button
              type="button"
              onClick={saveEntry}
              disabled={saving}
              className="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={saving ? "animate-spin" : ""}
              />
              Try again
            </button>

            <button
              type="button"
              onClick={() => setError(null)}
              className="mt-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Back to form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">
            {/* Batch & Product */}
            <Section icon={ClipboardList} label="Batch & Product">
              <div className="grid grid-cols-1 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Batch: select karne par quantity (fabric_quantity_kg) khud set hoti hai */}
                <div className="sm:col-span-2 min-w-0">
                  <Field label="Batch">
                    <select
                      required
                      value={form.batch_id}
                      onChange={(e) => handleBatchChange(e.target.value)}
                      className="input"
                    >
                      <option value="">Select batch</option>

                      {(batches || []).map((batch) => {
                        const id = getBatchId(batch);
                        return (
                          <option key={id} value={id}>
                            {getBatchLabel(batch)}
                          </option>
                        );
                      })}
                    </select>
                  </Field>
                </div>

                <Field label="Quality">
                  <select
                    required
                    value={form.fabric_quality}
                    onChange={(e) =>
                      handleChange("fabric_quality", e.target.value)
                    }
                    className="input"
                  >
                    <option value="">Select quality</option>

                    {(qualities || []).map((quality) => (
                      <option
                        key={quality.quality_id}
                        value={quality.quality_id}
                      >
                        {quality.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Color */}
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

            {/* Notes */}
            <Section icon={StickyNote} label="Notes">
              <textarea
                rows={3}
                required
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
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
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200 disabled:opacity-60"
              >
                <Truck size={15} />
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Entry"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Input Styling */}
      <style>{`
        .input {
          width: 100%;
          min-width: 0;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 0.59rem 0.75rem;
          font-size: 16px;
          color: #334155;
          background: #f8fafc;
        }

        @media (min-width: 640px) {
          .input {
            font-size: 0.875rem;
          }
        }

        /* Placeholder colour for empty required select */
        select.input:required:invalid {
          color: #94a3b8;
        }

        /* Real options always stay dark */
        select.input option {
          color: #334155;
        }

        select.input option[value=""] {
          color: #94a3b8;
        }

        .input::placeholder {
          color: #94a3b8;
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