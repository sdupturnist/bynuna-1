"use client";

import Link from "next/link";

export default function SocialIcons({ color, large, data, centerSM, center }) {
  return (
    data && (
      <ul
        className={`social-icons${large ? "-large" : ""} ${
          centerSM && "items-center flex justify-center sm:justify-start"
        } ${center && "items-center  w-full justify-center"} flex gap-3`}
      >
        <li>
          <Link href={data?.instagram || "#"} target="_blank" title="Instagram">
            <i className="bi bi-instagram"></i>
          </Link>
        </li>
        <li>
          <Link
            href={(data && data?.facebook) || "#"}
            target="_blank"
            title="Facebook"
          >
            <i className="bi bi-facebook"></i>
          </Link>
        </li>
        <li>
          <Link
            href={(data && data?.youtube) || "#"}
            target="_blank"
            title="Facebook"
          >
            <i className="bi bi-youtube"></i>
          </Link>
        </li>
      </ul>
    )
  );
}
