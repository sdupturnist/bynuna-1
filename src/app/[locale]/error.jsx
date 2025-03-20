'use client'

import { Suspense } from "react";
import Page500 from "./Components/Page500";



export default function ErrorBoundary({ error, reset }) {

  return (

       <Suspense fallback='Loading...'>
        <Page500/>
     </Suspense>


  );
}
