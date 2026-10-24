import { CircleSlash2, CircleDot, AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/auth";

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-600",
  NotActive: "bg-slate-100 text-slate-600",
};

const ICON_STYLES = {
  Active: <CircleDot className="mt-0.5" size={15} />,
  NotActive: <CircleSlash2 className="mt-0.5" size={15} />,
};

function iconStyle(status) {
  return ICON_STYLES[status] || null;
}

function statusStyle(status) {
  return STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
}

const ProductionOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/overall_production_satistics_api/");

      if (response.data?.status === false) {
        throw new Error(
          response.data?.message || "Failed to load production statistics."
        );
      }

      const result = response.data?.data;

      if (!result || typeof result !== "object") {
        throw new Error("No production statistics available.");
      }

      setData(result);
    } catch (err) {
      console.error("Production overview error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Could not load production statistics. Please try again."
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const productionStatus = data?.production_status;

  // Numeric stats (wastage %, efficiency %, pass %) come back from the
  // backend as raw floats with many decimal places (e.g.
  // 87.6666666666667), so round them to 3 decimals here before display.
  const formatValue = (value, suffix = "%") => {
    if (loading) return "Loading...";
    if (error) return "Unavailable";
    if (value == null || value === "") return "N/A";

    const n = Number(value);
    if (Number.isNaN(n)) return "N/A";

    return `${n.toFixed(3)}${suffix}`;
  };

  const statusLabel = loading
    ? "Loading..."
    : error
      ? "Unavailable"
      : productionStatus || "N/A";

  const hasValidStatus =
    !loading &&
    !error &&
    Boolean(productionStatus) &&
    Boolean(STATUS_STYLES[productionStatus]);

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <h1 className="m-4 text-xl font-semibold text-black sm:m-5 sm:text-2xl">
        Current Production
      </h1>

      <div className="mt-3 grid w-full min-w-0 grid-cols-1 gap-3 overflow-hidden px-4 sm:grid-cols-2 sm:gap-4 sm:px-5 lg:grid-cols-4">
        {/* Production Status */}
        <div className="flex h-[90px] min-w-0 cursor-pointer flex-col justify-center gap-2 overflow-hidden rounded-2xl bg-[#F4F5F7] p-3 transition-all duration-200 hover:-translate-y-1 sm:h-[100px] sm:p-4">
          <span className="truncate text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            Production Status
          </span>

          <span
            className={`flex self-start flex-row items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium sm:text-sm ${
              hasValidStatus
                ? statusStyle(productionStatus)
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {hasValidStatus && iconStyle(productionStatus)}
            {statusLabel}
          </span>
        </div>

        {/* Wastage */}
        <div className="flex h-[90px] min-w-0 cursor-pointer flex-col justify-center overflow-hidden rounded-2xl bg-[#F4F5F7] p-3 transition-all duration-200 hover:-translate-y-1 sm:h-[100px] sm:p-5">
          <span className="truncate text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            Wastage %
          </span>
          <span className="pl-1 text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            {formatValue(data?.total_wastage)}
          </span>
        </div>

        {/* Production Efficiency */}
        <div className="flex h-[90px] min-w-0 cursor-pointer flex-col justify-center overflow-hidden rounded-2xl bg-[#F4F5F7] p-3 transition-all duration-200 hover:-translate-y-1 sm:h-[100px] sm:p-5">
          <span className="truncate text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            Production Efficiency %
          </span>
          <span className="pl-1 text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            {formatValue(data?.production_effeciency)}
          </span>
        </div>

        {/* Testing Pass */}
        <div className="flex h-[90px] min-w-0 cursor-pointer flex-col justify-center overflow-hidden rounded-2xl bg-[#F4F5F7] p-3 transition-all duration-200 hover:-translate-y-1 sm:h-[100px] sm:p-5">
          <span className="truncate text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            Testing Pass %
          </span>
          <span className="pl-1 text-sm font-semibold text-gray-600 sm:text-base lg:text-lg">
            {formatValue(data?.passing_percentage)}
          </span>
        </div>
      </div>

      {/* Loading / Error / Empty State */}
      {(loading || error || !data) && (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-4 text-center">
          {loading ? (
            <p className="text-sm font-medium text-slate-500">
              Loading production statistics...
            </p>
          ) : error ? (
            <>
              <AlertCircle size={28} className="text-red-500" />

              <p className="text-sm font-medium text-red-500">
                Unable to load production statistics
              </p>

              <p className="max-w-lg break-words text-sm text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchData}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </>
          ) : (
            <p className="text-sm font-medium text-slate-500">
              No production statistics available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductionOverview;