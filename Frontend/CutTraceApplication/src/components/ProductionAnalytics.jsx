import ProductionStatsPanel from './ProductionStatsPanel'
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
    <div className="flex flex-col lg:flex-row justify-between p-4 sm:p-8 gap-4">
      {/* box1 */}
      <div className="h-[450px] relative w-full lg:w-[500px] transition-all duration-200 hover:-translate-y-1 rounded-2xl shadow-2xl bg-[#F4F5F7] p-5 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">

        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-gray-600 tracking-wider">
            Production Pipeline
          </h1>

          <div className="flex items-baseline gap-4">
            <Workflow className="text-xl font-semibold text-gray-600 transition-all duration-300 hover:text-blue-500 hover:scale-110 hover:-translate-y-1 cursor-pointer" />
            <Boxes className="text-xl font-semibold text-gray-600 transition-all duration-300 hover:text-blue-500 hover:scale-110 hover:-translate-y-1 cursor-pointer" />
          </div>
        </div>

        {/* Scrollable wrapper: staircase design preserved, chhoti screens pe horizontally scroll hoga instead of overflow */}
        <div className="overflow-x-auto overflow-x-hidden pt-5">
          <div className="relative min-w-[520px] pb-2">

            {/* Vertical Pipeline Line */}
            <div className="absolute left-[8px] top-8 bottom-4 border-l-2 border-dashed border-gray-300"></div>

            {/* Fabric In */}
            <div className="p-3 pl-8 relative">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300"></div>
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <FileText size={18} className="text-gray-600" />
              </div>
              <div className="rounded-lg w-[150px] h-[32px] hover:scale-100 hover:-translate-y-1 cursor-pointer bg-[#DCE7FA] flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600 tracking-tight">Fabric In</span>
              </div>
            </div>

            {/* Ready to Manufacture */}
            <div className="p-3 pl-18 relative">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300"></div>
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <Factory size={18} className="text-gray-600" />
              </div>
              <div className="rounded-lg w-[200px] h-[32px] hover:scale-100 hover:-translate-y-1 cursor-pointer bg-[#DCE7FA] flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600 tracking-tight">Ready to Manufacture</span>
              </div>
            </div>

            {/* Manufactured */}
            <div className="p-3 pl-30 relative">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300"></div>
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <PackageCheck size={18} className="text-gray-600" />
              </div>
              <div className="rounded-lg w-[200px] h-[32px] bg-[#DCE7FA] flex items-center hover:scale-100 hover:-translate-y-1 cursor-pointer justify-center">
                <span className="text-lg font-bold text-gray-600 tracking-tight">Manufactured</span>
              </div>
            </div>

            {/* Testing */}
            <div className="p-3 pl-42 relative">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300"></div>
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <ClipboardCheck size={18} className="text-gray-600" />
              </div>
              <div className="rounded-lg w-[200px] h-[32px] hover:scale-100 hover:-translate-y-1 cursor-pointer bg-[#DCE7FA] flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600 tracking-tight">Testing</span>
              </div>
            </div>

            {/* Ready to Deliver */}
            <div className="p-3 pl-52 relative">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300"></div>
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <Truck size={18} className="text-gray-600" />
              </div>
              <div className="rounded-lg w-[200px] h-[32px] bg-[#DCE7FA] flex items-center hover:scale-100 hover:-translate-y-1 cursor-pointer justify-center">
                <span className="text-lg font-bold text-gray-600 tracking-tight">Ready to Deliver</span>
              </div>
            </div>

            {/* Delivered */}
            <div className="p-3 pl-64 relative">
              <div className="absolute left-8 right-0 bottom-0 border-b border-gray-300"></div>
              <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#DCE7FA] flex items-center justify-center z-10">
                <Package size={18} className="text-gray-600" />
              </div>
              <div className="rounded-lg w-[200px] h-[32px] bg-[#DCE7FA] flex items-center hover:scale-100 hover:-translate-y-1 cursor-pointer justify-center">
                <span className="text-lg font-bold text-gray-600 tracking-tight">Delivered</span>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-4 right-6 text-xs font-medium text-gray-400">
          Smarter Cutting • Less Wastage
        </div>
      </div>

      {/* box2 */}
      <div className="h-[450px] w-full lg:w-[500px] transition-all duration-200 hover:-translate-y-1 rounded-2xl shadow-2xl bg-[#F4F5F7] [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">
        <ProductionStatsPanel />
      </div>

      {/* Production/Wastage Analysis */}
      <div></div>

      {/* Status Overview */}
      <div></div>
    </div>
  );
};

export default ProductionAnalytics;