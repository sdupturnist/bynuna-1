import Card from "./Card";



export default function ProductGrid({ items, isWishList }) {
  return (
    <ul
      className={`xl:grid-cols-4 products product-card-left-right-mobile grid  grid-cols-2 sm:gap-4 gap-2`}>
      {items.map((item, index) => (
         <Card product key={index} data={item} />
      ))}
    </ul>
  );
}
