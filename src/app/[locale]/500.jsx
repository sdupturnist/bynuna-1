import { Suspense } from "react";
import Page500 from "./Components/Page500";



export default function Custom500() {
  return (  
    <Suspense fallback='Loading...'>
    <Page500/>
 </Suspense>
  );
}
