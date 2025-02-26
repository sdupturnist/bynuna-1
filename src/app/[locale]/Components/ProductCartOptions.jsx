"use client";

export default function ProductCartOptions({ data }) {


  return (
    data &&   
    <div className="product-cart-options">
        <small>Select</small>
        <ul className="select-options">
          {data &&
            data.map((item, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                   className="checkbox  checkbox-success checkbox-sm"
                />
                <label>{item?.item}</label>
              </li>
            ))}
        </ul>
      </div>
  
  );
}
