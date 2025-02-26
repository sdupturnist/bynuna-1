"use client";

export default function Skelton({
  productList,
  productCard,
  productleftRightCard,
  listAddress,
  list,
  catPage,
  bannerSmall,
  boxes,
  menu,
  nav
}) {
  return (
    <>

{nav && (
      <div className="container flex gap-5 justify-between items-center w-full ">
        <div className="skeleton  w-[90px] h-[20px] bg-gray-100 shrink-0 rounded-sm"></div>
        <div className="skeleton  w-[90px] h-[20px] bg-gray-100 shrink-0 rounded-sm"></div>
        <div className="skeleton  w-[90px] h-[20px] bg-gray-100 shrink-0 rounded-sm"></div>
        <div className="skeleton  w-[90px] h-[20px] bg-gray-100 shrink-0 rounded-sm"></div>
        <div className="skeleton  w-[90px] h-[20px] bg-gray-100 shrink-0 rounded-sm"></div>
       </div>
      )}

{menu && (
      <div className="container gap-5 justify-between items-center w-full ">
        <div className="skeleton  w-[150px] h-[20px] bg-gray-100 shrink-0 rounded-sm mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-[150px] h-[20px] bg-gray-100 shrink-0 rounded-sm mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-[150px] h-[20px] bg-gray-100 shrink-0 rounded-sm mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-[150px] h-[20px] bg-gray-100 shrink-0 rounded-sm mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        <div className="skeleton  w-full h-[20px] bg-gray-100 shrink-0 rounded-sm  mb-5"></div>
        
      </div>
      )}


{boxes && (
      <div className="container flex gap-5 justify-between items-center w-full ">
        <div className="skeleton sm:size-[130px] size-[70px] bg-gray-100 shrink-0 rounded-lg"></div>
        <div className="skeleton sm:size-[130px] size-[70px] bg-gray-100 shrink-0 rounded-lg"></div>
        <div className="skeleton sm:size-[130px] size-[70px] bg-gray-100 shrink-0 rounded-lg"></div>
        <div className="skeleton sm:size-[130px] size-[70px] bg-gray-100 shrink-0 rounded-lg"></div>
        <div className="skeleton sm:size-[130px] size-[70px] bg-gray-100 shrink-0 rounded-lg"></div>
      </div>
      )}

{bannerSmall && (
      <div className="skeleton sm:h-[150px] h-20 bg-gray-200 w-full shrink-0 rounded-lg"></div>
      )}

      {productList && (
        <ul
          className={`xl:grid-cols-4 products product-card-left-right-mobile grid  grid-cols-2 sm:gap-4 gap-2`}
        >
          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>

          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>
          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>
          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>
          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>

          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>
          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>
          <div className="rounded-md h-auto w-auto flex sm:block items-center justify-center  ">
            <div className="skeleton h-[300px] bg-gray-200 w-full shrink-0 rounded-lg"></div>
          </div>
        </ul>
      )}

      {productleftRightCard && (
        <div className="flex w-full flex-col gap-4 mb-5 bg-white p-3 rounded-lg">
          <div className="flex items-center gap-4 justify-between">
            <div className="skeleton h-20 w-20 shrink-0 rounded-lg"></div>
            <div className="flex flex-col gap-4 w-full">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full max-w-[50%]"></div>
            </div>
          </div>
        </div>
      )}

      {productCard && (
        <div className="flex w-full flex-col gap-4 bg-white">
          <div className="skeleton h-48 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full max-w-[70%]"></div>
          <div className="skeleton h-4 w-full max-w-[80px]"></div>
        </div>
      )}

      {listAddress && (
        <div className="flex w-full flex-col gap-4 mb-5 bg-white">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex flex-col gap-4 w-full">
              <div className="skeleton h-4 w-full max-w-[50%]"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        </div>
      )}

      {list && (
        <div className="flex w-full flex-col gap-4 mb-5 bg-white">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex flex-col gap-4 w-full">
              <div className="skeleton h-4 w-full max-w-[50%]"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full max-w-[50%]"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        </div>
      )}

      {catPage && (
        <div className="flex w-full flex-col gap-4">
          <div className="xl:grid-cols-4 products product-card-left-right-mobile grid grid-cols-2 sm:gap-4 gap-2 sm:px-0 px-[20px] sm:bg-transparent bg-white sm:py-0 py-[20px]">
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
            <div className="skeleton rounded-xl sm:h-[350px] h-[250px] w-full bg-gray-200"></div>
          </div>
        </div>
      )}
    </>
  );
}
