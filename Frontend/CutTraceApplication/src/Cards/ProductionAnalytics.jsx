import ProductionStatsPanel from "./ProductionStatsPanel";
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

const ProductionAnalytics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6 md:p-8 w-full overflow-hidden">

      {/* =========================
          BOX 1 - PRODUCTION PIPELINE
      ========================== */}
      <div
        className="
          relative
          h-[450px]
          w-full
          min-w-0
          overflow-hidden
          rounded-2xl
          shadow-2xl
          bg-[#F4F5F7]
          p-4 sm:p-5
          transition-all
          duration-200
          hover:-translate-y-1
          [background-image:radial-gradient(#d1d5db_1px,transparent_1px)]
          [background-size:20px_20px]
        "
      >

        {/* Header */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <h1
            className="
              text-lg
              sm:text-xl
              md:text-2xl
              font-semibold
              text-gray-600
              tracking-wider
              truncate
            "
          >
            Production Pipeline
          </h1>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Workflow
              className="
                w-5 h-5
                sm:w-6 sm:h-6
                text-gray-600
                transition-all
                duration-300
                hover:text-blue-500
                hover:scale-110
                hover:-translate-y-1
                cursor-pointer
              "
            />

            <Boxes
              className="
                w-5 h-5
                sm:w-6 sm:h-6
                text-gray-600
                transition-all
                duration-300
                hover:text-blue-500
                hover:scale-110
                hover:-translate-y-1
                cursor-pointer
              "
            />
          </div>
        </div>

        {/* =========================
            PIPELINE
        ========================== */}
        <div className="pt-5 overflow-hidden">
          <div className="relative w-full pb-2">

            {/* Vertical Pipeline Line */}
            <div
              className="
                absolute
                left-[7px]
                top-8
                bottom-4
                border-l-2
                border-dashed
                border-gray-300
              "
            />

            {/* =========================
                FABRIC IN
            ========================== */}
            <div className="relative p-3 pl-8">

              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              <div
                className="
                  absolute
                  left-[-1px]
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  rounded-full
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  z-10
                "
              >
                <FileText size={18} className="text-gray-600" />
              </div>

              <div
                className="
                  w-[42%]
                  sm:w-[40%]
                  md:w-[38%]
                  lg:w-[150px]
                  max-w-full
                  h-[32px]
                  rounded-lg
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition-transform
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-bold
                    text-gray-600
                    tracking-tight
                    truncate
                    px-2
                  "
                >
                  Fabric In
                </span>
              </div>
            </div>

            {/* =========================
                READY TO MANUFACTURE
            ========================== */}
            <div className="relative p-3 pl-8">

              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              <div
                className="
                  absolute
                  left-[-1px]
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  rounded-full
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  z-10
                "
              >
                <Factory size={18} className="text-gray-600" />
              </div>

              <div
                className="
                  ml-[8%]
                  w-[48%]
                  sm:w-[48%]
                  md:w-[50%]
                  lg:w-[200px]
                  max-w-[calc(100%-8%)]
                  h-[32px]
                  rounded-lg
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition-transform
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-bold
                    text-gray-600
                    tracking-tight
                    truncate
                    px-2
                  "
                >
                  Ready to Manufacture
                </span>
              </div>
            </div>

            {/* =========================
                MANUFACTURED
            ========================== */}
            <div className="relative p-3 pl-8">

              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              <div
                className="
                  absolute
                  left-[-1px]
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  rounded-full
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  z-10
                "
              >
                <PackageCheck size={18} className="text-gray-600" />
              </div>

              <div
                className="
                  ml-[16%]
                  w-[52%]
                  sm:w-[52%]
                  md:w-[52%]
                  lg:w-[200px]
                  max-w-[calc(100%-16%)]
                  h-[32px]
                  rounded-lg
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition-transform
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-bold
                    text-gray-600
                    tracking-tight
                    truncate
                    px-2
                  "
                >
                  Manufactured
                </span>
              </div>
            </div>

            {/* =========================
                TESTING
            ========================== */}
            <div className="relative p-3 pl-8">

              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              <div
                className="
                  absolute
                  left-[-1px]
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  rounded-full
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  z-10
                "
              >
                <ClipboardCheck size={18} className="text-gray-600" />
              </div>

              <div
                className="
                  ml-[24%]
                  w-[52%]
                  sm:w-[52%]
                  md:w-[52%]
                  lg:w-[200px]
                  max-w-[calc(100%-24%)]
                  h-[32px]
                  rounded-lg
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition-transform
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-bold
                    text-gray-600
                    tracking-tight
                    truncate
                    px-2
                  "
                >
                  Testing
                </span>
              </div>
            </div>

            {/* =========================
                READY TO DELIVER
            ========================== */}
            <div className="relative p-3 pl-8">

              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              <div
                className="
                  absolute
                  left-[-1px]
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  rounded-full
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  z-10
                "
              >
                <Truck size={18} className="text-gray-600" />
              </div>

              <div
                className="
                  ml-[32%]
                  w-[52%]
                  sm:w-[52%]
                  md:w-[52%]
                  lg:w-[200px]
                  max-w-[calc(100%-32%)]
                  h-[32px]
                  rounded-lg
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition-transform
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-bold
                    text-gray-600
                    tracking-tight
                    truncate
                    px-2
                  "
                >
                  Ready to Deliver
                </span>
              </div>
            </div>

            {/* =========================
                DELIVERED
            ========================== */}
            <div className="relative p-3 pl-8">

              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300" />

              <div
                className="
                  absolute
                  left-[-1px]
                  top-1/2
                  -translate-y-1/2
                  w-5 h-5
                  rounded-full
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  z-10
                "
              >
                <Package size={18} className="text-gray-600" />
              </div>

              <div
                className="
                  ml-[40%]
                  w-[52%]
                  sm:w-[52%]
                  md:w-[52%]
                  lg:w-[200px]
                  max-w-[calc(100%-40%)]
                  h-[32px]
                  rounded-lg
                  bg-[#DCE7FA]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition-transform
                  hover:-translate-y-1
                "
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-bold
                    text-gray-600
                    tracking-tight
                    truncate
                    px-2
                  "
                >
                  Delivered
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div
          className="
            absolute
            bottom-4
            right-4
            sm:right-6
            text-[10px]
            sm:text-xs
            font-medium
            text-gray-400
            whitespace-nowrap
          "
        >
          Smarter Cutting • Less Wastage
        </div>
      </div>

      {/* =========================
          BOX 2 - PRODUCTION STATS
      ========================== */}
      <div
        className="
          h-[450px]
          w-full
          min-w-0
          overflow-hidden
          rounded-2xl
          shadow-2xl
          bg-[#F4F5F7]
          transition-all
          duration-200
          flex 
          gap-4
          hover:-translate-y-1
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
