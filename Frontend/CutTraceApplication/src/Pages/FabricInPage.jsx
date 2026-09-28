import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import FabricInTable from "../components/FabricInTable";
import FabricInFormModal from '../Models/FabricInFormModal'
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";

const dummyData = [
  { fabric_in_id: 1, supplier_name: "Al-Karam Textiles", receiver_name: "Ahmed", quantity_kg: 500, fabric_quality: "Grade A", color: "Navy Blue", price_per_kg: 350, total_cost: 175000, received_at: "2024-12-01", notes: "" },
  { fabric_in_id: 2, supplier_name: "City Fabrics", receiver_name: "Bilal", quantity_kg: 320, fabric_quality: "Grade B", color: "White", price_per_kg: 280, total_cost: 89600, received_at: "2024-12-02", notes: "" },
  { fabric_in_id: 3, supplier_name: "Zain Traders", receiver_name: "Ahmed", quantity_kg: 210, fabric_quality: "Grade A", color: "Black", price_per_kg: 340, total_cost: 71400, received_at: "2024-12-03", notes: "" },
  { fabric_in_id: 4, supplier_name: "Noor Textile Mills", receiver_name: "Sara", quantity_kg: 150, fabric_quality: "Grade C", color: "Beige", price_per_kg: 220, total_cost: 33000, received_at: "2024-12-04", notes: "" },
  { fabric_in_id: 5, supplier_name: "Al-Karam Textiles", receiver_name: "Bilal", quantity_kg: 400, fabric_quality: "Grade B", color: "Grey", price_per_kg: 275, total_cost: 110000, received_at: "2024-12-05", notes: "" },
];

const PAGE_SIZE = 5;

export default function FabricInPage() {
  const [data, setData] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/api/production/fabric-in/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (row) =>
        row.supplier_name.toLowerCase().includes(q) ||
        row.receiver_name.toLowerCase().includes(q) ||
        row.fabric_quality.toLowerCase().includes(q) ||
        row.color.toLowerCase().includes(q)
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

  const handleSave = (formData) => {
    if (editingRow) {
      setData((prev) =>
        prev.map((r) => (r.fabric_in_id === editingRow.fabric_in_id ? { ...r, ...formData } : r))
      );
    } else {
      const newRow = {
        ...formData,
        fabric_in_id: Math.max(0, ...data.map((r) => r.fabric_in_id)) + 1,
        received_at: new Date().toISOString().slice(0, 10),
      };
      setData((prev) => [newRow, ...prev]);
    }
    setIsFormOpen(false);
  };

  const openDeleteConfirm = (row) => {
    setDeletingRow(row);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: API CALL HERE
    // fetch(`/api/production/fabric-in/${deletingRow.fabric_in_id}/`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(() => { ...remove from state... });

    setData((prev) => prev.filter((r) => r.fabric_in_id !== deletingRow.fabric_in_id));
    setIsDeleteOpen(false);
    setDeletingRow(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-4 my-6 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-full min-h-screen">
      <Navbar />

      <div className="flex items-center justify-between mb-5 mt-6">
        <h2 className="text-xl font-semibold text-slate-800">Fabric In</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} /> Add Fabric
        </button>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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

      <FabricInTable rows={paginated} onEdit={openEditForm} onDelete={openDeleteConfirm} />

      <div className="flex items-center justify-between mt-4">
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

      <FabricInFormModal
        open={isFormOpen}
        initialData={editingRow}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={deletingRow ? `${deletingRow.supplier_name} - ${deletingRow.quantity_kg}kg` : ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}