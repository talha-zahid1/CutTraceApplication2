import React, { useState, useEffect, useCallback } from "react";
import { api } from "../services/auth";
import { AlertCircle, RefreshCw } from "lucide-react";

const TOLERANCE_PCT = 0.1;

export default function InspectionValuesCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("inspection_values_api/");

      if (response.data?.status === false) {
        throw new Error(
          response.data?.message ||
            (response.data?.error
              ? JSON.stringify(response.data.error)
              : "Failed to load inspection values.")
        );
      }

      if (!Array.isArray(response.data?.data)) {
        throw new Error(
          "Invalid inspection values received from the server."
        );
      }

      setData(response.data.data);
    } catch (err) {
      console.error(
        "Failed to fetch inspection values:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          (err.response?.data?.error
            ? JSON.stringify(err.response.data.error)
            : null) ||
          err.message ||
          "Failed to load inspection values."
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="rounded-2xl shadow-2xl transition-all duration-200 hover:-translate-y-1 border border-slate-100 p-5 w-full bg-[#F4F5F7] [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold text-lg">
            Inspection Values
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Actual vs expected tolerance
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Pass
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Flagged
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500 text-center py-4">
            Loading inspection values...
          </p>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 px-3 text-center">
            <AlertCircle size={26} className="text-red-500" />

            <p className="text-sm font-medium text-red-500">
              Unable to load inspection values
            </p>

            <p className="text-xs text-slate-500 break-words max-w-full">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchData}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No inspection data available.
          </p>
        ) : (
          data.map((item, i) => (
            <QualityPanel key={i} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

function QualityPanel({ item }) {
  const wastagePass = isWithinTolerance(
    item.actual_wastage_percentage,
    item.expected_wastage_percentage
  );

  const qtyPass = isWithinTolerance(
    item.actual_final_product_quantity,
    item.expected_final_product_quantity
  );

  const overallPass = wastagePass && qtyPass;

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">
          {item.fabric_quality__name}
        </span>

        <span
          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
            overallPass
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          <StatusIcon pass={overallPass} />
          {overallPass ? "Within Tolerance" : "Flagged"}
        </span>
      </div>

      <ToleranceTrack
        label="Wastage %"
        expected={item.expected_wastage_percentage}
        actual={item.actual_wastage_percentage}
        pass={wastagePass}
        unit="%"
      />

      <div className="h-3" />

      <ToleranceTrack
        label="Output Qty"
        expected={item.expected_final_product_quantity}
        actual={item.actual_final_product_quantity}
        pass={qtyPass}
        unit=""
      />
    </div>
  );
}

function isWithinTolerance(actual, expected) {
  const actualValue = Number(actual);
  const expectedValue = Number(expected);

  if (
    actual === null ||
    actual === undefined ||
    expected === null ||
    expected === undefined ||
    actual === "" ||
    expected === "" ||
    !Number.isFinite(actualValue) ||
    !Number.isFinite(expectedValue)
  ) {
    return false;
  }

  const band = Math.abs(expectedValue) * TOLERANCE_PCT;

  return (
    actualValue >= expectedValue - band &&
    actualValue <= expectedValue + band
  );
}

function ToleranceTrack({ label, expected, actual, pass, unit }) {
  const expectedValue = Number(expected);
  const actualValue = Number(actual);

  const valid =
    expected !== null &&
    expected !== undefined &&
    actual !== null &&
    actual !== undefined &&
    expected !== "" &&
    actual !== "" &&
    Number.isFinite(expectedValue) &&
    Number.isFinite(actualValue);

  if (!valid) {
    return (
      <div>
        <p className="text-[11px] text-slate-500 mb-1.5">{label}</p>
        <p className="text-xs text-slate-400">
          Invalid or missing inspection values.
        </p>
      </div>
    );
  }

  const band = Math.abs(expectedValue) * TOLERANCE_PCT;
  const rangeMin = Math.min(expectedValue - band, actualValue);
  const rangeMax = Math.max(expectedValue + band, actualValue);
  const padding = (rangeMax - rangeMin) * 0.15 || 1;
  const min = rangeMin - padding;
  const max = rangeMax + padding;
  const span = max - min;

  const toPct = (value) => ((value - min) / span) * 100;
  const bandStart = toPct(expectedValue - band);
  const bandEnd = toPct(expectedValue + band);
  const expectedPos = toPct(expectedValue);
  const actualPos = toPct(actualValue);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] text-slate-500">{label}</span>

        <span className="text-[11px] text-slate-500 text-right">
          <span
            className={`font-semibold ${
              pass ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {actualValue}
            {unit}
          </span>{" "}
          <span className="text-slate-400">
            / target {expectedValue}
            {unit}
          </span>
        </span>
      </div>

      <div className="relative h-2.5 rounded-full bg-slate-200/70">
        <div
          className="absolute top-0 bottom-0 rounded-full bg-emerald-200"
          style={{
            left: `${bandStart}%`,
            width: `${bandEnd - bandStart}%`,
          }}
        />

        <div
          className="absolute -top-1 -bottom-1 w-0.5 bg-slate-400"
          style={{ left: `${expectedPos}%` }}
        />

        <div
          className={`absolute -top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
            pass ? "bg-emerald-500" : "bg-red-500"
          }`}
          style={{ left: `calc(${actualPos}% - 7px)` }}
        />
      </div>
    </div>
  );
}

function StatusIcon({ pass }) {
  return pass ? (
    <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 10.5L8.5 14L15 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 4V11M10 15.5V15.6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

