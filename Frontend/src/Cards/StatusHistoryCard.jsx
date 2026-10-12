import React, { useState, useEffect, useCallback } from "react";
import { api } from "../services/auth";
import { AlertCircle, RefreshCw } from "lucide-react";

const COLORS = {
  Delivered: "#60a5fa",
  Pending: "#fbbf24",
  Cancelled: "#f87171",
};

const STATUS_BADGE = {
  Delivered: "bg-blue-50 text-blue-500",
  Pending: "bg-amber-50 text-amber-600",
  Cancelled: "bg-red-50 text-red-500",
};

const STATUS_ORDER = ["Delivered", "Pending", "Cancelled"];

const getErrorMessage = (err) =>
  err.response?.data?.message ||
  err.response?.data?.detail ||
  err.message ||
  "Unable to load delivery data. Please try again.";

export default function StatusHistoryCard() {
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    setData(null);
    setRecent([]);

    try {
      const [statsResponse, recentResponse] = await Promise.all([
        api.get("delivered_product_statistics_api/"),
        api.get("delivered_products_api/"),
      ]);
      if (!statsResponse.data?.status) {
        throw new Error(
          statsResponse.data?.message ||
            "Failed to load delivery statistics."
        );
      }

      if (!recentResponse.data?.status) {
        throw new Error(
          recentResponse.data?.message ||
            "Failed to load recent deliveries."
        );
      }

      const stats = statsResponse.data?.data;

      if (!stats || typeof stats !== "object") {
        throw new Error("Delivery statistics are unavailable.");
      }

      setData(stats);

      setRecent(
        Array.isArray(recentResponse.data?.data)
          ? recentResponse.data.data
          : []
      );
    } catch (err) {
      console.error("Status history error:", err);
      setError(getErrorMessage(err));
      setData(null);
      setRecent([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const apiStatuses = Array.isArray(data?.delivery_by_status)
    ? data.delivery_by_status
    : [];

  const total = apiStatuses.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  let cumulative = 0;

  const stops = apiStatuses.map((item) => {
    const start = (cumulative / (total || 1)) * 360;
    cumulative += Number(item.total || 0);
    const end = (cumulative / (total || 1)) * 360;

    return `${COLORS[item.delivery_status] || "#94a3b8"} ${start}deg ${end}deg`;
  });

  const gradient =
    total > 0
      ? `conic-gradient(${stops.join(", ")})`
      : "conic-gradient(#e2e8f0 0deg 360deg)";

  const legendItems = [
    ...STATUS_ORDER.map((name) => ({
      delivery_status: name,
      total:
        Number(
          apiStatuses.find(
            (item) => item.delivery_status === name
          )?.total
        ) || 0,
    })),
    ...apiStatuses.filter(
      (item) => !STATUS_ORDER.includes(item.delivery_status)
    ),
  ];

  return (
    <div className="bg-[#F4F5F7] p-5 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] rounded-2xl shadow-2xl border border-slate-100 w-full h-full flex flex-col transition-all duration-200 hover:-translate-y-1">
      <h3 className="text-slate-800 font-semibold text-lg mb-5">
        Status History
      </h3>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-48">
          <p className="text-sm text-slate-500">
            Loading delivery data...
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-48 gap-3">
          <AlertCircle size={28} className="text-red-500" />

          <p className="text-sm font-semibold text-red-500">
            Unable to load delivery data
          </p>

          <p className="text-sm text-slate-500 text-center break-words">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 sm:gap-6 mb-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0">
              <div
                className="w-full h-full rounded-full"
                style={{ background: gradient }}
              />

              <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-slate-800">
                  {data?.total_products_delivered ?? 0}
                </p>
                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  Total Delivered
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              {legendItems.map((item, i) => {
                const pct =
                  total > 0
                    ? (
                        (Number(item.total) / total) *
                        100
                      ).toFixed(0)
                    : 0;

                return (
                  <div
                    key={`${item.delivery_status}-${i}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2 min-w-0 text-sm text-slate-600">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{
                          backgroundColor:
                            COLORS[item.delivery_status] || "#94a3b8",
                        }}
                      />
                      <span className="truncate">
                        {item.delivery_status}
                      </span>
                    </span>

                    <span className="flex items-baseline gap-1 shrink-0 whitespace-nowrap text-sm font-medium text-slate-800">
                      {item.total}
                      <span className="text-xs text-slate-400 font-normal">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex-1">
            <p className="text-xs font-medium text-slate-500 mb-3">
              Recent Deliveries
            </p>

            {recent.length === 0 ? (
              <p className="text-sm text-slate-400">
                No recent deliveries
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.map((item) => (
                  <div
                    key={item.delivery_id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 truncate">
                        {item.final_product_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {item.purchaser_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="text-xs text-slate-400">
                        {item.delivered_at
                          ? new Date(
                              item.delivered_at
                            ).toLocaleDateString()
                          : "—"}
                      </span>

                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          STATUS_BADGE[item.delivery_status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.delivery_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

