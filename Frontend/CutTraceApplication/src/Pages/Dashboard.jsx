import ProductionOverview from "../Cards/ProductionOverview";
import Navbar from "../components/Navbar";
import ProductionAnalytics from "../Cards/ProductionAnalytics";
import Sidebar from "../components/Sidebar";
import InspectionRecords from "../components/InspectionRecords";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#EEF1FA]">
      

      <div className=" min-w-0 bg-[#EEF1FA] p-3 pt-16 sm:pt-6 sm:p-6 lg:p-10">
        <div className="bg-[#EEF1FB] shadow-2xl rounded-2xl p-4 sm:p-6">
          {/* NavBar */}
          <Navbar />
          {/* Production Dashboard */}
          <ProductionOverview />
          {/* ProductionAnalytics */}
          <ProductionAnalytics />
          {/* Inspection and History */}
          <InspectionRecords />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;