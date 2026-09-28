import { ChevronDown } from "lucide-react";

const ProductionOverview = () => {
  return (
    <div className="">
      <h1 className="text-2xl m-5 font-semibold text-black">
        Current Production
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pl-5 pr-5">
        <div className="bg-[#F4F5F7] rounded-2xl shadow-2xl p-4 transition-all duration-200 hover:-translate-y-1 h-[100px] relative cursor-pointer">
          <select
            className="w-full bg-transparent outline-none pt-4 pb-4
           text-base sm:text-xl font-semibold text-gray-600
           appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>
              Production Status
            </option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown size={20} className="text-black top-1/2 -translate-y-1/2 font-bold absolute right-4 text-2xl text-gray-800 cursor-pointer pointer-events-none" />
        </div>

        <div className="h-[100px] bg-[#F4F5F7] rounded-2xl shadow-2xl p-4 sm:p-7 flex flex-col transition-all duration-200 hover:-translate-y-1 cursor-pointer">
          <span className="text-base sm:text-xl font-semibold text-gray-600">
            Total Wastage %
          </span>
          <span className="text-base sm:text-xl pl-1 font-semibold text-gray-600">70%</span>
        </div>

        <div className="h-[100px] bg-[#F4F5F7] rounded-2xl shadow-2xl p-4 sm:p-7 flex flex-col transition-all duration-200 hover:-translate-y-1 cursor-pointer">
          <span className="text-base sm:text-xl tracking-tighter font-semibold text-gray-600">
            Production Efficiency %
          </span>
          <span className="text-base sm:text-xl pl-1 font-semibold text-gray-600">70%</span>
        </div>

        <div className="h-[100px] bg-[#F4F5F7] rounded-2xl shadow-2xl p-4 sm:p-7 flex flex-col transition-all duration-200 hover:-translate-y-1 cursor-pointer">
          <span className="text-base sm:text-xl font-semibold text-gray-600">
            Testing Pass %
          </span>
          <span className="text-base sm:text-xl pl-1 font-semibold text-gray-600">70%</span>
        </div>
      </div>
    </div>
  );
};

export default ProductionOverview;