import ProductionStatsPanel from "./ProductionStatsPanel";
import { api } from "../services/auth";
import {
Workflow,
Boxes,
FileText,
Factory,
PackageCheck,
ClipboardCheck,
Truck,
Package,
} from "lucide-react";
import { useEffect, useState } from "react";

const ProductionAnalytics = () => {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [activeStage, setActiveStage] = useState(null);

useEffect(() => {
const fetch_api = async () => {
try {
setLoading(true);
setError(false);


    const DP = await api.get("production_pipeline/");
    setData(DP.data?.data ?? null);
  } catch (err) {
    console.error("Production pipeline error:", err);
    setError(true);
    setData(null);
  } finally {
    setLoading(false);
  }
};

fetch_api();


}, []);

const toggleStage = (stage) => {
setActiveStage((current) => (current === stage ? null : stage));
};

const formatStat = (value, suffix = "") => {
if (loading) return "Loading...";
if (error) return "Stats unavailable";
if (value == null) return "No data available";
return `${value}${suffix}`;
};

const formatCount = (value) => {
if (loading) return "...";
if (error) return "!";
if (value == null) return "—";
return value;
};

const stages = [
{
id: "fabric",
label: "Fabric In",
Icon: FileText,
count: data?.batches_in,
margin: "ml-[0%]",
tooltipLeft: "left-10",
tooltipTop: "top-[48px]",
tooltipWidth: "w-[180px]",
title: "Fabric Received",
details: [
{
label: null,
value: data?.batches_in,
suffix: " Batches",
style: "text-sm font-bold text-gray-700",
},
{
label: null,
value: data?.total_fabric_inkg,
suffix: " kg received",
style: "text-xs text-gray-400 mt-1",
},
],
},
{
id: "ready-manufacture",
label: "Ready to Manufacture",
Icon: Factory,
count: data?.ready_to_manufacture_batches,
margin: "ml-[8%]",
tooltipLeft: "left-[16%]",
tooltipTop: "top-[48px]",
tooltipWidth: "w-[180px]",
title: "Waiting for Manufacturing",
details: [
{
label: null,
value: data?.ready_to_manufacture_batches,
suffix: " Batches",
style: "text-sm font-bold text-gray-700",
},
{
label: null,
value: null,
text: "Pending production",
style: "text-xs text-gray-400 mt-1",
},
],
},
{
id: "manufactured",
label: "Manufactured",
Icon: PackageCheck,
count: data?.manufactured_count,
margin: "ml-[16%]",
tooltipLeft: "left-[24%]",
tooltipTop: "top-[48px]",
tooltipWidth: "w-[180px]",
title: "Manufacturing",
details: [
{
label: null,
value: data?.manufactured_count,
suffix: " Products",
style: "text-sm font-bold text-gray-700",
},
{
label: null,
value: data?.manufactured_quantity,
suffix: " units manufactured",
style: "text-xs text-gray-400 mt-1",
},
],
},
{
id: "testing",
label: "Testing",
Icon: ClipboardCheck,
count: data?.testing_count,
margin: "ml-[24%]",
tooltipLeft: "left-[32%]",
tooltipTop: "top-[48px]",
tooltipWidth: "w-[190px]",
title: "Testing Results",
details: [
{
label: "Tested",
value: data?.testing_count,
style: "font-semibold text-gray-700",
},
{
label: "Passed",
value: data?.testing_passed_count,
style: "font-semibold text-emerald-600",
},
{
label: "Suspicious",
value: data?.testing_suspicious_count,
style: "font-semibold text-red-500",
},
],
},
{
id: "ready-deliver",
label: "Ready to Deliver",
Icon: Truck,
count: data?.ready_to_deliver_count,
margin: "ml-[32%]",
tooltipLeft: "left-[40%]",
tooltipTop: "top-[34px]",
tooltipWidth: "w-[180px]",
title: "Ready for Delivery",
details: [
{
label: null,
value: data?.ready_to_deliver_count,
suffix: " Products",
style: "text-sm font-bold text-gray-700",
},
{
label: null,
value: data?.ready_to_deliver_quantity,
suffix: " units ready",
style: "text-xs text-gray-400 mt-1",
},
],
},
{
id: "delivered",
label: "Delivered",
Icon: Package,
count: data?.delivered_count,
margin: "ml-[40%]",
tooltipLeft: "right-0",
tooltipTop: "top-[-78px]",
tooltipWidth: "w-[180px]",
title: "Delivered Products",
details: [
{
label: null,
value: data?.delivered_count,
suffix: " Products",
style: "text-sm font-bold text-gray-700",
},
{
label: null,
value: data?.delivered_quantity,
suffix: " units delivered",
style: "text-xs text-gray-400 mt-1",
},
],
},
];

return ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6 md:p-8 w-full overflow-hidden">
{/* BOX 1 - PRODUCTION PIPELINE */} <div
     className="
       relative h-[450px] w-full min-w-0 overflow-hidden
       rounded-2xl shadow-2xl bg-[#F4F5F7] p-4 sm:p-5
       transition-all duration-200 hover:-translate-y-1
       [background-image:radial-gradient(#d1d5db_1px,transparent_1px)]
       [background-size:20px_20px]
     "
   >
{/* Header */} <div className="flex items-center justify-between gap-3 min-w-0"> <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 tracking-wider truncate">
Production Pipeline </h1>


      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Workflow className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-all duration-300 hover:text-blue-500 hover:scale-110 hover:-translate-y-1 cursor-pointer" />
        <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-all duration-300 hover:text-blue-500 hover:scale-110 hover:-translate-y-1 cursor-pointer" />
      </div>
    </div>

    {/* Pipeline stages */}
    <div className="pt-5">
      <div className="relative w-full pb-2">
        {/* Vertical pipeline line */}
        <div className="absolute left-[7px] top-8 bottom-4 border-l-2 border-dashed border-gray-300" />

        {stages.map((stage) => {
          const StageIcon = stage.Icon;
          const isActive = activeStage === stage.id;

          return (
            <div key={stage.id} className="relative p-3 pl-8 group">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              {/* Stage icon */}
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <StageIcon size={18} className="text-gray-600" />
              </div>

              {/* Clickable stage box */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`${stage.label} details`}
                onClick={() => toggleStage(stage.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleStage(stage.id);
                  }
                }}
                className={`
                  ${stage.margin}
                  w-[48%] min-h-[30px] rounded-lg bg-[#DCE7FA]
                  flex items-center justify-center gap-2 px-2
                  cursor-pointer transition-all duration-200
                  group-hover:-translate-y-1 group-hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                `}
              >
                <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-600 truncate min-w-0">
                  {stage.label}
                </span>

                <span className="text-xs font-semibold text-gray-500 shrink-0 whitespace-nowrap">
                  {formatCount(stage.count)}
                </span>
              </div>

              {/* Tooltip: tap on mobile, hover on desktop */}
              <div
                className={`
                  absolute ${stage.tooltipLeft} ${stage.tooltipTop}
                  z-30 ${stage.tooltipWidth}
                  rounded-xl bg-white border border-gray-200 shadow-xl p-3
                  transition-all duration-200
                  ${isActive
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible translate-y-1"}
                  lg:opacity-0 lg:invisible lg:translate-y-1
                  lg:group-hover:opacity-100
                  lg:group-hover:visible
                  lg:group-hover:translate-y-0
                `}
              >
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  {stage.title}
                </p>

                {stage.details.map((detail, index) => (
                  <div
                    key={`${stage.id}-detail-${index}`}
                    className={
                      detail.label
                        ? "flex justify-between text-xs mt-1"
                        : ""
                    }
                  >
                    {detail.label && (
                      <span className="text-gray-500">
                        {detail.label}
                      </span>
                    )}

                    <p className={detail.style}>
                      {detail.text ??
                        formatStat(detail.value, detail.suffix ?? "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Footer */}
    <div className="absolute bottom-4 right-4 sm:right-6 text-[10px] sm:text-xs font-medium text-gray-400 whitespace-nowrap">
      Smarter Cutting • Less Wastage
    </div>
  </div>

  {/* BOX 2 - PRODUCTION STATS */}
  <div
    className="
      h-[450px] w-full min-w-0 overflow-hidden rounded-2xl
      shadow-2xl bg-[#F4F5F7] transition-all duration-200
      flex gap-4 hover:-translate-y-1
      [background-image:radial-gradient(#d1d5db_1px,transparent_1px)]
      [background-size:20px_20px]
    "
  >
    <ProductionStatsPanel />
  </div>
</div>


);
};

export default ProductionAnalytics;
