"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

let timeout: NodeJS.Timeout;

export default function RouteLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      NProgress.done();
    }, 300); // simulate loading time

    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
