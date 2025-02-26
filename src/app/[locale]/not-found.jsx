import { Suspense } from "react";
import PageNotFound from "./Components/NotFound";




export default function NotFoundPage() {
  return (  
    <Suspense fallback='Loading...'>
    <PageNotFound/>
 </Suspense>
  );
}
