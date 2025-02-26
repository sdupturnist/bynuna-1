

'use client'


import ModalPopup from "./ModalPopup"




export default function ModifyAddress({data}){

    return(
    <>
        <ModalPopup title="Are you sure?" titleCenter item={<div className="flex gap-3 items-center justify-center">
            <button className="btn btn-light min-w-32">Cancel</button><button className="btn btn-medium min-w-32">Yes</button>
            </div>}/>
        <div className="join mt-5">
        <button className="join-item btn-light btn-medium min-w-24">
             Edit 
           </button>
           <button className="join-item btn-light btn-medium min-w-24"  onClick={() => document.getElementById("modal_all").showModal()}>
             Remove 
           </button>
        </div>
    </>
        
    )
}


