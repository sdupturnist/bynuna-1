
'use client'
import { useEffect, useState } from "react";
import Alerts from "../../Components/Alerts";
import Card from "../../Components/Card";
import LoadingItem from "../../Components/LoadingItem";
import { useSiteContext } from "../../Context/siteContext";
import { useParams } from "next/navigation";
import { apiUrl } from "../../Utils/variables";

export default function WishList() {
  const params = useParams();
  const locale = params.locale;
  const { activeWishlist } = useSiteContext();

  const [mainCategoriesData, setMainCategoriesData] = useState([]);
  const [subCategoriesData, setSubCategoriesData] = useState([]);
  const [childCategoriesData, setChildCategoriesData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mainResponse = await fetch(
          `${apiUrl}/wp-json/custom/v1/main-categories-data/?per_page=1000`,
          { next: { revalidate: 60 } }
        );
        const mainData = await mainResponse.json();
        setMainCategoriesData(mainData);

        const subResponse = await fetch(
          `${apiUrl}/wp-json/custom/v1/sub-categories-data/?per_page=1000`,
          { next: { revalidate: 60 } }
        );
        const subData = await subResponse.json();
        setSubCategoriesData(subData);

        const childResponse = await fetch(
          `${apiUrl}/wp-json/custom/v1/child-categories-data/?per_page=1000`,
          { next: { revalidate: 60 } }
        );
        const childData = await childResponse.json();
        setChildCategoriesData(childData);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Helper functions to filter by ID
  const mainCatById = (id) => {
    return mainCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const subCatById = (id) => {
    return subCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const childCatById = (id) => {
    return childCategoriesData.filter((item) => item.id === parseInt(id));
  };

  // Function to get category value or return an empty string if not found
  const getCategorySlug = (metaKey, categoriesData) => {
    const category = activeWishlist?.map((item) =>
      item?.meta_data?.find((meta) => meta.key === metaKey)
    );
    return category?.[0]?.value
      ? categoriesData.filter((item) => item.id === parseInt(category[0]?.value))
          ?.slug || ''
      : '';
  };

  return (
    <div className="bg-bggray">
      <section className="pb-0 sm:pt-0 pt-3">
        <div className="sm:bg-transparent max-w-[999px] mx-auto">
          <div>
            {loading ? (
              <div className="h-[50vh] flex items-center justify-center">
                <LoadingItem spinner />
              </div>
            ) : activeWishlist && activeWishlist?.length === 0 ? (
              <Alerts
                status="red"
                noPageUrl
                title="No wishlist data available"
              />
            ) : (
              <ul className="grid gap-5">
                <div className="grid gap-3 sm:gap-0 w-full lg:order-2 order-first">
                  <div className="section-header-card">
                    <div className="wish-list">
                      {/* Render based on your condition */}
                      {activeWishlist &&
                        activeWishlist.map((item, index) => (
                          <Card
                            type="product"
                            key={index}
                            data={item}
                            locale={locale}
                            mainCategoryName={getCategorySlug(
                              "main_categories_new",
                              mainCategoriesData
                            )}
                            subCategoryName={getCategorySlug(
                              "sub_categories_new",
                              subCategoriesData
                            )}
                            childCategoryName={getCategorySlug(
                              "child_categories_new",
                              childCategoriesData
                            )}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
