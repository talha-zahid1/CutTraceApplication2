import {Route,Routes} from 'react-router-dom'
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import FabricInPage from './Pages/FabricInPage'
import ProductionBatchesPage from './Pages/ProductionBatchesPage';
import Sidebar from './components/Sidebar';

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
