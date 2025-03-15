//export const dynamic = "force-dynamic";

import { apiUrl, homeUrl } from "../Utils/variables";
import Alerts from "./Alerts";
import Card from "./Card";

export default async function ProductWrapper({
  data,
  locale,
  type,
  searchParams,
  home
}) {
  let mainCategoriesData = await fetch(
    `${apiUrl}/wp-json/custom/v1/main-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let subCategoriesData = await fetch(
    `${apiUrl}/wp-json/custom/v1/sub-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  let childCategoriesData = await fetch(
    `${apiUrl}wp-json/custom/v1/child-categories-data/?per_page=1000`,
    {
      next: { revalidate: 60 },
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));

  const mainCatById = (id) => {
    return mainCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const subCatById = (id) => {
    return subCategoriesData.filter((item) => item.id === parseInt(id));
  };

  const childCatById = (id) => {
    return childCategoriesData.filter((item) => item.id === parseInt(id));
  };


 


  
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
            mainCategoryName={mainCatById(
              item?.meta_data.filter(
                (item) => item.key === "main_categories_new"
              )[0]?.value
            )[0]?.slug}
            subCategoryName={subCatById(
              item?.meta_data.filter(
                (item) => item.key === "sub_categories_new"
              )[0]?.value
            )[0]?.slug}
            childCategoryName={childCatById(
              item?.meta_data.filter(
                (item) => item.key === "child_categories_new"
              )[0]?.value
            )[0]?.slug}
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
