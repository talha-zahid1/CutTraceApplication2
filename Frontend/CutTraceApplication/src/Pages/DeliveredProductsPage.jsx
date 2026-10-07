import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import DeliveredProductsTable from "../Tables/DeliveredProductsTable";
import DeliveredProductsFormModal from '../Models/DeliveredProductsFormModal'
import DeleteConfirmModal from "../Models/DeleteConfirmModal";
import Navbar from "../components/Navbar";

const dummyData = [
  { delivery_id: 1, batch_id: 1, ready_to_deliver_id: 1, quantity: 40, final_product_name: "Trouser", fabric_quality: "Polyster Cotton", delivery_boy_name: "Hamza", purchaser_name: "Ali Traders", total_sale_price: 60000, price_per_item: 1500, original_cost: 42000, other_expenses: 2000, total_cost: 44000, net_profit: 16000, delivery_status: "Delivered", delivered_at: "2024-12-05", notes: "-" },
  { delivery_id: 2, batch_id: 2, ready_to_deliver_id: 2, quantity: 25, final_product_name: "Hoddie", fabric_quality: "Cotton", delivery_boy_name: "Ali", purchaser_name: "City Mart", total_sale_price: 30000, price_per_item: 1200, original_cost: 21000, other_expenses: 1000, total_cost: 22000, net_profit: 8000, delivery_status: "Delivered", delivered_at: "2024-12-06", notes: "-" },
];

const PAGE_SIZE = 5;

export default function DeliveredProductsPage() {
  const [data, setData] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/delivered_products_api/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });
  }, []);

  // Sirf actual string fields par search (final_product_name, delivery_boy_name, purchaser_name, delivery_status)
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (row) =>
        row.final_product_name.toLowerCase().includes(q) ||
        row.delivery_boy_name.toLowerCase().includes(q) ||
        row.purchaser_name.toLowerCase().includes(q) ||
        row.delivery_status.toLowerCase().includes(q)
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
      // TODO: API CALL HERE (PUT — backend abhi implement nahi, aap set karenge)
      // fetch(`/delivered_products_api/${editingRow.delivery_id}/`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify(formData),
      // }).then((res) => res.json()).then((res) => { if (res.status) { ...update state... } });

      setData((prev) =>
        prev.map((r) => (r.delivery_id === editingRow.delivery_id ? { ...r, ...formData } : r))
      );
    } else {
      // TODO: API CALL HERE (POST)
      // fetch("/delivered_products_api/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify(formData),
      // }).then((res) => res.json()).then((res) => { if (res.status) { ...add to state... } });

      // POST: backend khud ready_to_deliver record se batch_id, quantity,
      // final_product_name, fabric_quality nikal leta hai (yahan dummy placeholder)
      const newRow = {
        ...formData,
        delivery_id: Math.max(0, ...data.map((r) => r.delivery_id)) + 1,
        batch_id: null, // TODO: backend response se aayega
        quantity: null, // TODO: backend response se aayega
        final_product_name: "-", // TODO: backend response se aayega
        fabric_quality: null, // TODO: backend response se aayega
        delivery_status: "Delivered",
        delivered_at: new Date().toISOString().slice(0, 10),
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
    // TODO: API CALL HERE (DELETE — backend abhi implement nahi, aap set karenge)
    // fetch(`/delivered_products_api/${deletingRow.delivery_id}/`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${token}` },
    // }).then(() => { ...status Cancelled karo... });

    setData((prev) =>
      prev.map((r) =>
        r.delivery_id === deletingRow.delivery_id ? { ...r, delivery_status: "Cancelled" } : r
      )
    );
    setIsDeleteOpen(false);
    setDeletingRow(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">Delivered Products</h2>
        <button
          onClick={openAddForm}
          className="flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Mark Delivered</span>
        </button>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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

      <DeliveredProductsTable rows={paginated} onEdit={openEditForm} onDelete={openDeleteConfirm} />

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

      <DeliveredProductsFormModal
        open={isFormOpen}
        initialData={editingRow}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        itemLabel={deletingRow ? `${deletingRow.final_product_name} - #${deletingRow.delivery_id}` : ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
