import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import DeliveredProductsTable from "../Tables/DeliveredProductsTable";
import DeliveredProductsFormModal from "../Models/DeliveredProductsFormModal";
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

const PAGE_SIZE = 5;

// Backend ke message / detail / error, teeno check karta hai.
const getErrorMessage = (err, fallback) => {
  const responseData = err.response?.data;

  if (typeof responseData?.message === "string") return responseData.message;
  if (typeof responseData?.detail === "string") return responseData.detail;
  if (typeof responseData?.error === "string") return responseData.error;
  if (responseData?.error) return JSON.stringify(responseData.error);

  return err.message || fallback;
};

export default function DeliveredProductsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("delivered_products_api/");

      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Failed to load delivered products."
          )
        );
      }

      const products = response.data?.data;

      if (Array.isArray(products)) {
        setData(products);
      } else if (
        response.data?.status === true &&
        (products === "No product is ready yet")
      ) {
        // Backend empty database response.
        setData([]);
      } else {
        throw new Error(
          response.data?.message ||
            "Invalid delivered products received from the server."
        );
      }
    } catch (err) {
      console.error(
        "Failed to fetch delivered products:",
        err.response?.data || err.message
      );
      setError(getErrorMessage(err, "Failed to load delivered products."));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!actionError) return undefined;

    const timer = setTimeout(() => setActionError(""), 4000);
    return () => clearTimeout(timer);
  }, [actionError]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();
    return data.filter(
      (row) =>
        String(row.final_product_name ?? "").toLowerCase().includes(q) ||
        String(row.delivery_boy_name ?? "").toLowerCase().includes(q) ||
        String(row.purchaser_name ?? "").toLowerCase().includes(q) ||
        String(row.delivery_status ?? "").toLowerCase().includes(q)
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

  const handleSave = async (formData) => {
    if (saving) return;

    try {
      setSaving(true);
      setActionError("");

      let response;

      if (editingRow) {
        response = await api.put(
          `delivered_products_api/${editingRow.delivery_id}/`,
          formData
        );
      } else {
        response = await api.post("delivered_products_api/", formData);
      }

      if (response.data?.status === false) {
        throw new Error(
          getErrorMessage(
            { response: { data: response.data } },
            "Failed to save delivered product."
          )
        );
      }

      // POST response does not include the created record; refetch both cases.
      await fetchData();
      setPage(1);
      setIsFormOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(
        "Failed to save delivered product:",
        err.response?.data || err.message
      );
      setActionError(getErrorMessage(err, "Failed to save delivered product."));
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (row) => {
    setDeletingRow(row);
    setActionError("");
    setIsDeleteOpen(true);
  };

  // Existing backend update_delivery_status endpoint sets status to Delivered.
  // Do not call it here as a cancel action; no cancel endpoint was provided.
  const handleDeleteConfirm = async () => {
  try {
    await api.delete(
      `delivered_products_api/${deletingRow.delivery_id}/`
    );

    setData((prev) =>
      prev.filter(
        (r) => r.delivery_id !== deletingRow.delivery_id
      )
    );

    setIsDeleteOpen(false);
    setDeletingRow(null);
  } catch (error) {
    console.error(
      "Error deleting delivered product:",
      error.response?.data || error.message
    );
  }
};

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
          Delivered Products
        </h2>
        <button
          type="button"
          onClick={openAddForm}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Mark Delivered</span>
        </button>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search product, purchaser, status..."
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

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading delivered products...
          </p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">
            Unable to load delivered products
          </p>
          <p className="max-w-lg break-words text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : (
        <>
          <DeliveredProductsTable
            rows={paginated}
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
        </>
      )}

      <DeliveredProductsFormModal
        open={isFormOpen}
        initialData={editingRow}
        onClose={() => {
          if (saving) return;
          setIsFormOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={
          deletingRow
            ? `${deletingRow.final_product_name} - #${deletingRow.delivery_id}`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (deleting) return;
          setIsDeleteOpen(false);
          setDeletingRow(null);
        }}
      />
    </div>
  );
}
