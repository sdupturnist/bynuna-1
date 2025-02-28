"use client";

import Link from "next/link";
import { homeUrl } from "../Utils/variables";

export default function Button({
  outline,
  link,
  color,
  primary,
  label,
  url,
  action,
  minimal,
  small,
  classes,
}) {
  // Conditionally render based on the props passed
  if (link) {
    return (
      <Link
        href={url || homeUrl}
        className={`btn ${classes} ${outline ? "border" : ""} border-[${color}]`}
      >
        {label}
      </Link>
    );
  }

  if (primary && !action) {
    return (
      <Link href={url || homeUrl} className={`btn ${classes} btn-primary`}>
        {label}
      </Link>
    );
  }

  if (minimal) {
    return (
      <Link
        href={url || homeUrl}
        className={`text-base ${
          small ? "text-xs gap-1" : "gap-2"
        } font-bold text-primary uppercase flex items-center justify-start hover:opacity-50 transition-all`}
      >
        {label}{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={small ? "8" : "12"}
          height={small ? "8" : "12"}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M0 1.82104H14M14 1.82104V15.821M14 1.82104L2 14.1544"
            stroke="#FF6300"
            strokeWidth="2.5"
          ></path>
        </svg>
      </Link>
    );
  }

  if (primary && action) {
    return (
      <button onClick={action} className={`btn ${classes} btn-primary`}>
        {label}sdf
      </button>
    );
  }

  if (small) {
    return (
      <button
        onClick={action}
        className="rounded-none border-b border-border btn-small"
      >
        {label}
      </button>
    );
  }

  return (
    <button className={`btn ${classes}`} onClick={action}>
      {label}
    </button>
  );
}
