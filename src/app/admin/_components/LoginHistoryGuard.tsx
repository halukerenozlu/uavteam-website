// src/app/admin/_components/LoginHistoryGuard.tsx
"use client";

import { useEffect } from "react";

type PageShowEvent = Event & { persisted?: boolean };

export default function LoginHistoryGuard() {
  useEffect(() => {
    const url = location.href;

    // history kilidi
    history.replaceState(null, "", url);
    history.pushState(null, "", url);

    const onPop = () => {
      history.pushState(null, "", url);
    };

    const rearm = () => {
      history.replaceState(null, "", url);
      history.pushState(null, "", url);
    };

    const onPageShow = (e: PageShowEvent) => {
      if (e.persisted) rearm();
    };

    const onVis = () => {
      if (document.visibilityState === "visible") rearm();
    };

    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", onPageShow as EventListener);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", onPageShow as EventListener);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}
