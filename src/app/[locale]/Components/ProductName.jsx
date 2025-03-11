'use client'
import { useParams, useRouter } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation, siteName } from "../Utils/variables";


export default function ProductName({title}){


   const router = useRouter();
  const params = useParams();  
  const locale = params.locale; 

    const { translation } = useLanguageContext();


    return   <span
    dangerouslySetInnerHTML={{
      __html: getTranslation(
        translation[0]?.translations,
       title?.replace(/&amp;/g, "&"),
        locale || 'en'
      ),
    }}
  />
  

}