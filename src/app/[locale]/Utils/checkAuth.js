"use client";

import { useRouter } from "next/navigation";
import { homeUrl } from "./variables";
import Swal from "sweetalert2";

export const isLoggined = (validUserTocken, router, url, heading, desc, login, cancel) => {


  const router_ = useRouter();
  const { locale } = router_; 


  if (validUserTocken) {
    router.push(`${homeUrl}/${locale}/${url}`);
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-light",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: heading,
        text: desc,
        icon: false,
        showCancelButton: true,
        confirmButtonText: login,
        cancelButtonText: cancel,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          router.push(`${homeUrl}auth/login`);
        }
      });
  }
};
