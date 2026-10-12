import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import ReadyToManufactureTable from "../Tables/ReadyToManufactureTable";
import ReadyToManufactureFormModal from "../Models/ReadyToManufactureFormModal";
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

const PAGE_SIZE = 5;

const getErrorMessage = (err, fallback) => {
  const serverError = err.response?.data?.error;

  if (typeof serverError === "string") {
    return serverError;
  }

  if (serverError) {
    return JSON.stringify(serverError);
  }

  return err.message || fallback;
};

export default function ReadyToManufacturePage() {
  const [data, setData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [qualities, setQualities] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [dataResp, batchesResp, qualitiesResp, quantitiesResp] =
        await Promise.all([
          api.get("ready_to_manufacture_api/"),
          api.get("product_batches_api/"),
          api.get("fabric_quality_api/"),
          api.get("batch_quantities_api/"),
        ]);

      const responses = [
        {
          response: dataResp,
          fallback: "Failed to load manufacturing entries.",
        },
        {
          response: batchesResp,
          fallback: "Failed to load batches.",
        },
        {
          response: qualitiesResp,
          fallback: "Failed to load fabric qualities.",
        },
        {
          response: quantitiesResp,
          fallback: "Failed to load batch quantities.",
        },
      ];

      for (const item of responses) {
        if (item.response.data?.status === false) {
          throw new Error(
            typeof item.response.data.error === "string"
              ? item.response.data.error
              : item.response.data.error
                ? JSON.stringify(item.response.data.error)
                : item.fallback
          );
        }

        if (!Array.isArray(item.response.data?.data)) {
          throw new Error("Invalid response received from server.");
        }
      }

      // batch_id -> total_quantity_kg map banao, phir batches ke saath merge karo
      const quantityMap = Object.fromEntries(
        quantitiesResp.data.data.map((q) => [
          String(q.batch_id),
          q.total_quantity_kg,
        ])
      );

      const mergedBatches = batchesResp.data.data.map((batch) => ({
        ...batch,
        total_quantity_kg: quantityMap[String(batch.batch_id)] ?? null,
      }));

      setData(dataResp.data.data);
      setBatches(mergedBatches);
      setQualities(qualitiesResp.data.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load page details."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return data;

    return data.filter((row) =>
      [
        row.master_name,
        row.tailor_name,
        row.delivery_boy_name,
        row.final_product_name,
        row.color,
      ].some((value) => String(value ?? "").toLowerCase().includes(q))
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => {
    setEditingRow(null);
    setActionError("");
    setIsFormOpen(true);
  };

  const openEditForm = (row) => {
    setEditingRow(row);
    setActionError("");
    setIsFormOpen(true);
  };

  // Existing local save behavior remains unchanged.
  const handleSave = (formData) => {
    if (editingRow) {
      setData((prev) =>
        prev.map((row) =>
          row.ready_manufacture_id === editingRow.ready_manufacture_id
            ? { ...row, ...formData, updated_at: new Date().toISOString() }
            : row
        )
      );
    } else {
      const newRow = {
        ...formData,
        ready_manufacture_id:
          Math.max(0, ...data.map((row) => row.ready_manufacture_id)) + 1,
        assigned_at: new Date().toISOString(),
      };

      setData((prev) => [newRow, ...prev]);
    }

    setIsFormOpen(false);
  };

  const openDeleteConfirm = (row) => {
    setDeletingRow(row);
    setActionError("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRow || deleting) return;

    try {
      setDeleting(true);
      setActionError("");

      const resp = await api.delete(
        `ready_to_manufacture_api/${deletingRow.ready_manufacture_id}/`
      );

      if (resp.data?.status !== true) {
        throw new Error(resp.data?.message || "Failed to cancel this entry.");
      }

      // Update the UI only after successful API response.
      setData((prev) =>
        prev.map((row) =>
          row.ready_manufacture_id === deletingRow.ready_manufacture_id
            ? { ...row, status: "Cancelled" }
            : row
        )
      );

      setIsDeleteOpen(false);
      setDeletingRow(null);
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to cancel this entry."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
          Ready to Manufacture
        </h2>

        <button
          onClick={openAddForm}
          disabled={loading || !!error}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Entry</span>
        </button>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search master, tailor, product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>

      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="break-words">{actionError}</p>
        </div>
      )}

      {error ? (
        <div
          role="alert"
          className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load Ready to Manufacture details
          </p>

          <p className="max-w-lg break-words text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading Ready to Manufacture details...
          </p>
        </div>
      ) : (
        <>
          <ReadyToManufactureTable
            rows={paginated}
            qualities={qualities}
            onEdit={openEditForm}
            onDelete={openDeleteConfirm}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <p className="text-xs text-slate-400">
              Showing {paginated.length} of {filtered.length} entries
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md border border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <ReadyToManufactureFormModal
            open={isFormOpen}
            initialData={editingRow}
            batches={batches}
            qualities={qualities}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
          />

          <DeleteConfirmModal
            open={isDeleteOpen}
            itemLabel={
              deletingRow
                ? `${deletingRow.final_product_name} - Batch #${
                    typeof deletingRow.batch_id === "object"
                      ? deletingRow.batch_id.batch_id
                      : deletingRow.batch_id
                  }`
                : ""
            }
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              if (deleting) return;
              setIsDeleteOpen(false);
              setDeletingRow(null);
              setActionError("");
            }}
          />
        </>
      )}
    </div>
  );
}