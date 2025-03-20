"use client";

import Link from "next/link";
import {
  copyright,
  getTranslation,
  homeUrl,
  siteLogo,
  siteName,
  year,
} from "../Utils/variables";
import SocialIcons from "./SocialIcons";
import { useSiteContext } from "../Context/siteContext";
import Accordion from "./Accordion";
import Images from "./Images";
import { useLanguageContext } from "../Context/LanguageContext";
import { useRouter } from "next/navigation";
import { DivideIcon } from "@heroicons/react/20/solid";

export default function Footer({ locale }) {
  const { contactData, footerMenu, footerMenuPages } = useSiteContext();

  const topLevelItems =
    footerMenu && footerMenu?.items?.filter((item) => item.parent === "0");

  const topLevelItemsPages =
    footerMenuPages &&
    footerMenuPages?.items?.filter((item) => item.parent === "0");

  function getSubCategoriesByParentId(data, parentId) {
    return data && data?.filter((item) => item.parent === parentId);
  }

  const { translation } = useLanguageContext();

  return (
    <>
      <footer>
        <div className="bg-primary spacing-normal">
          <div className="container">
            <div className="mx-auto max-w-[767px]">
              <div className="flex items-center justify-between sm:gap-5 gap-3">
                <div className="w-full  items-center sm:gap-3 gap-4 sm:inline-flex grid text-center">
                  <div className="sm:min-w-[60px] sm:min-h-[60px] min-w-[50px] min-h-[50px] mx-auto sm:m-0 rounded-[100px] border border-white/20 justify-center items-center gap-2.5 flex">
                    <Images
                      imageurl="/images/fast_shipping.png"
                      quality="100"
                      width="24"
                      height="24"
                      alt="Fastest shipping"
                      title="Fastest shipping"
                      classes="block w-[24px]"
                      placeholder={true}
                    />
                  </div>
                  <div className="sm:text-start text-center text-white sm:text-[13px] text-[11px] font-normal  uppercase leading-snug tracking-widest">
                    {getTranslation(
                      translation[0]?.translations,
                      "Fastest shipping",
                      locale || "en"
                    )}
                  </div>
                </div>
                <div className="w-full  items-center sm:gap-3 gap-4 sm:inline-flex grid text-center">
                  <div className="sm:min-w-[60px] sm:min-h-[60px] min-w-[50px] min-h-[50px] mx-auto sm:m-0 rounded-[100px] border border-white/20 justify-center items-center gap-2.5 flex">
                    <Images
                      imageurl="/images/100k.png"
                      quality="100"
                      width="24"
                      height="24"
                      alt="Fastest shipping"
                      title="Fastest shipping"
                      classes="block w-[20px]"
                      placeholder={true}
                    />
                  </div>
                  <div className="sm:text-start text-center text-white sm:text-[13px] text-[11px] font-normal  uppercase leading-snug tracking-widest">
                    {getTranslation(
                      translation[0]?.translations,
                      "100k products",
                      locale || "en"
                    )}
                  </div>
                </div>
                <div className="w-full  items-center sm:gap-3 gap-4 sm:inline-flex grid text-center">
                  <div className="sm:min-w-[60px] sm:min-h-[60px] min-w-[50px] min-h-[50px] mx-auto sm:m-0 rounded-[100px] border border-white/20 justify-center items-center gap-2.5 flex">
                    <Images
                      imageurl="/images/gcc_map.png"
                      quality="100"
                      width="20"
                      height="20"
                      alt="Fastest shipping"
                      title="Fastest shipping"
                      classes="block w-[20px]"
                      placeholder={true}
                    />
                  </div>
                  <div className="sm:text-start text-center text-white sm:text-[13px] text-[11px] font-normal  uppercase leading-snug tracking-widest">
                    {getTranslation(
                      translation[0]?.translations,
                      "Latest in GCC",
                      locale || "en"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container spacing-normal">
          <div className="md:flex grid justify-between items-start sm:pb-12 pb-5 sm:gap-[50px] gap-[20px]">
            <div className="grid gap-2 md:border-none sm:order-1 order-2 sm:border-b sm:border-t-0 border-t border-border sm:pt-0 pt-4 sm:pb-10 md:pb-0">
              <div className="footer-logo">
                <Link href={homeUrl} className="block">
                  <Images
                    imageurl={siteLogo}
                    quality="100"
                    width="150"
                    height="50"
                    title={siteName}
                    alt={siteName}
                    classes="block sm:h-[70px] min-w-[100px] object-contain mb-2"
                    placeholder={true}
                  />
                </Link>
              </div>

              <p
                dangerouslySetInnerHTML={{
                  __html: contactData?.acf?.address,
                }}
              />

              <Link href={`tel:${contactData?.acf?.phone}`}>
                {getTranslation(
                  translation[0]?.translations,
                  "Phone.",
                  locale || "en"
                )}{" "}
                {contactData?.acf?.phone}
              </Link>
              <Link href={`mailto:${contactData?.acf?.email}`}>
                {getTranslation(
                  translation[0]?.translations,
                  "Email.",
                  locale || "en"
                )}{" "}
                {contactData?.acf?.email}
              </Link>
              <div className="mt-3">
                <SocialIcons
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
            <div className="sm:flex grid flex-wrap sm:gap-[50px] gap-[20px]  sm:order-2 order-1">
              {topLevelItems &&
                topLevelItems?.map((category, index) => (
                  <div key={index}>
                    <div className="min-w-[200px] w-full sm:w-auto">
                      <Accordion
                        navigation
                        items={[
                          {
                            haveUrl: category?.acf?.no_url,
                            title:
                              locale === "en"
                                ? category?.title
                                : category?.acf?.arabic
                                ? category?.acf?.arabic
                                : category?.title,
                            content: getSubCategoriesByParentId(
                              footerMenu?.items,
                              String(category?.id)
                            )?.map((subCategory, childIndex) => ({
                              text:
                                locale === "en"
                                  ? subCategory?.title
                                  : subCategory?.acf?.arabic
                                  ? subCategory?.acf?.arabic
                                  : subCategory?.title,
                              link: `${homeUrl}${locale}/products/${
                                subCategory?.url?.split("/").slice(-2, -1)[0]
                              }/`,
                            })),
                          },
                        ]}
                      />
                    </div>
                  </div>
                ))}

              {topLevelItemsPages &&
                topLevelItemsPages?.map((category, index) => (
                  <div key={index}>
                    <div className="min-w-[200px] w-full sm:w-auto">
                      <Accordion
                        navigation
                        footerNavigation
                        items={[
                          {
                            haveUrl: category?.acf?.no_url,
                            title:
                              locale === "en"
                                ? category?.title
                                : category?.acf?.arabic
                                ? category?.acf?.arabic
                                : category?.title,
                            content: getSubCategoriesByParentId(
                              footerMenuPages?.items,
                              String(category?.id)
                            )?.map((subCategory, childIndex) => ({
                              text:
                                locale === "en"
                                  ? subCategory?.title
                                  : subCategory?.acf?.arabic
                                  ? subCategory?.acf?.arabic
                                  : subCategory?.title,
                              link: `${homeUrl}${locale}/${subCategory?.url
                                .replace(/%20/g, " ")
                                .split("/")
                                .pop()
                                .toLowerCase()
                                .replace(/\s+/g, "-")}/`,
                            })),
                          },
                        ]}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="sm:text-center sm:py-8 py-3 border-t border-border">
            <p>
              ©{" "}
              {`${year} ${getTranslation(
                translation[0]?.translations,
                "bynuna",
                locale || "en"
              )} ${getTranslation(
                translation[0]?.translations,
                "All rights reserved",
                locale || "en"
              )}`}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
