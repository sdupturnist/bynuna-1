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
        <p
          dangerouslySetInnerHTML={{
            __html: contactData?.acf?.address,
          }}
        />
        <Link href={`tel:${contactData?.acf?.phone}`}>
          {" "}
          {contactData?.acf?.phone}
        </Link>
        <Link href={`mailto:${contactData?.acf?.email}`}>
          {contactData?.acf?.email}
        </Link>
        {contactData?.acf?.working_time ? <p>{contactData?.acf?.working_time}</p> : null}
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
