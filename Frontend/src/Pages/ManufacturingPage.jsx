import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {model_context} from '../Context/ApiContext'
import ManufacturingTable from "../Tables/ManufacturingTable";
import ManufacturingFormModal from "../Models/ManufacturingFormModal";
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

const PAGE_SIZE = 5;

// Backend ke message / detail / error, teeno check karta hai
const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;

  if (typeof data?.message === "string") return data.message;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.error === "string") return data.error;
  if (data?.error) return JSON.stringify(data.error);

  return err.message || fallback;
};

export default function ManufacturingPage() {
  const {role,setrole}=useContext(model_context)
  const [data, setData] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const [loading, setLoading] = useState(true);
  const [qualitiesLoading, setQualitiesLoading] = useState(true);

  const [error, setError] = useState("");
  const [qualitiesError, setQualitiesError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("manufacturing_api/");

      if (response.data?.status === false) {
        throw new Error(
          response.data?.message || "Failed to load manufacturing records."
        );
      }

      if (Array.isArray(response.data?.data)) {
        setData(response.data.data);
      } else if (
        response.data?.status === true &&
        response.data?.message === "oops! No product is Manufactured yet"
      ) {
        setData([]);
      } else {
        throw new Error(
          response.data?.message ||
            "Invalid manufacturing records received from the server."
        );
      }
    } catch (err) {
      console.error(
        "Failed to fetch manufacturing records:",
        err.response?.data || err.message
      );

      setError(getErrorMessage(err, "Failed to load manufacturing records."));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);
  

  const fetchQualities = useCallback(async () => {
    try {
      setQualitiesLoading(true);
      setQualitiesError("");

      const response = await api.get("fabric_quality_api/");

      if (response.data?.status === false) {
        throw new Error(
          response.data?.message ||
            (response.data?.error
              ? JSON.stringify(response.data.error)
              : "Failed to load fabric qualities.")
        );
      }

      if (!Array.isArray(response.data?.data)) {
        throw new Error("Invalid fabric qualities received from the server.");
      }

      setQualities(response.data.data);
    } catch (err) {
      console.error(
        "Failed to fetch fabric qualities:",
        err.response?.data || err.message
      );

      setQualitiesError(getErrorMessage(err, "Failed to load fabric qualities."));
      setQualities([]);
    } finally {
      setQualitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchQualities();
  }, [fetchData, fetchQualities]);
useEffect(() => {
  if (!actionError) return;

  const timer = setTimeout(() => setActionError(""), 4000);

  // Naya error aaye ya component hat jaye to purana timer cancel
  return () => clearTimeout(timer);
}, [actionError]);
  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();

    return data.filter(
      (row) =>
        String(row.master_name ?? "").toLowerCase().includes(q) ||
        String(row.tailor_name ?? "").toLowerCase().includes(q) ||
        String(row.receiver_name ?? "").toLowerCase().includes(q) ||
        String(row.final_product_name ?? "").toLowerCase().includes(q)
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

  // Save ke baad server se dobara load, taake time, percentages, status sahi aayein
  const handleSave = () => {
    fetchData();
    setPage(1);
    setIsFormOpen(false);
    setEditingRow(null);
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

      const res = await api.delete(
        `manufacturing_api/${deletingRow.manufactured_id}/`
      );

      if (res.data?.status === false) {
        throw new Error(res.data?.message || "Failed to cancel this entry.");
      }

      await fetchData();
    } catch (err) {
      console.error(
        "Failed to cancel manufacturing record:",
        err.response?.data || err.message
      );
      setActionError(getErrorMessage(err, "Failed to cancel this entry."));
    } finally {
      setDeleting(false);
      // Success ho ya error, modal band. Error banner page par dikhega.
      setIsDeleteOpen(false);
      setDeletingRow(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
          Manufacturing
        </h2>

        {role=='admin'&&<button
          onClick={openAddForm}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Entry</span>
        </button>}
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

      {/* Action (delete/cancel) error banner */}
      {actionError && (
        <div
          role="alert"
          className="flex items-start gap-2 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="break-words">{actionError}</p>
        </div>
      )}

      {/* Fabric qualities error */}
      {qualitiesError && !error && (
        <div className="mb-4 flex flex-col items-start gap-2 rounded-xl border border-red-100 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-red-500">
            <AlertCircle size={18} />
            Unable to load fabric qualities
          </div>

          <p className="text-sm text-slate-500 break-words">
            {qualitiesError}
          </p>

          <button
            type="button"
            onClick={fetchQualities}
            disabled={qualitiesLoading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {/* Manufacturing records */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading manufacturing records...
          </p>
        </div>
      ) : error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load manufacturing records
          </p>

          <p className="max-w-lg break-words text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              fetchData();
              fetchQualities();
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : (
        <>
          <ManufacturingTable
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
        </>
      )}

      <ManufacturingFormModal
        open={isFormOpen}
        initialData={editingRow}
        qualities={qualities}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={
          deletingRow
            ? `${deletingRow.final_product_name} - Batch #${deletingRow.batch_id}`
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