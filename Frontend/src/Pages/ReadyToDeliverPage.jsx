import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import ReadyToDeliverTable from "../Tables/ReadyToDeliverTable";
import ReadyToDeliverNotesModal from "../Models/ReadyToDeliverNotesModal";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

// No "Add" button/flow here — ready_to_deliver_view has no POST.
// These entries are created automatically by testing_view when a
// manufactured product passes testing.

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

export default function ReadyToDeliverPage() {
  const [data, setData] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [qualitiesLoading, setQualitiesLoading] = useState(true);

  const [error, setError] = useState("");
  const [qualitiesError, setQualitiesError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const resp = await api.get("ready_to_deliver_api/");

      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message ||
            (resp.data?.error
              ? JSON.stringify(resp.data.error)
              : "Failed to load ready to deliver records.")
        );
      }

      if (Array.isArray(resp.data?.data)) {
        setData(resp.data.data);
      } else if (resp.data?.status === true) {
        // Success hai lekin koi record nahi
        setData([]);
      } else {
        throw new Error(
          resp.data?.message ||
            "Invalid ready to deliver records received from the server."
        );
      }
    } catch (err) {
      console.error(
        "Failed to fetch ready to deliver records:",
        err.response?.data || err.message
      );

      setError(
        getErrorMessage(err, "Failed to load ready to deliver records.")
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQualities = useCallback(async () => {
    try {
      setQualitiesLoading(true);
      setQualitiesError("");

      const resp = await api.get("fabric_quality_api/");

      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message ||
            (resp.data?.error
              ? JSON.stringify(resp.data.error)
              : "Failed to load fabric qualities.")
        );
      }

      if (!Array.isArray(resp.data?.data)) {
        throw new Error("Invalid fabric qualities received from the server.");
      }

      setQualities(resp.data.data);
    } catch (err) {
      console.error(
        "Failed to fetch fabric qualities:",
        err.response?.data || err.message
      );

      setQualitiesError(
        getErrorMessage(err, "Failed to load fabric qualities.")
      );
      setQualities([]);
    } finally {
      setQualitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchQualities();
  }, [fetchData, fetchQualities]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();

    return data.filter(
      (row) =>
        String(row.final_product_name ?? "").toLowerCase().includes(q) ||
        String(row.status ?? "").toLowerCase().includes(q) ||
        String(row.batch_id ?? "").includes(q) ||
        String(row.ready_to_deliver_id ?? "").includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEditModal = (row) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  // Save ke baad server se dobara load, taake data hamesha sahi rahe
  const handleSave = () => {
    fetchData();
    setIsModalOpen(false);
    setEditingRow(null);
  };

  const getQualityName = (id) => {
    const found = qualities.find((q) => String(q.quality_id) === String(id));
    return found ? found.name : "-";
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
          Ready to Deliver
        </h2>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search product, status, batch..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Fabric qualities error (sirf tab jab main error na ho) */}
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

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading ready to deliver records...
          </p>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load ready to deliver records
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
          <ReadyToDeliverTable
            rows={paginated}
            qualities={qualities}
            onEdit={openEditModal}
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

      <ReadyToDeliverNotesModal
        open={isModalOpen}
        data={editingRow}
        qualityName={editingRow ? getQualityName(editingRow.fabric_quality) : ""}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}