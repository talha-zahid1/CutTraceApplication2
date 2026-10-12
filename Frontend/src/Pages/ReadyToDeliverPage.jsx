import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import ReadyToDeliverTable from "../Tables/ReadyToDeliverTable";
import ReadyToDeliverNotesModal from "../Models/ReadyToDeliverNotesModal";
import Navbar from "../components/Navbar";

// No "Add" button/flow here — ready_to_deliver_view has no POST.
// These entries are created automatically by testing_view when a
// manufactured product passes testing.

const dummyData = [
  { ready_to_deliver_id: 1, manufactured_id: 2, batch_id: 2, final_product_name: "Denim Trouser", quantity: 60, fabric_quality: 2, final_product_percentage: 94, wastage_kg: 5, wastage_percentage: 6.2, prepared_at: "2024-12-06", status: "Ready", notes: "" },
  { ready_to_deliver_id: 2, manufactured_id: 4, batch_id: 4, final_product_name: "Polyester Hoodie", quantity: 35, fabric_quality: 3, final_product_percentage: 91, wastage_kg: 3, wastage_percentage: 6.6, prepared_at: "2024-12-07", status: "Ready", notes: "Priority order" },
  { ready_to_deliver_id: 3, manufactured_id: 1, batch_id: 1, final_product_name: "Cotton Shirt", quantity: 95, fabric_quality: 1, final_product_percentage: 92, wastage_kg: 8, wastage_percentage: 6.6, prepared_at: "2024-12-05", status: "delivered", notes: "Delivered to Al-Karam Traders" },
];

const dummyQualities = [
  { quality_id: 1, name: "Grade A" },
  { quality_id: 2, name: "Grade B" },
  { quality_id: 3, name: "Grade C" },
];

const PAGE_SIZE = 5;

export default function ReadyToDeliverPage() {
  const [data, setData] = useState(dummyData);
  const [qualities, setQualities] = useState(dummyQualities);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/ready_to_deliver_api/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   });

    // TODO: API CALL HERE (fabric quality lookup, for showing names instead of ids)
    // fetch("/fabric_quality_api/", { headers: { Authorization: `Bearer ${token}` } })
    //   .then((res) => res.json())
    //   .then((res) => { if (res.status) setQualities(res.data); });
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (row) =>
        row.final_product_name.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        String(row.batch_id).includes(q) ||
        String(row.ready_to_deliver_id).includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEditModal = (row) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const handleSave = (payload) => {
    setData((prev) =>
      prev.map((r) =>
        r.ready_to_deliver_id === editingRow.ready_to_deliver_id ? { ...r, ...payload } : r
      )
    );
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
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">Ready to Deliver</h2>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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

      <ReadyToDeliverTable rows={paginated} qualities={qualities} onEdit={openEditModal} />

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

      <ReadyToDeliverNotesModal
        open={isModalOpen}
        data={editingRow}
        qualityName={editingRow ? getQualityName(editingRow.fabric_quality) : ""}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
