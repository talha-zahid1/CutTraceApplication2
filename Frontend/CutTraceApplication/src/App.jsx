import {Route,Routes} from 'react-router-dom'
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import FabricInPage from './Pages/FabricInPage'
import ProductionBatchesPage from './Pages/ProductionBatchesPage';
import ReadyToManufacturePage from './Pages/ReadyToManufacturePage'
import Sidebar from './components/Sidebar';
import ManufacturingPage from './Pages/ManufacturingPage'
import SuspiciousProductsPage from './Pages/SuspiciousProductsPage';
import ReadyToDeliverPage from './Pages/ReadyToDeliverPage'
import DeliveredProductsPage from './Pages/DeliveredProductsPage'
import ProductionStandardsPage from './Pages/ProductionStandardsPage'
import OverallProductionReportPage from './Pages/OverallProductionReportPage'
import SuspiciousProductsReportPage from './Pages/SuspiciousProductsReportPage'
import DeliveredProductsReportPage from './Pages/DeliveredProductsReportPage'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route 
        path='*'
        element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/fabricin" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <FabricInPage /></div>} />
                  <Route path="/productionbatches" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <ProductionBatchesPage /></div>} />
                  <Route path="/ready-to-manufacture" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <ReadyToManufacturePage /></div>} />
                  <Route path="/manufacturing" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <ManufacturingPage /></div>} />
                  <Route path="/manufacturing" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <ManufacturingPage /></div>} />
                  <Route path="/suspicious-products" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <SuspiciousProductsPage /></div>} />
                  <Route path="/ready-to-deliver" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <ReadyToDeliverPage /></div>} />
                  <Route path="/delivered-products" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <DeliveredProductsPage /></div>} />
                  <Route path="/standards" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <ProductionStandardsPage /></div>} />
                  {/* Reports */}
                  <Route path="/reports/overall-production" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <OverallProductionReportPage /></div>} />
                  <Route path="/reports/suspicious-products" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <SuspiciousProductsReportPage /></div>} />
                  <Route path="/reports/delivered-products" element={<div className="min-h-screen w-full flex bg-[#EEF1FA]"> <DeliveredProductsReportPage /></div>} />
                </Routes>
              </main>
            </div>
        }
        />
      </Routes>
    </div>  
  );
};

export default App;
