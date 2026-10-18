
import { useState } from "react";
import { Search, X } from "lucide-react";
import logo from "../assets/Logo.png";
// import { api } from "../services/auth";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

        <div className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-10">
          {[
            ["Product", "Fabric Type"],
            ["Amount", "Total Fabric"],
            ["First Item", "First Batch Date"],
          ].map(([label, value], index) => (
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
              <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                {value}
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
