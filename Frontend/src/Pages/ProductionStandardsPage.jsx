import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import {AlertCircle,RefreshCw, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import ProductionStandardsTable from "../Tables/ProductionStandardsTable";
import ProductionStandardsFormModal from '../Models/ProductionStandardsFormModal'
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";
import { model_context } from "../Context/ApiContext";

const dummyData = [
    {
    standard_id: 1,
    fabric_quality: "Polyester",
    final_product_name: "Trouser",
    standard_total_weight: 2.5,
    standard_final_product_quantity: 2,
    standard_wastage_quantity: 0.4,
    created_at: "2024-11-01",
    updated_at: null,
  },
  {
    standard_id: 2,
    fabric_quality: "Cotton",
    final_product_name: "Jacket",
    standard_total_weight: 1.8,
    standard_final_product_quantity: 1,
    standard_wastage_quantity: 0.3,
    created_at: "2024-11-02",
    updated_at: null,
  },
  {
    standard_id: 3,
    fabric_quality: "Polyester-Cotton",
    final_product_name: "Hoodie",
    standard_total_weight: 1.2,
    standard_final_product_quantity: 1,
    standard_wastage_quantity: 0.2,
    created_at: "2024-11-03",
    updated_at: null,
  },
];

const PAGE_SIZE = 5;

export default function ProductionStandardsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, seterror] = useState("")
  const [loading, setloading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const {role,setrole}=useContext(model_context)

  const [qualities, setQualities] = useState([]);

useEffect(() => {

  const fetch_qualities=async()=>{
    try {
      setloading(true)
      const resp=await api.get("/fabric_quality_api/")
      
    if (!resp?.data?.status) {
      throw new Error(
        "couldn't fetch the fabric qualites"|| resp?.data?.message
      )
    }
    if (!Array.isArray(resp.data?.data)) {
        throw new Error(
  resp?.data?.message || "couldn't fetch the fabric qualities"
)
      }    
    setQualities(resp.data.data)
    } catch (error) {
      console.error(
          "Failed to fetch production stadards:",
          error.message
        )
        seterror(error.response?.data?.message ||
    error.response?.data?.detail ||
    (error.response?.data?.error
      ? JSON.stringify(error.response.data.error)
      : null) ||
    error.message ||
    "Failed to Load production batches.")
    }finally{
      setloading(false)
    }
  }
  fetch_qualities()
}, []);
   const fetch_data=useCallback(async()=>{
      try {
        setloading(true)
        seterror("")
        const resp=await api.get("/production_standards_api/")
        console.log(resp.data.data) 
        if (!resp?.data.status) {
          throw new Error(
            resp?.data?.message||"Failed to Load the Standards"
          )
        }

        if (!Array.isArray(resp.data?.data)) {
        throw new Error("Invalid production Standards received from the server.");
      }
        setData(resp?.data.data)
      
      } catch (error) {
        console.error(
          "Failed to fetch production stadards:",
          error.message
        )
        seterror(error.response?.data?.message ||
    error.response?.data?.detail ||
    (error.response?.data?.error
      ? JSON.stringify(error.response.data.error)
      : null) ||
    error.message ||
    "Failed to Load production batches.")
      }finally{
         setloading(false);
      }

    },[])
  useEffect(()=>{
    fetch_data();
  },[fetch_data])
  

  // Sirf actual string field par search (final_product_name)
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
  (row.final_product_name ?? "").toLowerCase().includes(q)
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

  const handleSave = async (formData) => {
  try {
    seterror("");

    let resp;

    if (editingRow) {
      resp = await api.put(
        `/production_standards_api/${editingRow.standard_id}/`,
        formData
      );
    } else {
      resp = await api.post(
        "/production_standards_api/",
        formData
      );
    }

    if (!resp?.data?.status) {
      throw new Error(
        resp?.data?.message ||
          `Failed to ${editingRow ? "update" : "create"} the standard.`
      );
    }

    if (editingRow) {
      setData((prev) =>
        prev.map((row) =>
          row.standard_id === editingRow.standard_id
            ? { ...row, ...(resp.data.data || formData) }
            : row
        )
      );
    } else {
      const newRow = resp.data.data;

      setData((prev) => [newRow, ...prev]);
    }

    setIsFormOpen(false);
    setEditingRow(null);
  } catch (error) {
    console.error("Failed to save production standard:", error.response?.data || error.message);

    seterror(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        (error.response?.data?.error
          ? JSON.stringify(error.response.data.error)
          : null) ||
        error.message ||
        "Failed to save production standard."
    );
  }
};

  const openDeleteConfirm = (row) => {
    setDeletingRow(row);
    setIsDeleteOpen(true);
  };

  
  const handleDeleteConfirm = async () => {
  try {
    seterror("");

    const resp = await api.delete(
      `/production_standards_api/${deletingRow.standard_id}/`
    );

    if (resp?.data?.status === false) {
      throw new Error(
        resp?.data?.message || "Failed to delete the standard."
      );
    }

    setData((prev) =>
      prev.filter((r) => r.standard_id !== deletingRow.standard_id)
    );

    setIsDeleteOpen(false);
    setDeletingRow(null);
  } catch (error) {
    console.error(
      "Failed to delete production standard:",
      error.response?.data || error.message
    );

    seterror(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        (error.response?.data?.error
          ? JSON.stringify(error.response.data.error)
          : null) ||
        error.message ||
        "Failed to delete production standard."
    );
  }
};

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">Production Standards</h2>
        {role=='admin'&&<button
          onClick={openAddForm}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Standard</span>
        </button>}
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search product name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>
      {error ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-medium text-red-500">
            Unable to load or process production standards
          </p>

          <p className="max-w-lg break-words text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetch_data}
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
            Loading production standards...
          </p>
        </div>
      ) : (
        <>
          <ProductionStandardsTable
            rows={paginated}
            onEdit={openEditForm}
            onDelete={openDeleteConfirm}
            qualities={qualities}
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
      

      

      <ProductionStandardsFormModal
        open={isFormOpen}
        initialData={editingRow}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        qualities={qualities}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={deletingRow ? `${deletingRow.final_product_name} - Standard #${deletingRow.standard_id}` : ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
