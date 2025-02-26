"use client";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Notification({ message, type, onClose, url }) {
  return (
    <div
      className={`fixed top-auto bottom-10 sm:right-5 right-0 sm:left-auto left-0 p-4 sm:rounded sm:shadow-lg flex gap-4 justify-between items-center z-50  
                    ${
                      type === "success" ? "bg-primary bg-opacity-90" : "bg-red-500"
                    } text-white`}>
      {url ? (
        <Link href={url} className="text-sm">
          {message}
        </Link>
      ) : (
        <span className="text-sm">{message}</span>
      )}
      <button
        onClick={onClose}
        className="bg-transparent border-none text-white font-bold cursor-pointer">
        <XCircleIcon className="size-5" />
      </button>
    </div>
  );
}
