//export const dynamic = "force-dynamic";

import { apiUrl, homeUrl } from "../Utils/variables";
import Alerts from "./Alerts";
import Card from "./Card";

export default async function ProductWrapper({ data, locale, type }) {
 
 
  //////GET CATEGORIES

  const fetchCategoryData = async (key) => {
    const categoryId = data?.meta_data?.find((item) => item.key === key)?.id;
    const response = await fetch(
      `${apiUrl}wp-json/wp/v2/${key}?id=${categoryId}&per_page=1`,
      {
        next: { revalidate: 60 },
      }
    );
    const [category] = await response.json();
    return category;
  };

  const mainCategory = await fetchCategoryData("main-categories");
  const subCategory = await fetchCategoryData("sub-categories");
  const childCategory = await fetchCategoryData("child-categories");

  return (
    <>
      {data?.length > 0 ? (
        data.length > 0 &&
        data &&
        data?.map((item, index) => (
          <Card
            type={type}
            key={index}
            data={item}
            locale={locale}
            mainCategoryName={mainCategory}
            subCategoryName={subCategory}
            childCategoryName={childCategory}
          />
        ))
      ) : (
        <Alerts
          title="Sorry, No products Found"
          noPageUrl
          center
          url={homeUrl}
          buttonLabel="Return to home"
        />
      )}
    </>
  );
}
