"use client";

import { HamburgerMenuIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const [isMenuDropdownVisible, setMenuDropdownVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuDropdownVisible(false);
      }
    };

    const handleScroll = () => {
      if (isMenuDropdownVisible) {
        setMenuDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isMenuDropdownVisible]);

  const toggleMenuDropdown = () => {
    setMenuDropdownVisible(!isMenuDropdownVisible);
  };

  return (
    <nav className="w-full max-h-[116px] md:max-h-16 fixed top-0 z-10 shadow-[0px_1px_2px_#DDDDDD] bg-lightgray">
      <div className="w-full max-w-[1080px] mx-auto px-6 py-2 relative flex justify-between gap-1 flex-col md:flex-row">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="h-12 min-w-[168px] w-[168px] pl-2 flex items-center"
          >
            <Image
              src="/images/logos/cherlygood_wordmark.svg"
              alt="Cherly Good"
              width={160}
              height={40}
              priority
            />
          </Link>
          <div className="flex gap-3 h-9 *:text-sm *:font-semibold *:h-full *:px-2 *:rounded-full *:flex *:items-center *:justify-center *:transition *:duration-300 *:ease-in-out">
            <Link href="#" className="hover:bg-lightgray-dimmed">
              Storefront
            </Link>
            <Link href="#" className="hover:bg-lightgray-dimmed">
              Products
            </Link>
            <Link href="#" className="hover:bg-lightgray-dimmed">
              Upsells
            </Link>
            <Link href="#" className="hover:bg-lightgray-dimmed">
              Orders
            </Link>
          </div>
        </div>
        <div className="absolute right-4 top-2 md:relative md:right-auto md:top-auto min-w-[160px] w-[160px] h-12 flex items-center justify-end">
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenuDropdown}
              className="h-12 w-12 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-lightgray-dimmed"
            >
              <HamburgerMenuIcon size={24} />
            </button>
            {isMenuDropdownVisible && (
              <div className="w-36 absolute top-[52px] right-0 z-20 py-2 rounded-md shadow-dropdown bg-white">
                <Link
                  href="#"
                  className="block px-5 py-2 text-sm font-semibold transition duration-300 ease-in-out hover:bg-lightgray"
                >
                  Public website
                </Link>
                <Link
                  href="#"
                  className="block px-5 py-2 text-sm font-semibold transition duration-300 ease-in-out hover:bg-lightgray"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
