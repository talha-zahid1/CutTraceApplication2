import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuspiciousProductsTable from "../Tables/SuspiciousProductsTable";
import SuspiciousInvestigationModal from "../Models/SuspiciousInvestigationModal";
import Navbar from "../components/Navbar";

// No "Add" button/flow on this page — suspicious_view has no POST.
// These entries are created automatically by testing_view when a
// manufactured product falls outside the expected standard.

const dummyData = [
  { suspicious_id: 1, batch_id: 3, manufactured_id: 3, fabric_quality: 1, original_quantity_kg: 60, actual_wastage_kg: 12, actual_wastage_percentage: 20, expected_wastage_kg: 7.2, expected_wastage_percentage: 12, actual_final_product_quantity: 30, expected_final_product_quantity: 45, final_product_percentage: 70, mismatched_wastage_percentage: 66.7, mismatched_final_product_percentage: 33.3, reason: "Actual output outside acceptable range of expected standard", detected_at: "2024-12-06", investigation_status: "Pending", remarks: "" },
  { suspicious_id: 2, batch_id: 5, manufactured_id: 5, fabric_quality: 2, original_quantity_kg: 90, actual_wastage_kg: 14, actual_wastage_percentage: 15.5, expected_wastage_kg: 9, expected_wastage_percentage: 10, actual_final_product_quantity: 55, expected_final_product_quantity: 62, final_product_percentage: 88.7, mismatched_wastage_percentage: 55, mismatched_final_product_percentage: 11.3, reason: "Wastage exceeded tolerance", detected_at: "2024-12-07", investigation_status: "Investigating", remarks: "Checking machine calibration" },
  { suspicious_id: 3, batch_id: 2, manufactured_id: 2, fabric_quality: 1, original_quantity_kg: 80, actual_wastage_kg: 6, actual_wastage_percentage: 7.5, expected_wastage_kg: 8, expected_wastage_percentage: 10, actual_final_product_quantity: 60, expected_final_product_quantity: 58, final_product_percentage: 103.4, mismatched_wastage_percentage: 25, mismatched_final_product_percentage: 3.4, reason: "Output higher than expected — verifying measurement", detected_at: "2024-12-05", investigation_status: "Resolved", remarks: "Confirmed measurement error, corrected in system" },
  { suspicious_id: 4, batch_id: 4, manufactured_id: 4, fabric_quality: 3, original_quantity_kg: 45, actual_wastage_kg: 3, actual_wastage_percentage: 6.6, expected_wastage_kg: 4.5, expected_wastage_percentage: 10, actual_final_product_quantity: 35, expected_final_product_quantity: 33, final_product_percentage: 106, mismatched_wastage_percentage: 34, mismatched_final_product_percentage: 6, reason: "Minor deviation flagged for review", detected_at: "2024-12-07", investigation_status: "Confirmed", remarks: "Genuine defect, fabric batch quarantined" },
];

const PAGE_SIZE = 5;

export default function SuspiciousProductsPage() {
  const [data, setData] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/suspicious_products_api/", {
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
        row.investigation_status.toLowerCase().includes(q) ||
        row.reason.toLowerCase().includes(q) ||
        row.remarks.toLowerCase().includes(q) ||
        String(row.batch_id).includes(q) ||
        String(row.suspicious_id).includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEditModal = (row) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  // Backend PUT is partial — only investigation_status + remarks change
  const handleSave = (payload) => {
    setData((prev) =>
      prev.map((r) =>
        r.suspicious_id === editingRow.suspicious_id ? { ...r, ...payload } : r
      )
    );
    setIsModalOpen(false);
    setEditingRow(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-3 my-4 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-auto max-w-full min-w-0 min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex items-center justify-between gap-2 mb-5 mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">Suspicious Products</h2>
      </div>

      <div className="relative mb-4 w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search status, reason, batch..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
        />
      </div>

      <SuspiciousProductsTable rows={paginated} onEdit={openEditModal} />

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

      <SuspiciousInvestigationModal
        open={isModalOpen}
        data={editingRow}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
