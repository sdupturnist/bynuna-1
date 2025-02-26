
import ProfileMenu from "@/app/[locale]/Components/ProfileMenu";
import SectionHeader from "@/app/[locale]/Components/SectionHeader";
import AddNewAddress from "@/app/[locale]/Components/AddNewAddress";
import UpdateAddressForm from "@/app/[locale]/Components/Forms/UpdateAddress";
import AccountHeader from "@/app/[locale]/Components/AccountHeader";

export default function EditAddress() {
  return (
    <div className="bg-bggray">
      <section className="pb-0 sm:pt-0 pt-3">
        <div className="sm:bg-transparent max-w-[999px] mx-auto grid sm:gap-6 gap-3">
          <div className="card-rounded-none-small w-full bg-white">
            <UpdateAddressForm />
          </div>
        </div>
      </section>
    </div>
  );
}
