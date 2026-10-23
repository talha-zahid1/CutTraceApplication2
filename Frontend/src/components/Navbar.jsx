import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import logo from "../assets/Logo.png";
import { api } from "../services/auth";

// Pulls the top summary strip's live values from existing APIs:
//   - overall_production_satistics_api/ -> total_products_manufactured,
//                                           total_fabric_received
//   - product_batches_api/      -> earliest batch's created_at
//
// "Product" tile used to show the most recently received fabric's
// quality — but with multiple products in the system that single
// latest item didn't mean much at a glance, so it's replaced with a
// global count (total products manufactured) that reads the same
// way as "Amount" and "First Item" do.
function asList(resp) {
  const data = resp?.data?.data ?? resp?.data;
  return Array.isArray(data) ? data : [];
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    totalProductsManufactured: null,
    totalFabric: null,
    firstBatchDate: null,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [overallRes, batchesRes] = await Promise.allSettled([
        api.get("overall_production_satistics_api/"),
        api.get("product_batches_api/"),
      ]);

      if (cancelled) return;

      // Overall_production_stats_view ->
      // data.total_products_manufactured, data.total_fabric_received
      const overall =
        overallRes.status === "fulfilled"
          ? overallRes.value?.data?.data ?? overallRes.value?.data
          : null;
      const totalProductsManufactured =
        overall?.total_products_manufactured ?? null;
      const totalFabric = overall?.total_fabric_received ?? null;

      // production_batches model: batch_id, created_at, ...
      // Earliest batch's created_at gives "First Batch Date".
      const batchesList =
        batchesRes.status === "fulfilled" ? asList(batchesRes.value) : [];
      const firstBatch = [...batchesList].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      )[0];

      setSummary({
        totalProductsManufactured,
        totalFabric,
        firstBatchDate: firstBatch?.created_at ?? null,
      });
      setSummaryLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    // TODO: Implement the global search API.
    //
    // No dedicated free-text search endpoint exists in the current API
    // list (fabric_in_api/, product_batches_api/, ready_to_manufacture_api/,
    // manufacturing_api/, testing_api/, suspicious_products_api/,
    // ready_to_deliver_api/, delivered_products_api/, production_standards_api/,
    // trace_history_api/, ...). trace_history_api/ takes an exact ID
    // (fabric_in id, batch id, or delivered product id), not a name/text
    // search — so it can't power this box as-is.
    //
    // try {
    //   const response = await api.get("YOUR_GLOBAL_SEARCH_API/", {
    //     params: { search: searchValue.trim() },
    //   });
    //
    //   if (!response.data?.status) {
    //     throw new Error(
    //       response.data?.message || "Search failed."
    //     );
    //   }
    //
    //   setResults(response.data.data || []);
    // } catch (err) {
    //   setError(
    //     err.response?.data?.message ||
    //     err.message ||
    //     "Unable to search records."
    //   );
    // } finally {
    //   setLoading(false);
    // }

    // Remove this placeholder once the API is implemented.
    setLoading(false);
    setResults([]);
  };

  return (
    <header className="relative z-30 w-full">
      <div className="flex min-h-[60px] items-center justify-between gap-4">
        <img
          src={logo}
          alt="CutTrace"
          className="h-10 w-auto shrink-0 object-contain sm:h-12"
        />

        <div className="hidden flex-1 items-center justify-center gap-6 pr-4 md:flex lg:gap-12 lg:pr-10">
          {[
            {
              label: "Products Manufactured",
              value:
                summary.totalProductsManufactured != null
                  ? `${summary.totalProductsManufactured} Products`
                  : "—",
              valueClassName: "text-sm font-semibold px-5 text-slate-700",
            },
            {
              label: "Amount",
              value:
                summary.totalFabric != null
                  ? `${summary.totalFabric} kg`
                  : "—",
              valueClassName: "text-sm font-semibold text-slate-700",
            },
            {
              label: "First Item",
              value: formatDate(summary.firstBatchDate),
              valueClassName: "text-sm font-semibold text-slate-700",
            },
          ].map(({ label, value, valueClassName }, index) => (
            <div
              key={label}
              className={`min-w-0 px-2 ${
                index !== 0
                  ? "border-l border-slate-300/70 pl-6 lg:pl-10"
                  : ""
              }`}
            >
              <p className="text-[11px] font-medium text-slate-400">
                {label}
              </p>
              <p className={`mt-1 truncate ${valueClassName}`}>
                {summaryLoading ? (
                  <span className="inline-block h-5 w-16 animate-pulse rounded bg-slate-100" />
                ) : (
                  value
                )}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={searchOpen ? "Close search" : "Open search"}
          onClick={() => {
            setSearchOpen((prev) => !prev);
            setSearchValue("");
            setResults([]);
            setError("");
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {searchOpen && (
        <div className="absolute right-0 top-full mt-2 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white">
              <Search size={17} className="shrink-0 text-slate-400" />

              <input
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search batches, products..."
                aria-label="Search CutTrace records"
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={loading || !searchValue.trim()}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "..." : "Search"}
              </button>
            </div>
          </form>

          {error && (
            <p role="alert" className="mt-3 text-xs text-rose-600">
              {error}
            </p>
          )}

          {results.length > 0 && (
            <div className="mt-3 divide-y divide-slate-100">
              {results.map((item) => (
                <div key={item.id} className="py-3 text-sm text-slate-700">
                  {item.name}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && searchValue.trim() && results.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Search results will appear here once the API is connected.
            </p>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;