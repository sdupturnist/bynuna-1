"use client";

import Link from "next/link";
import { useSiteContext } from "../Context/siteContext";
import SocialIcons from "./SocialIcons";
import { useEffect, useState } from "react";

export default function ContactInfo() {
  const { contactData } = useSiteContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contactData && contactData[0]?.acf) {
      setLoading(false);
    }
  }, [contactData]);

  return (
    contactData && (
      <div className="grid gap-5">
        <p>{contactData?.acf?.address}</p>
        <Link href={`tel:${contactData?.acf?.phone}`}>
          {" "}
          {contactData?.acf?.phone}
        </Link>
        <Link href={`mailto:${contactData?.acf?.email}`}>
          {contactData?.acf?.email}
        </Link>
        <div className="mt-3">
          <SocialIcons
            center
            data={[
              {
                instagram: contactData?.acf?.instagram || "#",
              },
              {
                facebook: contactData?.acf?.facebook || "#",
              },
              {
                youtube: contactData?.acf?.youtube || "#",
              },
            ]}
          />
        </div>
      </div>
    )
  );
}
