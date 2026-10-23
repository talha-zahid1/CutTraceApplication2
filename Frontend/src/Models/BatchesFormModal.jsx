import { Layers, X, Truck, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/auth";

const emptyRow = { fabric_in_id: "", quantity_used: "" };
const emptyForm = {
  fabric_in_ids: [{ ...emptyRow }],
  current_stage: "",
  current_status: "",
};
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];

const BatchesFormModal = ({ isopen, onclose, initialdata, onsave }) => {
  const [form, setform] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isedit = Boolean(initialdata);

  useEffect(() => {
    setError("");
    if (initialdata) {
      setform({
        current_stage: initialdata.current_stage ?? "",
        current_status: initialdata.current_status ?? "",
        fabric_in_ids: initialdata.fabric_in_ids?.length
          ? initialdata.fabric_in_ids.map((f) =>
              typeof f === "object"
                ? { fabric_in_id: f.fabric_in_id, quantity_used: f.quantity_used }
                : { fabric_in_id: f, quantity_used: "" }
            )
          : [{ ...emptyRow }],
      });
    } else {
      setform(emptyForm);
    }
  }, [initialdata, isopen]);

  const handlechange = (field, value) =>
    setform((prev) => ({ ...prev, [field]: value }));

  const handleRowChange = (index, field, value) =>
    setform((prev) => {
      const updated = [...prev.fabric_in_ids];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, fabric_in_ids: updated };
    });

  const addRow = () =>
    setform((prev) => ({
      ...prev,
      fabric_in_ids: [...prev.fabric_in_ids, { ...emptyRow }],
    }));

  const removeRow = (index) =>
    setform((prev) => ({
      ...prev,
      fabric_in_ids: prev.fabric_in_ids.filter((_, i) => i !== index),
    }));

  const submithandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      fabric_in_ids: form.fabric_in_ids.map((r) => ({
        fabric_in_id: Number(r.fabric_in_id),
        quantity_used: Number(r.quantity_used),
      })),
    };

    try {
      const resp = isedit
        ? await api.put(`product_batches_api/${initialdata.batch_id}/`, payload)
        : await api.post("product_batches_api/", payload);

      if (resp.data?.status === false) {
        throw new Error(resp.data?.message || "Failed to save batch.");
      }
      onsave(); // page ab data dobara fetch karega
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          (err.response?.data?.error
            ? JSON.stringify(err.response.data.error)
            : null) ||
          err.message ||
          "Failed to save batch."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isopen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-800 font-semibold text-base">
              {isedit ? "Edit Batch Entry" : "Add Batches Entry"}
            </h3>
            <p className="text-xs text-slate-400">
              {isedit ? "Update the details below" : "Fill in the production batch details"}
            </p>
          </div>
          <button type="button" onClick={onclose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submithandler} className="px-6 py-5 space-y-6">
          <Section icon={Layers} label="Fabric In Entries">
            <div className="space-y-2.5">
              {form.fabric_in_ids.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={`Fabric In ID #${index + 1}`}
                    className="input"
                    value={row.fabric_in_id}
                    onChange={(e) => handleRowChange(index, "fabric_in_id", e.target.value)}
                  />
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    placeholder="Qty (kg)"
                    className="input"
                    value={row.quantity_used}
                    onChange={(e) => handleRowChange(index, "quantity_used", e.target.value)}
                  />
                  {form.fabric_in_ids.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRow}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600"
            >
              <Plus size={14} /> Add another Fabric In
            </button>
          </Section>

          <Section icon={Truck} label="Batch Details">
            <div className="grid grid-cols-2 gap-5">
              <Field label="Current Stage">
                <input
                  type="text"
                  required
                  value={form.current_stage}
                  onChange={(e) => handlechange("current_stage", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Status">
                <select
                  required
                  value={form.current_status}
                  onChange={(e) => handlechange("current_status", e.target.value)}
                  className="input"
                >
                  <option value="">Select status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          {error && <p className="text-sm text-red-500 break-words">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50"
              onClick={onclose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200 disabled:opacity-60"
            >
              <Truck size={15} />
              {saving ? "Saving..." : isedit ? "Save Changes" : "Add Batch"}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`.input{
          width:100%;
          border:1px solid #e2e8f0;
          border-radius:0.5rem;
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
        }`}
      </style>
    </div>
  );
};

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

export default BatchesFormModal;