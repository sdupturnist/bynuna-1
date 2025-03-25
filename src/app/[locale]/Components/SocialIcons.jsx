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
          <Link
            href={(data && data[0]?.instagram) || "#"}
            target="_blank"
            title="Instagram"
          >
            <i className="bi bi-instagram"></i>
          </Link>
        </li>
        <li>
          <Link
            href={(data && data[1]?.facebook) || "#"}
            target="_blank"
            title="Facebook"
          >
            <i className="bi bi-facebook"></i>
          </Link>
        </li>
        <li>
          <Link
            href={(data && data[2]?.youtube) || "#"}
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
