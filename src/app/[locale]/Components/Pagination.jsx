'use client';

import { useRouter } from 'nextjs-toploader/app';
import { useRef } from "react";

export default function Pagination({ currentPage, totalPages, itemsShowPerPage }) {
  const router = useRouter();
  const loadMoreButtonRef = useRef(null);

  const displayedItems = currentPage * itemsShowPerPage;
  const isLastPage = displayedItems >= totalPages;

  const handleLoadMore = () => {
    const url = new URL(window.location.href);
    const currentPerPage = parseInt(url.searchParams.get("per_page") || itemsShowPerPage);
    const newPerPage = Math.min(currentPerPage + 8, totalPages * itemsShowPerPage);

    url.searchParams.set("per_page", newPerPage);

    router.push(url.toString(), { scroll: false });
  };

  return (
    <div className="flex gap-2 items-center justify-center text-center sm:mt-10 mt-7 mx-auto">
      <button
        ref={loadMoreButtonRef}
        onClick={handleLoadMore}
        disabled={isLastPage}
        className="btn"
      >
        Load more
      </button>
    </div>
  );
}
