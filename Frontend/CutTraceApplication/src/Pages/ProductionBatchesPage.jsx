import { useEffect, useState } from "react"
import {Search,Plus} from 'lucide-react'
import Navbar from "../components/Navbar"
import BatchesFormModal from "../Models/BatchesFormModal"
import BatchesTable from "../components/BatchesTable"

const dummyData = [
  { batch_id: 1, fabric_in_id: 1, current_stage: "Manufactured", current_status: "In Progress", created_at: "2024-12-01", updated_at: "2024-12-03" },
  { batch_id: 2, fabric_in_id: 2, current_stage: "Testing", current_status: "Pending", created_at: "2024-12-02", updated_at: null },
  { batch_id: 3, fabric_in_id: 3, current_stage: "Ready to Deliver", current_status: "Completed", created_at: "2024-12-03", updated_at: "2024-12-05" },
  { batch_id: 4, fabric_in_id: 4, current_stage: "Fabric In", current_status: "Pending", created_at: "2024-12-04", updated_at: null },
  { batch_id: 5, fabric_in_id: 5, current_stage: "Delivered", current_status: "Completed", created_at: "2024-12-05", updated_at: "2024-12-07" },
];
const PAGE_SIZE = 5;
const ProductionBatchesPage = () => {
    const [OpenAddbutton, setOpenAddbutton] = useState(false)
    const [data, setdata] = useState(dummyData)
    const [search, setsearch] = useState('')
    const [page, setPage] = useState(1);
    const [editingrow, seteditingrow] = useState(null)
    const [filtered, setfiltered] = useState("")
    const enableaddbutton=()=>{
        setOpenAddbutton(true)
    }

    const openEditFrom=(row)=>{
        seteditingrow(row)
        setOpenAddbutton(true)
    }
    const savehandler=(row)=>{
    if (editingrow){
        setdata()
    }
    }



    useEffect(() => {
        if (!search){
            setfiltered(data)
        }else{
            const q = search.toLowerCase();
            const resp= data.filter(
      (row) =>
        row.supplier_name.toLowerCase().includes(q) ||
        row.receiver_name.toLowerCase().includes(q) ||
        row.fabric_quality.toLowerCase().includes(q) ||
        row.color.toLowerCase().includes(q)
    );
    setfiltered(resp)
        }
    }, [data,search])
    // filtered is data after search
    const Paginated=filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  return (
    <div className='p-4 sm:p-6 bg-[#EEF1FB] shadow-2xl mx-4 my-6 sm:mx-12 sm:my-10 lg:mx-25 lg:my-15 rounded-2xl flex-1 w-full min-h-screen'>
        <Navbar />
        <div className="flex items-start justify-between gap-3 mb-5 mt-6">
            <h1 className="text-xl font-semibold text-slate-800 max-w-[45%] sm:max-w-none">Production Batches</h1>
            <button onClick={enableaddbutton} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 whitespace-nowrap shrink-0">
                <Plus size={16} />
                <span className="hidden sm:inline">Add Production Batch</span>
                <span className="sm:hidden">Add Batch</span>
            </button>
        </div>
        <div className="relative mb-4 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text"
            placeholder="Search by Batch Id,Current status etc.."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400"
            value={search}
            onChange={(e)=>{
                setsearch(e.target.value)
                setPage(1)
            }}
             />
        </div>

        <BatchesFormModal
        isopen={OpenAddbutton}
        onclose={()=>setOpenAddbutton(false)}
        initialdata={editingrow}
         />
         <BatchesTable rows={Paginated} onedit={openEditFrom}/>

    </div>
  )
}

export default ProductionBatchesPage