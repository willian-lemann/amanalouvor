"use client";

import { useEffect, useState } from "react";
import { SearchContent } from "./search-content";

export function Search() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercentage =
        (scrollPosition / (documentHeight - windowHeight)) * 100;

      if (scrollPercentage >= 18) {
        setIsFloating(true);
      } else {
        setIsFloating(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function renderFloatingSearch() {
    return (
      <div
        data-floating={isFloating}
        className="-translate-y-[200px] md:-translate-y-[100px] data-[floating=true]:-translate-y-0 fixed z-[9999] flex transition-all duration-200 md:max-w-4xl top-0  shadow-md md:top-2 left-1/2 -translate-x-1/2 py-6 md:rounded-3xl  md:mx-auto md:flex-row flex-col md:items-center justify-end px-4 md:container w-full gap-2 bg-background"
      >
        <SearchContent />
      </div>
    );
  }

  return (
    <>
      {/* {isFloating ? renderFloatingSearch() : null} */}
      <div className="transition-all flex md:flex-row flex-col md:items-center px-0 pb-0 w-full gap-2 bg-background rounded-lg">
        <SearchContent />
      </div>
    </>
  );
}
