
import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import FabricInTable from "../Tables/FabricInTable";
import FabricInFormModal from "../Models/FabricInFormModal";
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";
import { model_context } from "../Context/ApiContext";
const PAGE_SIZE = 5;

export default function FabricInPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const { role, setrole } = useContext(model_context)
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const resp = await api.get("fabric_in_api/");
      
      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message || "Failed to load fabric entries."
        );
      }

      if (!Array.isArray(resp.data?.data)) {
        throw new Error("Invalid fabric entries received from the server.");
      }

      setData(resp.data.data);
    } catch (err) {
      console.error(
        "Failed to fetch fabric in:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to load fabric entries."
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();

    return data.filter(
      (row) =>
        (row.supplier_name || "").toLowerCase().includes(q) ||
        (row.receiver_name || "").toLowerCase().includes(q) ||
        (row.fabric_quality || "").toLowerCase().includes(q) ||
        (row.color || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAddForm = () => {
    setEditingRow(null);
    setIsFormOpen(true);
  };

  const openEditForm = (row) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

 const handleSave = async () => {
  await fetchData();
  setPage(1);
  setIsFormOpen(false);
};

  const openDeleteConfirm = (row) => {
    setError("");
    setDeletingRow(row);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRow) return;

    try {
      setError("");

      const resp = await api.delete(
        `fabric_in_api/${deletingRow.fabric_in_id}/`
      );

      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message || "Failed to delete fabric entry."
        );
      }

      setData((prev) =>
        prev.filter((r) => r.fabric_in_id !== deletingRow.fabric_in_id)
      );
    } catch (err) {
      console.error(
        "Failed to delete fabric in:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to delete fabric entry."
      );
    } finally {
      setIsDeleteOpen(false);
      setDeletingRow(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
          Fabric In
        </h2>

        {role=='admin' && <button
          onClick={openAddForm}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Fabric</span>
        </button>}
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search supplier, receiver, quality..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Error State */}
      {error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load or process fabric entries
          </p>

          <p className="max-w-lg break-words text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      ) : loading ? (
        /* Loading State */
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading fabric entries...
          </p>
        </div>
      ) : (
        <>
          <FabricInTable
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

      <FabricInFormModal
        open={isFormOpen}
        initialData={editingRow}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={
          deletingRow
            ? `${deletingRow.supplier_name} - ${deletingRow.quantity_kg}kg`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingRow(null);
        }}
      />
    </div>
  );
}