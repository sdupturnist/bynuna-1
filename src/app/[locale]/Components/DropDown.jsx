"use client";

import Link from "next/link";
import { homeUrl } from "../Utils/variables";
import Button from "./Button";

export default function DropDown({color, action, button, items, label, icon, component }) {


  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  if(button){
  return (
<div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className={`flex gap-1 text-${color && color}`}>
     {label} {icon && icon}
    </div>
    <ul
      tabIndex={0}
      className="min-w-[200px] dropdown-content p-0 menu bg-white rounded-0 z-[1] shadow-sm border border-border">
      {items &&
        items.map((item, index) => (
          <li key={index} onClick={handleClick}>
            <Button small onClick={action} label={item?.label || item?.title || item?.title?.rendered}/>
          </li>
        ))}
      {component && <li>{component}</li>}
    </ul>
  </div>
  )
}
else{
  return (
    <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button">
      {!icon ? label : icon}
    </div>
    <ul
      tabIndex={0}
      className="min-w-[200px] dropdown-content p-0 menu bg-white rounded-0 z-[1] shadow-sm border border-border">
      {items &&
        items.map((item, index) => (
          <li key={index} onClick={handleClick}>
            <Link href={`${homeUrl}${item?.url}`}>{item?.label || item?.title || item?.title?.rendered}</Link>
          </li>
        ))}
      {component && <li>{component}</li>}
    </ul>
  </div>
  )
  
}
}
