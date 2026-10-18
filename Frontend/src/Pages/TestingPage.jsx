
import React, { useState } from "react";
import {
  PlayCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Scale,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../services/auth";

// ============================================================
// TestingPage
// Maps to: testing_view -> POST /testing_api/
// Single action endpoint: send a manufactured_id, backend compares
// actual output against production_standards and either:
//   - marks it "ready to deliver" (pass) -> returns tested vs actual data
//   - flags it as suspicious (fail) -> returns just a message
// ============================================================

const TOLERANCE_PCT = 0.1;

const DUMMY_PASS_RESULT = {
  outcome: "pass",
  message: "Testing Successful",
  data: {
    tested_product_quantity: 118,
    tested_wastage_kg: 9.5,
    actual_product_quantity: 120,
    actual_wastage_kg: 8.8,
  },
};

const DUMMY_FAIL_RESULT = {
  outcome: "fail",
  message: "Product flagged as suspicious",
};

export default function TestingPage() {
  const [manufacturedId, setManufacturedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const runTest = async (e) => {
    e.preventDefault();
    if (!manufacturedId.trim() || loading) return;

    setLoading(true);
    setError("");

    // TODO: API CALL HERE
    // try {
    //   const resp = await api.post("testing_api/", { manufactured_id: manufacturedId });
    //   if (!resp.data?.status) {
    //     throw new Error(resp.data?.message || "Testing failed.");
    //   }
    //   const outcome = resp.data.data ? "pass" : "fail";
    //   setResult({ outcome, message: resp.data.message, data: resp.data.data });
    // } catch (err) {
    //   setError(err.response?.data?.message || err.message || "Something went wrong while testing.");
    // } finally {
    //   setLoading(false);
    // }

    // Dummy preview behavior: alternate pass/fail so both states are visible while testing.
    setTimeout(() => {
      const dummy =
        Number(manufacturedId) % 2 === 0
          ? DUMMY_FAIL_RESULT
          : DUMMY_PASS_RESULT;

      setResult(dummy);
      setLoading(false);
    }, 650);
  };

  return (
    <div className="mx-3 my-4 min-h-screen min-w-0 flex-1 overflow-x-hidden rounded-2xl bg-[#EEF1FB] p-4 sm:mx-6 sm:my-6 sm:p-6 lg:mx-10 lg:my-8 lg:p-8">
      <Navbar />

      <main className="mx-auto mt-7 max-w-6xl">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200">
              <ClipboardCheck size={24} strokeWidth={1.8} />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                  Product Testing
                </h1>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                  Quality Control
                </span>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Verify manufactured products against production standards
                before approving them for delivery.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-white bg-white/80 px-3.5 py-2.5">
            <ShieldCheck size={17} className="text-blue-600" />
            <span className="text-xs font-medium text-slate-600">
              Production Standards
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Test form card */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <PlayCircle size={18} />
                </div>
                <h2 className="text-base font-semibold text-slate-800">
                  Run a quality test
                </h2>
              </div>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Enter the manufactured product ID to start the inspection.
              </p>
            </div>

            <form onSubmit={runTest} className="space-y-5 p-5 sm:p-6">
              <div>
                <label
                  htmlFor="manufacturedId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Manufactured Product ID
                </label>

                <input
                  id="manufacturedId"
                  type="text"
                  inputMode="numeric"
                  required
                  value={manufacturedId}
                  onChange={(e) =>
                    setManufacturedId(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="e.g. 42"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:text-sm"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter the ID of a product that has completed manufacturing.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"
                >
                  <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                  <p className="break-words">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <PlayCircle size={18} />
                )}
                {loading ? "Testing Product..." : "Run Test"}
                {!loading && <ArrowRight size={16} className="ml-1" />}
              </button>
            </form>

            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:px-6">
              <p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
                <ShieldCheck size={15} className="shrink-0 text-slate-400" />
                Results are evaluated against the product's production standard.
              </p>
            </div>
          </section>

          {/* How it works card */}
          <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Scale size={21} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Inspection overview
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  What happens after testing?
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700">
                    Standard comparison
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Product quantity and fabric wastage are checked against
                    the relevant production standard.
                  </p>
                </div>
              </div>

              <div className="ml-4 h-4 border-l border-dashed border-slate-200" />

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700">
                    Within acceptable range
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A passing product moves to Ready to Deliver.
                  </p>
                </div>
              </div>

              <div className="ml-4 h-4 border-l border-dashed border-slate-200" />

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <AlertTriangle size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-700">
                    Outside acceptable range
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    A suspicious product is flagged for investigation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Test result */}
        {result && !loading && (
          <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            {/* Result heading */}
            <div
              className={`border-b px-5 py-5 sm:px-6 ${
                result.outcome === "pass"
                  ? "border-emerald-100 bg-emerald-50/60"
                  : "border-rose-100 bg-rose-50/60"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      result.outcome === "pass"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {result.outcome === "pass" ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <AlertTriangle size={24} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span
                      className={`mb-1.5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        result.outcome === "pass"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {result.outcome === "pass"
                        ? "Test Passed"
                        : "Test Failed"}
                    </span>

                    <h2
                      className={`text-base font-bold sm:text-lg ${
                        result.outcome === "pass"
                          ? "text-emerald-800"
                          : "text-rose-800"
                      }`}
                    >
                      {result.outcome === "pass"
                        ? "Ready to Deliver"
                        : "Flagged as Suspicious"}
                    </h2>

                    <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                      Manufactured ID #{manufacturedId} · {result.message}
                    </p>
                  </div>
                </div>

                {result.outcome === "pass" && (
                  <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3.5 py-2.5">
                    <PackageCheck
                      size={18}
                      className="text-emerald-600"
                    />
                    <span className="text-xs font-semibold text-emerald-700">
                      Approved for delivery
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Passing product comparisons */}
            {result.outcome === "pass" && result.data && (
              <div className="p-5 sm:p-6">
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Production comparison
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Compare actual output with the expected target and
                    acceptable tolerance range.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ToleranceRow
                    label="Final Product Quantity"
                    icon={Boxes}
                    expected={result.data.tested_product_quantity}
                    actual={result.data.actual_product_quantity}
                    unit=""
                  />

                  <ToleranceRow
                    label="Fabric Wastage"
                    icon={Scale}
                    expected={result.data.tested_wastage_kg}
                    actual={result.data.actual_wastage_kg}
                    unit=" kg"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Acceptable range
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-0.5 bg-slate-500" />
                    Expected target
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Actual value
                  </span>
                </div>
              </div>
            )}

            {/* Failing product explanation */}
            {result.outcome === "fail" && (
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                  <AlertTriangle
                    size={19}
                    className="mt-0.5 shrink-0 text-rose-600"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-rose-800">
                      Investigation required
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Output fell outside the acceptable range of its
                      production standard. This entry has been sent to
                      Suspicious Products for investigation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function isWithinTolerance(actual, expected) {
  const band = expected * TOLERANCE_PCT;
  return actual >= expected - band && actual <= expected + band;
}

function ToleranceRow({ label, icon: Icon, expected, actual, unit }) {
  const pass = isWithinTolerance(actual, expected);
  const band = expected * TOLERANCE_PCT;
  const rangeMin = Math.min(expected - band, actual) * 0.85;
  const rangeMax = Math.max(expected + band, actual) * 1.15;
  const span = rangeMax - rangeMin || 1;

  const toPct = (v) => ((v - rangeMin) / span) * 100;
  const bandStart = toPct(expected - band);
  const bandEnd = toPct(expected + band);
  const expectedPos = toPct(expected);
  const actualPos = toPct(actual);

  return (
    <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-700">
            {label}
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Actual output vs expected target
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Actual
          </p>
          <p
            className={`text-2xl font-bold tracking-tight ${
              pass ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {actual}
            {unit}
          </p>
        </div>

        <div className="text-right">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Target
          </p>
          <p className="text-lg font-semibold text-slate-700">
            {expected}
            {unit}
          </p>
        </div>
      </div>

      {/* Tolerance comparison bar */}
      <div className="relative mx-1 mb-3 mt-5 h-3 rounded-full bg-slate-200">
        <div
          className="absolute bottom-0 top-0 rounded-full bg-emerald-200"
          style={{
            left: `${bandStart}%`,
            width: `${bandEnd - bandStart}%`,
          }}
        />

        <div
          className="absolute -top-1.5 h-6 w-0.5 rounded-full bg-slate-500"
          style={{ left: `${expectedPos}%` }}
        />

        <div
          className={`absolute -top-1 h-5 w-5 rounded-full border-[3px] border-white shadow-md ${
            pass ? "bg-emerald-500" : "bg-rose-500"
          }`}
          style={{ left: `calc(${actualPos}% - 10px)` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
        <span>
          {expected - band}
          {unit}
        </span>
        <span className="font-medium text-slate-500">
          Acceptable range
        </span>
        <span>
          {expected + band}
          {unit}
        </span>
      </div>

      <div
        className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 ${
          pass
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700"
        }`}
      >
        {pass ? (
          <CheckCircle2 size={15} />
        ) : (
          <AlertTriangle size={15} />
        )}
        <span className="text-xs font-semibold">
          {pass ? "Within tolerance" : "Outside tolerance"}
        </span>
      </div>
    </div>
  );
}
