"use client";

import Link from "next/link";
import { useAuthContext } from "../Context/authContext";
import { getTranslation, homeUrl, siteName } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { userData } = useAuthContext();

  const { translation } = useLanguageContext();

  return (
    <div className="bg-bggray">
      <section className="sm:pb-5 pb-0 pt-3">
        <div>
          <div className="sm:bg-transparent max-w-[999px] mx-auto">
            <p className="font-semibold mb-3">
              {getTranslation(
                translation[0]?.translations,
                "Hello",
                locale || "en"
              )}{" "}
              {userData && userData?.first_name}
            </p>
            <p>
              {getTranslation(
                translation[0]?.translations,
                "From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.",
                locale || "en"
              )}
            </p>
            <Link href={`${homeUrl}`} className="btn btn-mobile-full mt-5">
              {getTranslation(
                translation[0]?.translations,
                "Continue to shopping",
                locale || "en"
              )}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
