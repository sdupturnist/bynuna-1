import Images from "./Images";

export default function Avatar({ url, reviewer }) {
  if (url !== "") {
    return (
      <div className="avatar">
        <div className="sm:size-[40px] size-[34px]  rounded-full">
           <Images
            imageurl={url[96] || "https://via.placeholder.com/40x40"}
            quality="100"
            width="100"
            height="100"
            alt="Avatar"
            title="Avatar"
            classes="block sm:size-[40px] size-[34px]  !m-0 !rounded-full border-border border object-cover"
            placeholder={true}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="avatar placeholder">
        <div className="bg-light text-neutral-content sm:size-[40px] size-[34px] rounded-full">
          <span className="text-xs text-primary uppercase font-semibold">
            {reviewer.slice(0, 2)}
          </span>
        </div>
      </div>
    );
  }
}
