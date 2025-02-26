
import ChangePasswordForm from "../../Components/Forms/ChangePasswordForm";

export default function ChangePassword() {
  return (
    <div className="bg-bggray">
      <section className="pb-0 pt-0">
        <div className="sm:bg-transparent max-w-[999px] mx-auto grid sm:gap-6 gap-3">
          <div className="card-rounded-none-small w-full bg-white py-4">
            <ChangePasswordForm />
          </div>
        </div>
      </section>
    </div>
  );
}
