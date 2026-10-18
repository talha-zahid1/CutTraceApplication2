import React, { useState, useEffect } from "react";
import { api } from "../services/auth";
import {
X,
Factory,
Truck,
Users,
Scissors,
Package,
StickyNote,
AlertCircle,
} from "lucide-react";

const emptyForm = {
batch_id: "",
ready_to_manufacture_id: "",
master_name: "",
tailor_name: "",
receiver_name: "",
original_quantity_kg: "",
fabric_quality: "",
wastage_kg: "",
final_product_name: "",
final_product_quantity: "",
status:"",
notes: "",
};

export default function ManufacturingFormModal({
open,
initialData,
onClose,
qualities,
onSave,
}) {
const [form, setForm] = useState(emptyForm);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const isEdit = Boolean(initialData);

useEffect(() => {
setForm(
initialData
? { ...emptyForm, ...initialData }
: { ...emptyForm }
);
setError("");
setLoading(false);
}, [initialData, open]);

const handleChange = (field, value) => {
setForm((prev) => ({ ...prev, [field]: value }));
};

const handleSubmit = async (e) => {
e.preventDefault();


if (loading) return;

try {
  setLoading(true);
  setError("");

  let res;

  if (isEdit) {
    res = await api.put(
      `manufacturing_api/${initialData.manufactured_id}/`,
      form
    );
  } else {
    res = await api.post("manufacturing_api/", form);
  }

  if (res.data?.status === false) {
    throw new Error(
      res.data?.message ||
        (res.data?.error
          ? JSON.stringify(res.data.error)
          : "Failed to save manufacturing record.")
    );
  }

  onSave(res.data?.data || form);
} catch (err) {
  console.error(
    "Failed to save manufacturing record:",
    err.response?.data || err.message
  );

  setError(
    err.response?.data?.message ||
      err.response?.data?.detail ||
      (err.response?.data?.error
        ? JSON.stringify(err.response.data.error)
        : null) ||
      err.message ||
      "Failed to save manufacturing record."
  );
} finally {
  setLoading(false);
}


};

if (!open) return null;

return ( <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-3 sm:p-4"> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto"> <div className="sticky top-0 bg-white z-10 flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100"> <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0"> <Factory size={18} className="text-blue-500" /> </div>


      <div className="flex-1 min-w-0">
        <h3 className="text-slate-800 font-semibold text-base truncate">
          {isEdit ? "Edit Manufactured Entry" : "Add Manufactured Entry"}
        </h3>

        <p className="text-xs text-slate-400 truncate">
          {isEdit
            ? "Update the details below"
            : "Fill in the manufacturing output details"}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="text-slate-400 hover:text-slate-600 shrink-0 disabled:opacity-50"
      >
        <X size={18} />
      </button>
    </div>

    <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-red-600">
                Unable to save manufacturing record
              </p>
              <p className="text-sm text-red-500 break-words mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <Section icon={Factory} label="References">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Batch ID">
            <input
              type="number"
              required
              min="1"
              value={form.batch_id}
              onChange={(e) => handleChange("batch_id", e.target.value)}
              className="input"
              placeholder="Enter batch ID"
            />
          </Field>

          <Field label="Ready-to-Manufacture ID">
            <input
              type="number"
              required
              min="1"
              value={form.ready_to_manufacture_id}
              onChange={(e) =>
                handleChange("ready_to_manufacture_id", e.target.value)
              }
              className="input"
              placeholder="Enter entry ID"
            />
          </Field>
        </div>
      </Section>

      <Section icon={Users} label="People">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Master Name">
            <input
              type="text"
              required
              value={form.master_name}
              onChange={(e) => handleChange("master_name", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Tailor Name">
            <input
              type="text"
              required
              value={form.tailor_name}
              onChange={(e) => handleChange("tailor_name", e.target.value)}
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

      <Section icon={Scissors} label="Fabric & Wastage">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Original Quantity (kg)">
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.original_quantity_kg}
              onChange={(e) =>
                handleChange("original_quantity_kg", e.target.value)
              }
              className="input"
            />
          </Field>

          <Field label="Fabric Quality">
  <select
    required
    value={form.fabric_quality}
    onChange={(e) => handleChange("fabric_quality", e.target.value)}
    className="input"
  >
    <option value="">Select quality</option>
    {(qualities || []).map((q) => (
      <option key={q.quality_id} value={q.quality_id}>
        {q.name}
      </option>
    ))}
  </select>
</Field>
          <Field label="Wastage (kg)">
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.wastage_kg}
              onChange={(e) => handleChange("wastage_kg", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Status">
  <select
    required
    value={form.status}
    onChange={(e) => handleChange("status", e.target.value)}
    className="input"
  >
    <option value="pending">Pending</option>
    <option value="ready for testing">Ready For Testing</option>
    <option value="ready to deliver">Ready To Deliver</option>
    <option value="ready to deliver">Flagged</option>
    <option value="ready to deliver">cancelled</option>
  </select>
</Field>
        </div>
      </Section>

      <Section icon={Package} label="Final Product">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Product Name">
            <input
              type="text"
              required
              value={form.final_product_name}
              onChange={(e) =>
                handleChange("final_product_name", e.target.value)
              }
              className="input"
              placeholder="e.g. Hoodie"
            />
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              required
              value={form.final_product_quantity}
              onChange={(e) =>
                handleChange("final_product_quantity", e.target.value)
              }
              className="input"
            />
          </Field>
        </div>
      </Section>

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

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Truck size={15} />
          {loading
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Add Entry"}
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
return ( <div> <div className="flex items-center gap-1.5 mb-2.5"> <Icon size={13} className="text-slate-400" /> <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
{label} </p> </div>
{children} </div>
);
}

function Field({ label, children }) {
return ( <div className="min-w-0"> <label className="block text-xs font-medium text-slate-500 mb-1">
{label} </label>
{children} </div>
);
}
