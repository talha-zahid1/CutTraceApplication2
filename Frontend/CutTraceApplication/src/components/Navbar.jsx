import logo from "../assets/Logo.png";
import { SquareUser, Search } from "lucide-react";

const Navbar = () => {
  return (
    <div className="h-auto sm:h-[60px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
      
      <img
        src={logo}
        alt="CutTrace"
        className="h-[48px] sm:h-[58px] w-auto object-contain -ml-2 order-1"
      />

      {/* Info blocks: mobile pe hidden + scrollable, bade screens pe normal row */}
      <div className="hidden md:flex justify-between gap-4 mt-6 order-2 overflow-x-auto overflow-hidden overflow-x-hidden">
        <div className="h-8 w-24 lg:w-32 flex flex-col shrink-0">
          <span className="text-xs font-semibold text-gray-500">Product</span>
          <span className="text-sm font-semibold text-gray-700">Fabric Type</span>
        </div>
        <div className="h-8 w-24 lg:w-32 flex flex-col shrink-0">
          <span className="text-xs font-semibold text-gray-500">Amount</span>
          <span className="text-sm font-semibold text-gray-700">Total Fabric</span>
        </div>
        <div className="h-8 w-24 lg:w-32 flex flex-col shrink-0">
          <span className="text-xs font-semibold text-gray-500">First Item</span>
          <span className="text-sm font-semibold text-gray-700">First Batch Date</span>
        </div>
        {/* <div className="h-8 w-24 lg:w-32 flex flex-col shrink-0">
          <span className="text-xs font-semibold text-gray-500">Last Item</span>
          <span className="text-sm font-semibold text-gray-700">Last batch Date</span>
        </div> */}
      </div>

      <div className="flex gap-3 sm:gap-4 sm:p-4 order-3 ml-auto sm:ml-0">
        <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] border rounded-full flex items-center justify-center border-gray-400">
          <Search className="text-gray-500 cursor-pointer" size={20} />
        </div>

        <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] border rounded-full flex items-center justify-center border-gray-400">
          <SquareUser className="text-gray-500 cursor-pointer" size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;