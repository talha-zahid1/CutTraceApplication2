import {Layers,X,Truck,Plus,Trash2} from 'lucide-react'
import { useEffect, useState } from 'react';

const emptyForm = {
  "fabric_in_ids": [""],
  "current_stage": "",
  "current_status": "",
};

// Status k liye fixed options - backend model mai 'choices' define nahi,
// is liye consistency yahin frontend se enforce kar rahe hain taake user
// free-text type na kare aur misspelling na ho.
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];

const BatchesFormModal = ({isopen,onclose,initialdata,onsave}) => {
  const [form, setform] = useState(emptyForm)
  const isedit=Boolean(initialdata)

  useEffect(() => {
    setform(initialdata?{...emptyForm,...initialdata}:emptyForm)
  }, [initialdata])

  const handlechange=(field,value)=>{
    setform((prev)=>({...prev,[field]:value}))
  }

  // fabric_in_ids ek array hai (multiple fabric_in entries aik batch mai),
  // is liye inky liye alag se chota set of handlers - index k through
  // specific row ko update/remove karte hein.
  const handleFabricIdChange=(index,value)=>{
    setform((prev)=>{
      const updated=[...prev.fabric_in_ids]
      updated[index]=value
      return {...prev,fabric_in_ids:updated}
    })
  }

  const addFabricIdField=()=>{
    setform((prev)=>({...prev,fabric_in_ids:[...prev.fabric_in_ids,""]}))
  }

  const removeFabricIdField=(index)=>{
    setform((prev)=>({
      ...prev,
      fabric_in_ids:prev.fabric_in_ids.filter((_,i)=>i!==index)
    }))
  }

  const submithandler=(e)=>{
    e.preventDefault();

    // TODO: API CALL HERE
    // if (isedit) {
    //   fetch(`/api/production/batches/${initialdata.batch_id}/`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(form),
    //   }).then((res) => res.json()).then((res) => { if (res.status) onsave(form); });
    // } else {
    //   fetch("/api/production/batches/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(form),
    //   }).then((res) => res.json()).then((res) => { if (res.status) onsave(form); });
    // }

    onsave(form);
  }

  if (!isopen) return null;
  return (
    <div className='fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center gap-3 px-6 py-5 border-b border-slate-100'>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
        <Layers size={18} className="text-blue-500" />
      </div>
        <div className='flex-1'>
          <h3 className="text-slate-800 font-semibold text-base">
            {isedit ? "Edit Batch Entry":"Add Batches Entry"}
          </h3>
        <p  className="text-xs text-slate-400">
          {isedit ? "Update the details below":"Fill in the production batch details"}
        </p>
        </div>
        <button onClick={onclose}>
          <X size={18} />
        </button>
        </div>
      <form onSubmit={submithandler} className="px-6 py-5 space-y-6">

        <Section icon={Layers} label="Fabric In Entries">
          <div className='space-y-2.5'>
            {form.fabric_in_ids.map((id,index)=>(
              <div key={index} className='flex items-center gap-2'>
                <div className='flex-1'>
                  <input type="text"
                  required
                  placeholder={`Fabric In ID #${index+1}`}
                  className="input"
                  value={id}
                  onChange={(e)=>handleFabricIdChange(index,e.target.value)}
                  />
                </div>
                {form.fabric_in_ids.length>1 && (
                  <button
                  type="button"
                  onClick={()=>removeFabricIdField(index)}
                  className='p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0'
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
          type="button"
          onClick={addFabricIdField}
          className='mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600'
          >
            <Plus size={14} /> Add another Fabric In
          </button>
        </Section>

        <Section icon={Truck} label="Batch Details">
          <div className='grid grid-cols-2 gap-5'>
          <Field label="Current Stage" >
            <input type="text"
            required
            value={form.current_stage}
            onChange={(e)=>handlechange("current_stage",e.target.value)}
            className='input'
            />
          </Field>
          <Field label="Status" >
            <select
            required
            value={form.current_status}
            onChange={(e)=>handlechange("current_status",e.target.value)}
            className='input'
            >
              <option value="">Select status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </Field>
          </div>
        </Section>
        <div className='flex justify-end gap-2'>
          {/* type="button" is important here — this button is inside a
              <form>, so without it, clicking Cancel would ALSO trigger
              the form's submit (browser default button type is "submit"). */}
          <button
          type="button"
          className='px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50'
          onClick={onclose}
          >Cancel</button>

          <button type='submit'  className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200'>
            <Truck size={15} />
            {isedit?"Save Changes":"Add Batch"}
          </button>
        </div>
      </form>
      </div>

      <style>
        {`.input{
          width:100%;
          border:1px solid #e2e8f0;
          border-radius:0.5rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #334155;
          background: #f8fafc;
        }
          .input:focus {
          outline: none;
          background: #fff;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.15);
        }
        `}
      </style>

      </div>
  )
}
function Section({ icon: Icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon size={13} className="text-slate-400" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default BatchesFormModal