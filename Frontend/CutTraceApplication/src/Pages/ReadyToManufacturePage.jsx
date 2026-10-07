import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import ReadyToManufactureTable from "../Tables/ReadyToManufactureTable";
import ReadyToManufactureFormModal from '../Models/ReadyToManufactureFormModal'
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";

const dummyData = [
{ ready_manufacture_id: 1, batch_id: 1, master_name: "Usman", tailor_name: "Kamran", delivery_boy_name: "Hamza", final_product_name: "Polyester Hoodie", fabric_quantity_kg: 120, fabric_quality: 1, color: "Navy Blue", assigned_at: "2024-12-01", status: "pending", notes: "Urgent order" },

{ ready_manufacture_id: 2, batch_id: 2, master_name: "Usman", tailor_name: "Adnan", delivery_boy_name: "Hamza", final_product_name: "Denim Trouser", fabric_quantity_kg: 80, fabric_quality: 2, color: "White", assigned_at: "2024-12-02", status: "pending", notes: "-" },

{ ready_manufacture_id: 3, batch_id: 3, master_name: "Farhan", tailor_name: "Kamran", delivery_boy_name: "Ali", final_product_name: "Cotton Jacket", fabric_quantity_kg: 60, fabric_quality: 1, color: "Black", assigned_at: "2024-12-03", status: "Cancelled", notes: "Cancelled by admin" },

{ ready_manufacture_id: 4, batch_id: 4, master_name: "Farhan", tailor_name: "Adnan", delivery_boy_name: "Ali", final_product_name: "Polyester Hoodie", fabric_quantity_kg: 45, fabric_quality: 3, color: "Beige", assigned_at: "2024-12-04", status: "pending", notes: "-" },];

// Dropdown ka dummy data (baad me API se aayega)
const dummyBatches = [{ batch_id: 1 }, { batch_id: 2 }, { batch_id: 3 }, { batch_id: 4 }, { batch_id: 5 }];
const dummyQualities = [
  { quality_id: 1, name: "Grade A" },
  { quality_id: 2, name: "Grade B" },
  { quality_id: 3, name: "Grade C" },
];

const PAGE_SIZE = 5;

export default function ReadyToManufacturePage() {
  const [data, setData] = useState(dummyData);
  const [batches, setBatches] = useState(dummyBatches);
  const [qualities, setQualities] = useState(dummyQualities);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/ready_to_manufacture_api/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });

    // TODO: API CALL HERE (batches dropdown)
    // fetch("/product_batches_api/", { headers: { Authorization: `Bearer ${token}` } })
    //   .then((res) => res.json())
    //   .then((res) => { if (res.status) setBatches(res.data); });

    // TODO: API CALL HERE (fabric quality dropdown)
    // fetch("/fabric_quality_api/", { headers: { Authorization: `Bearer ${token}` } })
    //   .then((res) => res.json())
    //   .then((res) => { if (res.status) setQualities(res.data); });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (row) =>
        row.master_name.toLowerCase().includes(q) ||
        row.tailor_name.toLowerCase().includes(q) ||
        row.delivery_boy_name.toLowerCase().includes(q) ||
        row.final_product_name.toLowerCase().includes(q) ||
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
        prev.map((r) =>
          r.ready_manufacture_id === editingRow.ready_manufacture_id ? { ...r, ...formData } : r
        )
      );
    } else {
      const newRow = {
        ...formData,
        ready_manufacture_id: Math.max(0, ...data.map((r) => r.ready_manufacture_id)) + 1,
        assigned_at: new Date().toISOString().slice(0, 10),
      };
      setData((prev) => [newRow, ...prev]);
    }
    setIsFormOpen(false);
  };

  const openDeleteConfirm = (row) => {
    setDeletingRow(row);
    setIsDeleteOpen(true);
  };

  // Backend me delete nahi hota, status "Cancelled" ho jata hai
  const handleDeleteConfirm = () => {
    // TODO: API CALL HERE
    // fetch(`/ready_to_manufacture_api/${deletingRow.ready_manufacture_id}/`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(() => { ...status Cancelled karo... });

    setData((prev) =>
      prev.map((r) =>
        r.ready_manufacture_id === deletingRow.ready_manufacture_id ? { ...r, status: "Cancelled" } : r
      )
    );
    setIsDeleteOpen(false);
    setDeletingRow(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">Ready to Manufacture</h2>
        <button
          onClick={openAddForm}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Entry</span>
        </button>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
        itemLabel={deletingRow ? `${deletingRow.final_product_name} - Batch #${deletingRow.batch_id}` : ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
