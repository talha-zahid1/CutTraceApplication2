const STATUS_STYLES = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Pending: "bg-slate-100 text-slate-600",
};

function statusStyle(status) {
  return STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
}

const ProductionOverview = () => {
  // dummy for now — will come from an API later, same "Production Status" tile
  const productionStatus = "Completed";

  return (
    <div className="w-full min-w-0 overflow-hidden">

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl m-4 sm:m-5 font-semibold text-black">
        Current Production
      </h1>

      {/* Cards */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-3
          sm:gap-4
          mt-3
          px-4
          sm:px-5
          w-full
          min-w-0
        "
      >

        {/* Production Status */}
        <div
          className="
            h-[90px]
            sm:h-[100px]
            min-w-0
            bg-[#F4F5F7]
            rounded-2xl
            
            p-3
            sm:p-4
            cursor-pointer
            transition-all
            duration-200
            hover:-translate-y-1
            overflow-hidden
            flex
            flex-col
            justify-center
            gap-2
          "
        >
          <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600 truncate">
            Production Status
          </span>
          <span
            className={`self-start text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full ${statusStyle(productionStatus)}`}
          >
            {productionStatus}
          </span>
        </div>

        {/* Total Wastage */}
        <div
          className="
            h-[90px]
            sm:h-[100px]
            min-w-0
            bg-[#F4F5F7]
            rounded-2xl
            
            p-3
            sm:p-5
            flex
            flex-col
            justify-center
            transition-all
            duration-200
            hover:-translate-y-1
            cursor-pointer
            overflow-hidden
          "
        >
          <span
            className="
              text-sm
              sm:text-base
              lg:text-lg
              font-semibold
              text-gray-600
              truncate
            "
          >
            Total Wastage %
          </span>

          <span
            className="
              text-sm
              sm:text-base
              lg:text-lg
              pl-1
              font-semibold
              text-gray-600
            "
          >
            70%
          </span>
        </div>

        {/* Production Efficiency */}
        <div
          className="
            h-[90px]
            sm:h-[100px]
            min-w-0
            bg-[#F4F5F7]
            rounded-2xl
            
            p-3
            sm:p-5
            flex
            flex-col
            justify-center
            transition-all
            duration-200
            hover:-translate-y-1
            cursor-pointer
            overflow-hidden
          "
        >
          <span
            className="
              text-sm
              sm:text-base
              lg:text-lg
              font-semibold
              text-gray-600
              truncate
            "
          >
            Production Efficiency %
          </span>

          <span
            className="
              text-sm
              sm:text-base
              lg:text-lg
              pl-1
              font-semibold
              text-gray-600
            "
          >
            70%
          </span>
        </div>

        {/* Testing Pass */}
        <div
          className="
            h-[90px]
            sm:h-[100px]
            min-w-0
            bg-[#F4F5F7]
            rounded-2xl
            
            p-3
            sm:p-5
            flex
            flex-col
            justify-center
            transition-all
            duration-200
            hover:-translate-y-1
            cursor-pointer
            overflow-hidden
          "
        >
          <span
            className="
              text-sm
              sm:text-base
              lg:text-lg
              font-semibold
              text-gray-600
              truncate
            "
          >
            Testing Pass %
          </span>

          <span
            className="
              text-sm
              sm:text-base
              lg:text-lg
              pl-1
              font-semibold
              text-gray-600
            "
          >
            70%
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProductionOverview;