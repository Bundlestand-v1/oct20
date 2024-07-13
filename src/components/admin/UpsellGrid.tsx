"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { capitalizeFirstLetter, formatThousands } from "@/libraries/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AlertMessage from "../shared/AlertMessage";
import { NewUpsellEmptyGridButton } from "./NewUpsell";

const PUBLISHED = "PUBLISHED";
const DRAFT = "DRAFT";
const HIDDEN = "HIDDEN";
const INACTIVE = "INACTIVE";
const ALL = "ALL";

export default function UpsellGrid({ upsells }: { upsells: UpsellType[] }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>(ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageJumpValue, setPageJumpValue] = useState("1");
  const [isPageInRange, setIsPageInRange] = useState(true);

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const getFilteredUpsells = (filter: string) => {
    if (filter === PUBLISHED) {
      return upsells.filter(
        (upsell) => upsell.visibility.toUpperCase() === PUBLISHED
      );
    } else if (filter === INACTIVE) {
      return upsells.filter(
        (upsell) =>
          upsell.visibility.toUpperCase() === HIDDEN ||
          upsell.visibility.toUpperCase() === DRAFT
      );
    }
    return upsells;
  };

  const filteredUpsells = getFilteredUpsells(filter);

  const handleFilterChange = (newFilter: string) => {
    const newFilteredUpsells = getFilteredUpsells(newFilter);

    if (newFilteredUpsells.length === 0) {
      setAlertMessage(
        `${capitalizeFirstLetter(
          newFilter.toLowerCase()
        )} filter has no upsells`
      );
      setShowAlert(true);
    } else {
      setFilter(newFilter);
      setPageJumpValue("1");
      setCurrentPage(1);
      setIsPageInRange(true);
    }
  };

  const pagination = (
    data: UpsellType[],
    currentPage: number,
    rowsPerPage: number
  ) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedArray = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return {
      paginatedArray,
      totalPages,
    };
  };

  const rowsPerPage = 4;
  const { paginatedArray: gridData, totalPages } = pagination(
    filteredUpsells,
    currentPage,
    rowsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      const value = Math.max(prevPage - 1, 1);
      setPageJumpValue(String(value));

      return value;
    });
    setIsPageInRange(true);
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const value = Math.min(prevPage + 1, totalPages);
      setPageJumpValue(String(value));

      return value;
    });
    setIsPageInRange(true);
  };

  const jumpToLastPage = () => {
    setPageJumpValue(String(totalPages));
    setCurrentPage(totalPages);
    setIsPageInRange(true);
  };

  const jumpToPage = () => {
    const page = parseInt(pageJumpValue, 10);

    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setIsPageInRange(true);
    } else {
      setIsPageInRange(false);
    }
  };

  const pageJumpEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      jumpToPage();
    }
  };

  const pageJumpInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setPageJumpValue(value);
    }
  };

  return (
    <div className="mx-auto flex flex-wrap justify-start px-5 md:px-0 md:w-[762px] lg:w-[1016px]">
      {upsells.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            <div className="w-full px-5 flex flex-col min-[588px]:flex-row gap-2 items-center justify-between">
              <div className="max-w-full flex flex-nowrap rounded-full bg-[#efefef] overflow-x-visible overflow-y-hidden invisible-scrollbar *:min-w-max *:h-9 *:rounded-full *:flex *:items-center *:justify-center *:font-semibold *:text-sm *:ease-in-out *:duration-300 *:transition">
                <button
                  onClick={() => handleFilterChange(ALL)}
                  className={`px-3 pl-[14px] h-9 hover:bg-[#e4e4e4] rounded-full ${
                    filter === ALL
                      ? "text-custom-blue"
                      : "text-gray hover:text-black"
                  }`}
                >
                  View all ({upsells.length})
                </button>
                <button
                  onClick={() => handleFilterChange(PUBLISHED)}
                  className={`px-3 h-9 hover:bg-[#e4e4e4] rounded-full ${
                    filter === PUBLISHED
                      ? "text-custom-blue"
                      : "text-gray hover:text-black"
                  }`}
                >
                  Published (
                  {
                    upsells.filter(
                      (upsell) => upsell.visibility.toUpperCase() === PUBLISHED
                    ).length
                  }
                  )
                </button>
                <button
                  onClick={() => handleFilterChange(INACTIVE)}
                  className={`px-3 pr-[14px] h-9 hover:bg-[#e4e4e4] rounded-full ${
                    filter === INACTIVE
                      ? "text-custom-blue"
                      : "text-gray hover:text-black"
                  }`}
                >
                  Inactive (
                  {
                    upsells.filter(
                      (upsell) =>
                        upsell.visibility.toUpperCase() === HIDDEN ||
                        upsell.visibility.toUpperCase() === DRAFT
                    ).length
                  }
                  )
                </button>
              </div>
            </div>
            <div className="w-full flex flex-wrap justify-start">
              {gridData.map(({ id, price, salePrice, mainImage }, index) => (
                <Link
                  key={index}
                  href={`/admin/shop/upsells/${id}`}
                  className="aspect-square w-1/2 min-[425px]:w-[calc(100%/3)] md:w-[254px] pt-2 pb-[6px] px-5 select-none transition duration-200 ease-in-out active:bg-blue-100 lg:hover:bg-blue-100"
                >
                  <div className="relative w-full h-full">
                    <div className="aspect-square w-full overflow-hidden flex items-center justify-center shadow-[2px_2px_4px_#9E9E9E] bg-white">
                      {mainImage && (
                        <Image
                          src={mainImage}
                          alt="Upsell"
                          width={216}
                          height={216}
                          priority
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-center absolute bottom-0 w-full">
                      <div className="flex gap-[6px] items-center justify-center text-sm w-max">
                        <span className="font-bold">
                          ${formatThousands(salePrice)}
                        </span>
                        <span className="text-gray line-through">
                          ${formatThousands(price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {filteredUpsells.length > rowsPerPage && (
              <div className="mt-2">
                <div className="w-max mx-auto flex gap-1 h-9">
                  <button
                    onClick={handlePrevious}
                    className="w-9 h-9 flex items-center justify-center rounded-full ease-in-out duration-300 transition active:bg-lightgray-dimmed lg:hover:bg-lightgray-dimmed"
                  >
                    <ChevronLeftIcon className="-ml-[2px]" size={24} />
                  </button>
                  <input
                    value={pageJumpValue}
                    onChange={pageJumpInputChange}
                    onKeyDown={pageJumpEnterKey}
                    type="text"
                    className={clsx(
                      "min-w-[36px] max-w-[36px] h-9 px-1 text-center border cursor-text outline-none rounded-full bg-white",
                      {
                        "border-custom-red": !isPageInRange,
                      }
                    )}
                  />
                  <div className="flex items-center justify-center px-1 cursor-context-menu">
                    of
                  </div>
                  <button
                    onClick={jumpToLastPage}
                    className="w-9 h-9 flex items-center justify-center border rounded-full ease-in-out duration-300 transition active:bg-lightgray-dimmed lg:hover:bg-lightgray-dimmed"
                  >
                    {totalPages}
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 flex items-center justify-center rounded-full ease-in-out duration-300 transition bg-white active:bg-lightgray-dimmed lg:hover:bg-lightgray-dimmed "
                  >
                    <ChevronRightIcon className="-mr-[2px]" size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
          {showAlert && (
            <AlertMessage
              message={alertMessage}
              hideAlertMessage={hideAlertMessage}
            />
          )}
        </>
      ) : (
        <div className="w-full flex justify-center">
          <div className="text-center">
            <h2 className="font-semibold text-lg mb-2">No upsells yet</h2>
            <p className="text-sm mb-4">
              Click the button below to create your first one
            </p>
            <NewUpsellEmptyGridButton />
          </div>
        </div>
      )}
    </div>
  );
}
