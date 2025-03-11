import { useState } from "react";
import Link from "next/link";
import { useSiteContext } from "../Context/siteContext";
import { getTranslation, siteName } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import { useParams, useRouter } from "next/navigation";

const ViewMoreLess = ({ items, footerNavigation }) => {
  const params = useParams();
  const locale = params.locale;

  const [showAll, setShowAll] = useState(false);
  const limit = 5;

  const { showMegaMenu, setShowMegaMenu } = useSiteContext();

  const { translation } = useLanguageContext();

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="grid gap-4">
      <ul className="grid gap-3 [&>*]:font-light [&>a]:hover:text-primary [&>*]:transition-all [&>*]:text-[14px]">
        {items &&
          items.slice(0, showAll ? items.length : limit).map((item, index) => (
            <li key={index}>
              {footerNavigation ? (
                <Link onClick={(e) => setShowMegaMenu(false)} href={item.link}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.text,
                    }}
                  />
                </Link>
              ) : (
                <Link onClick={(e) => setShowMegaMenu(false)} href={item.link}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.text,
                    }}
                  />
                </Link>
              )}
            </li>
          ))}
      </ul>

      {items.length > limit && (
        <button
          onClick={handleToggle}
          className="text-primary font-light text-start uppercase text-[10px] mb-4"
        >
          {showAll
            ? getTranslation(
                translation[0]?.translations,
                "View less",
                locale || "en"
              )
            : getTranslation(
                translation[0]?.translations,
                "View all",
                locale || "en"
              )}
        </button>
      )}
    </div>
  );
};

export default ViewMoreLess;
