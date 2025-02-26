"use client";
import SectionHeader from "./SectionHeader";
import AddNewAddressForm from "./Forms/AddNewAddress";
import { useSiteContext } from "../Context/siteContext";
import { useLanguageContext } from "../Context/LanguageContext";
import { getTranslation, siteName } from "../Utils/variables";
import { useParams, useRouter } from "next/navigation";

export default function AddNewAddress({ onAddressAdded,  }) {

    const router = useRouter();
   const params = useParams();  
   const locale = params.locale; 

  const { showNewAddress, setShowNewAddress } = useSiteContext();


  const { translation } = useLanguageContext();

  
  return (
    <>
      <div>
        <button
          className="btn btn-mobile-full"
          onClick={() => setShowNewAddress(!showNewAddress)} // Toggle logic corrected
        >
          {getTranslation(
            translation[0]?.translations,
            "Add a new address",
            locale || 'en'
          )}
        </button>
      </div>
      {showNewAddress && (
        <div className="grid mt-5 b">
          <div>
            <SectionHeader title="Add new address" card />
          </div>
          <div className="card-rounded-none-small bg-white">
            <AddNewAddressForm onAddressAdded={onAddressAdded} />
          </div>
        </div>
      )}
    </>
  );
}
