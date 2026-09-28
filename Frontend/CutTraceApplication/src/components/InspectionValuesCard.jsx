import React, { useState, useEffect } from "react";

// ============================================================
// InspectionValuesCard
// Data source: suspicious_products model, grouped by fabric_quality.
// Field names mirror the backend model directly - no renaming
// needed on integration.
//
// Needs a new aggregation endpoint, e.g.:
//
// suspicious_products.objects.values('fabric_quality__name').annotate(
//     expected_wastage_percentage=Avg('expected_wastage_percentage'),
//     actual_wastage_percentage=Avg('actual_wastage_percentage'),
//     expected_final_product_quantity=Avg('expected_final_product_quantity'),
//     actual_final_product_quantity=Avg('actual_final_product_quantity'),
// )
//
// NOTE: there's no explicit "tolerance" field in production_standards,
// so TOLERANCE_PCT below is a placeholder band (+/-10%) used just for
// the visual. Swap it for a real tolerance field if/when you add one
// to production_standards.
// ============================================================

const TOLERANCE_PCT = 0.1;

const dummyData = [
  {
    fabric_quality__name: "Grade A",
    expected_wastage_percentage: 8.0,
    actual_wastage_percentage: 9.4,
    expected_final_product_quantity: 480,
    actual_final_product_quantity: 462,
  },
  {
    fabric_quality__name: "Grade B",
    expected_wastage_percentage: 10.5,
    actual_wastage_percentage: 10.1,
    expected_final_product_quantity: 400,
    actual_final_product_quantity: 405,
  },
  {
    fabric_quality__name: "Grade C",
    expected_wastage_percentage: 12.0,
    actual_wastage_percentage: 15.8,
    expected_final_product_quantity: 300,
    actual_final_product_quantity: 268,
  },
];

export default function InspectionValuesCard() {
  const [data, setData] = useState(dummyData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: API CALL HERE
    // fetch("/api/production/inspection-values-stats/", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.status) setData(res.data);
    //   })
    //   .finally(() => setLoading(false));
  }, []);

  return (
    <div className=" rounded-2xl shadow-2xl transition-all duration-200 hover:-translate-y-1 border border-slate-100 p-5 w-full bg-[#F4F5F7] p-5 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold text-lg">Inspection Values</h3>
          <p className="text-xs text-slate-400 mt-0.5">Actual vs expected tolerance</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Pass
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Flagged
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, i) => (
          <QualityPanel key={i} item={item} />
        ))}
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
        <span className="text-sm font-medium text-slate-700">{item.fabric_quality__name}</span>
        <span
          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
            overallPass ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
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
  const band = expected * TOLERANCE_PCT;
  return actual >= expected - band && actual <= expected + band;
}

function ToleranceTrack({ label, expected, actual, pass, unit }) {
  const band = expected * TOLERANCE_PCT;
  const rangeMin = Math.min(expected - band, actual) * 0.85;
  const rangeMax = Math.max(expected + band, actual) * 1.15;
  const span = rangeMax - rangeMin;

  const toPct = (v) => ((v - rangeMin) / span) * 100;
  const bandStart = toPct(expected - band);
  const bandEnd = toPct(expected + band);
  const expectedPos = toPct(expected);
  const actualPos = toPct(actual);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-slate-500">{label}</span>
        <span className="text-[11px] text-slate-500">
          <span className={`font-semibold ${pass ? "text-emerald-600" : "text-red-500"}`}>
            {actual}
            {unit}
          </span>{" "}
          <span className="text-slate-400">/ target {expected}{unit}</span>
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-slate-200/70">
        {/* tolerance band */}
        <div
          className="absolute top-0 bottom-0 rounded-full bg-emerald-200"
          style={{ left: `${bandStart}%`, width: `${bandEnd - bandStart}%` }}
        />
        {/* expected tick */}
        <div
          className="absolute -top-1 -bottom-1 w-0.5 bg-slate-400"
          style={{ left: `${expectedPos}%` }}
        />
        {/* actual marker */}
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
