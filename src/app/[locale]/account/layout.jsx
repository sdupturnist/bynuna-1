// AccountLayout.js
"use client";

import AccountHeader from "../Components/AccountHeader";
import PageHeader from "../Components/PageHeader";
import ProfileMenu from "../Components/ProfileMenu";
import SectionHeader from "../Components/SectionHeader";
import { useAuthContext } from "../Context/authContext";

import { useParams, usePathname } from "next/navigation";
import withAuth from "../Utils/withAuth";
import LoadingItem from "../Components/LoadingItem";
import { getTranslation } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";

function AccountLayout({ children }) {
  const pathname = usePathname();

  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  const { validUserTocken, userData } = useAuthContext();

  if (!validUserTocken) {
    return (
      <LoadingItem
        fullscreen
        message="You are not logged into your account. Please log in..."
      />
    );
  }

  return (
    <section className="bg-light lg:bg-white pt-0 pb-0">
      <div className="p-0 lg:pb-10">
        <PageHeader
          locale={locale}
          title="My account"
          account
          data={userData}
        />
        <div className="max-w-[999px] mx-auto grid sm:gap-12 gap-5 lg:mt-10">
          <div className="lg:flex grid lg:gap-x-10">
            <aside className="lg:w-[35%] lg:order-first order-last w-full bg-white">
              <ProfileMenu locale={locale} />
            </aside>
            <div className="w-full lg:order-last order-first mx-auto  bg-white p-5 lg:p-0">
              <div>
                <SectionHeader
                  locale={locale}
                  title={
                    pathname.includes("account/address/edit")
                      ? getTranslation(
                          translation[0]?.translations,
                          "Edit Address",
                          locale || "en"
                        )
                      : pathname?.split("/").pop()?.replace(/-/g, " ")
                  }
                />
              </div>
              <div className="sm:pt-3">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Wrap the AccountLayout with withAuth HOC
export default withAuth(AccountLayout);

//export default AccountLayout
