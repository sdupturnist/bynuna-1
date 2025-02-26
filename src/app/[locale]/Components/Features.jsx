'use client'

// import Images from "./Images"

import { CheckIcon, CheckCircleIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";


export default function Features({data}){

    return(
      data &&
        data.map((item, index) => (
        <span 
        key={index}
        className="features mr-2 mb-2">
            <CheckBadgeIcon className="size-[15px]"/>
            {item?.item}
        </span>
          ))
      
    )
}


 {/* <Images */}
              {/* imageurl={item?.icon || ''} */}
              {/* quality="100" */}
              {/* width="16" */}
              {/* height="16" */}
              {/* title={item?.title || 'Icon'} */}
              {/* alt={item?.title || 'Icon'} */}
              {/* classes="block size-[16px]" */}
              {/* placeholder={true} */}
            {/* /> */}
