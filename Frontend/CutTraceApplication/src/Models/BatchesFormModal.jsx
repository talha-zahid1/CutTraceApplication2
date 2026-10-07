import {Layers,X,Truck} from 'lucide-react'
import { useEffect, useState } from 'react';

const emptyForm = {
  "fabric_in_id": "",
  "current_stage": "",
  "current_status": "",
};

const BatchesFormModal = ({isopen,onclose,initialdata,onsave}) => {
  const [form, setform] = useState(emptyForm)
  const isedit=Boolean(initialdata)

  useEffect(() => {
    setform(initialdata?{...emptyForm,...initialdata}:emptyForm)
  }, [initialdata])

  const handlechange=(field,value)=>{
    setform((prev)=>({...prev,[field]:value}))
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

        <Section icon={Layers} label="Batch Details">
          <div className='grid grid-cols-2 gap-5'>
            <Field label="Fabric In ID" >
            <input type="text"
            required
            className="input"
            value={form.fabric_in_id}
            onChange={(e)=>handlechange("fabric_in_id",e.target.value)}
            />
          </Field>
          <Field label="Current Stage" >
            <input type="text"
            required
            value={form.current_stage}
            onChange={(e)=>handlechange("current_stage",e.target.value)}
            className='input'
            />
          </Field>
          <Field label="Status" >
            <input type="text"
            required
            value={form.current_status}
            onChange={(e)=>handlechange("current_status",e.target.value)}
            className='input'
            />
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