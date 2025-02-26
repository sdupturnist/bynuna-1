"use client";

import SectionHeader from "./SectionHeader";
import { XMarkIcon } from "@heroicons/react/24/solid";


export default function ModalPopup({ title, item, titleCenter, action, actionLabel, noPadding, noButton }) {
  return (

    
    <dialog id="modal_all" className="modal">
      <div className="modal-box">
        <span onClick={(e)=> document.getElementById("modal_all").close()} className="cursor-pointer block absolute right-4 top-4">
          <XMarkIcon className="size-4"/>
        </span>
        <div className={`${noPadding ? '' : 'sm:p-5 p-3'}`}>
          <SectionHeader title={title} titleSmall titleCenter={titleCenter && titleCenter} />
          {item}
         {!noButton && <button className="w-full btn btn-large btn-light mt-5" onClick={action}>{actionLabel}</button>}
        </div>
      </div>
   
    </dialog>
  );
}
