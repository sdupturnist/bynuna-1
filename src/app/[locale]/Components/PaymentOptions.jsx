"use client";

import Images from "./Images";

export default function PaymentOptions() {
  return (
    <ul className="flex gap-[8px] [&>*]:bg-white [&>*]:w-[40px] [&>*]:overflow-hidden ">
      <li>
        <Images
          imageurl="/images/payment_01.svg"
          quality="100"
          width="30"
          height="20"
          alt="Payment card"
          classes="block w-full w-[35px]"
          placeholder={true}
        />
      </li>
      <li>
        <Images
          imageurl="/images/payment_02.svg"
          quality="100"
          width="30"
          height="20"
          alt="Payment card"
          classes="block w-full w-[35px]"
          placeholder={true}
        />
      </li>
      <li>
        <Images
          imageurl="/images/payment_03.svg"
          quality="100"
          width="30"
          height="20"
          alt="Payment card"
          classes="block w-full w-[35px]"
          placeholder={true}
        />
      </li>
      <li>
        <Images
          imageurl="/images/payment_04.svg"
          quality="100"
          width="30"
          height="20"
          alt="Payment card"
          classes="block w-full w-[35px]"
          placeholder={true}
        />
      </li>
      <li>
        <Images
          imageurl="/images/payment_05.svg"
          quality="100"
          width="30"
          height="20"
          alt="Payment card"
          classes="block w-full w-[35px]"
          placeholder={true}
        />
      </li>
    </ul>
  );
}
