import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import BatchesFormModal from "../Models/BatchesFormModal";
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import BatchesTable from "../Tables/BatchesTable";
import { api } from "../services/auth";

const PAGE_SIZE = 5;

const ProductionBatchesPage = () => {
  const [OpenAddbutton, setOpenAddbutton] = useState(false);
  const [data, setdata] = useState([]);
  const [search, setsearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingrow, seteditingrow] = useState(null);
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingrow, setdeletingrow] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const resp = await api.get("product_batches_api/");
      
      
      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message || "Failed to load production batches."
        );
      }

      if (!Array.isArray(resp.data?.data)) {
        throw new Error("Invalid production batches received from the server.");
      }

      setdata(resp.data.data);
    } catch (err) {
      console.error(
        "Failed to fetch production batches:",
        err.response?.data || err.message
      );
      setError(
  err.response?.data?.message ||
    err.response?.data?.detail ||
    (err.response?.data?.error
      ? JSON.stringify(err.response.data.error)
      : null) ||
    err.message ||
    "Failed to Load production batches."
);
      

      setdata([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enableaddbutton = () => {
    setError("");
    seteditingrow(null);
    setOpenAddbutton(true);
  };

  const openEditFrom = (row) => {
    setError("");
    seteditingrow(row);
    setOpenAddbutton(true);
  };

  const savehandler = (formData) => {
    if (editingrow) {
      setdata((prev) =>
        prev.map((r) =>
          r.batch_id === editingrow.batch_id ? { ...r, ...formData } : r
        )
      );
    } else {
      const newRow = {
        ...formData,
        batch_id: Math.max(0, ...data.map((r) => r.batch_id)) + 1,
        created_at: new Date().toISOString().slice(0, 10),
        updated_at: null,
      };

      setdata((prev) => [newRow, ...prev]);
      setPage(1);
    }

    setOpenAddbutton(false);
    seteditingrow(null);
  };

  const openDeleteConfirm = (row) => {
    setError("");
    setdeletingrow(row);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingrow) return;

    try {
      setError("");

      const resp = await api.delete(
        `product_batches_api/${deletingrow.batch_id}/`
      );

      if (resp.data?.status === false) {
        throw new Error(
          resp.data?.message || "Failed to delete production batch."
        );
      }

      setdata((prev) =>
        prev.filter((r) => r.batch_id !== deletingrow.batch_id)
      );
    } catch (err) {
      console.error(
        "Failed to delete production batch:",
        err.response?.data || err.message
      );

      setError(
  err.response?.data?.message ||
    err.response?.data?.detail ||
    (err.response?.data?.error
      ? JSON.stringify(err.response.data.error)
      : null) ||
    err.message ||
    "Failed to Delete production batches."
);
    } finally {
      setIsDeleteOpen(false);
      setdeletingrow(null);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();

    return data.filter(
      (row) =>
        String(row.current_stage ?? "").toLowerCase().includes(q) ||
        String(row.current_status ?? "").toLowerCase().includes(q) ||
        String(row.batch_id ?? "").includes(q) ||
        row.fabric_in_ids?.some((f) =>
            String(f.fabric_in_id ?? f).toLowerCase().includes(q 
            ))
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const Paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-4 my-6 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-start justify-between gap-3 mb-5 mt-6">
        <h1 className="text-xl font-semibold text-slate-800 max-w-[45%] sm:max-w-none">
          Production Batches
        </h1>

        <button
          onClick={enableaddbutton}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 whitespace-nowrap shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Production Batch</span>
          <span className="sm:hidden">Add Batch</span>
        </button>
      </div>

      <div className="relative mb-4 w-full max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search by Batch Id, Current status etc.."
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
          value={search}
          onChange={(e) => {
            setsearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Error State */}
      {Error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load or process production batches
          </p>

          <p className="max-w-lg break-words text-sm text-slate-500">
            {Error}
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
            Loading production batches...
          </p>
        </div>
      ) : (
        <>
          <BatchesTable
            rows={Paginated}
            onedit={openEditFrom}
            onDelete={openDeleteConfirm}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <p className="text-xs text-slate-400">
              Showing {Paginated.length} of {filtered.length} entries
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

      <BatchesFormModal
        isopen={OpenAddbutton}
        onclose={() => setOpenAddbutton(false)}
        initialdata={editingrow}
        onsave={savehandler}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={deletingrow ? `Batch #${deletingrow.batch_id}` : ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setdeletingrow(null);
        }}
      />
    </div>
  );
};

export default ProductionBatchesPage;

