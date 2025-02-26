"use client";

export default function ListOptions({
  title,
  noButton,
  small,
  data,
  titleBold,
  checkbox
}) {


  return (
    <li className={`${small ? "list-options-small" : "list-options"} !gap-2`}>
      <div>
        <input
           type="radio"
          className="radio radio-success radio-sm"
          name="selected_address"
     
        />
        <label className={`${titleBold && "font-semibold"}`}>{title}</label>
      </div>
     </li>
  );
}
