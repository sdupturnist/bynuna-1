//export const dynamic = "force-dynamic";

import { homeUrl } from "../Utils/variables";
import Alerts from "./Alerts";
import Card from "./Card";

export default async function ProductWrapper({ data, locale }) {
  return (
    <>
      {data?.length > 0 ? (
        <div className="product-list">
          {data.length > 0 &&
            data &&
            data?.map((item, index) => (
              <Card product key={index} data={item} locale={locale} />
            ))}
        </div>
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
