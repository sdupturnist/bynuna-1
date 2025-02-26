"use client";
import { CurrencyRupeeIcon, TruckIcon, HandThumbUpIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";

export default function FloatingIcons() {
  return (
    <ul className="floatig-icons">
      <li>
        <span>Secure Payment</span>
        <div className="icon">
          <CurrencyRupeeIcon />
        </div>
      </li>
      <li>
       <span> Free Shipping</span>
        <div className="icon">
          <TruckIcon />
        </div>
      </li>
      <li>
       <span> Money Back Guarantee</span>
        <div className="icon">
          <HandThumbUpIcon />
        </div>
      </li>
      <li>
        <span>24x7 Support</span>
        <div className="icon">
          <ChatBubbleOvalLeftIcon />
        </div>
      </li>
    </ul>
  );
}
