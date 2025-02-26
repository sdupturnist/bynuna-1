"use client";

import { useEffect } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { homeUrl } from "../Utils/variables";
import Signup from "./Forms/Signup";
import { useAuthContext } from "../Context/authContext";

export default function Register() {
  const { auth } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (auth) {
      router.push(homeUrl);
    }
  }, [auth]);

  return <Signup />;
}
