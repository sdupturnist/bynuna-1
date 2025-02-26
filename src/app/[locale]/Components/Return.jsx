


"use client";

import Link from "next/link";
import { homeUrl } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";



export default function Return() {


  const router = useRouter();
   const params = useParams();  
   const locale = params.locale; 


  return (
    <Link href={`${homeUrl}${locale}/account/return`} className="btn btn-medium btn-light">Return</Link>
  );
}
