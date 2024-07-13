"use client";

import AlertMessage from "@/components/shared/AlertMessage";
import { useState, useEffect } from "react";
import Spinner from "@/ui/Spinners/White";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { ArrowLeftIcon, CloseIcon } from "@/icons";
import clsx from "clsx";
import Image from "next/image";
import Overlay from "@/ui/Overlay";
import UpdateCategoriesAction from "@/actions/categories";
import { AlertMessageType } from "@/libraries/sharedTypes";

type CategorySectionType = {
  visibility: string;
};

export function CategoriesButton({
  categorySection,
}: {
  categorySection: CategorySectionType;
}) {
  const HIDDEN = "HIDDEN";
  const PUBLISHED = "PUBLISHED";

  const { showOverlay } = useOverlayStore();
  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.storefront.name,
    overlayName: state.pages.storefront.overlays.categories.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="flex flex-col items-start w-full min-[560px]:w-[calc(100%/2-4px)] min-[824px]:w-64 rounded-xl p-5 relative cursor-pointer ease-in-out duration-300 transition shadow border border-transparent bg-white active:border-[#bfc5ce] lg:hover:border-[#bfc5ce]"
    >
      <div className="w-full mb-4 flex items-center justify-between relative">
        <h2 className="text-left font-semibold text-sm">Categories</h2>
        <div
          className={clsx(
            "w-10 h-5 rounded-full relative cursor-pointer ease-in-out duration-200",
            {
              "bg-white border":
                categorySection.visibility.toUpperCase() === HIDDEN,
              "bg-custom-blue border border-custom-blue":
                categorySection.visibility.toUpperCase() === PUBLISHED,
            }
          )}
        >
          <div
            className={clsx(
              "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)]",
              {
                "left-[5px] bg-black":
                  categorySection.visibility.toUpperCase() === HIDDEN,
                "left-[23px] bg-white":
                  categorySection.visibility.toUpperCase() === PUBLISHED,
              }
            )}
          ></div>
        </div>
      </div>
      <p className="w-52 text-left text-gray text-xs leading-[18px]">
        Group similar products so they're easy to find: Dresses, Tops, Bottoms,
        and more.
      </p>
    </button>
  );
}

export function CategoriesOverlay({
  categories,
  categorySection,
}: {
  categories: CategoryType[];
  categorySection: CategorySectionType;
}) {
  const HIDDEN = "HIDDEN";
  const PUBLISHED = "PUBLISHED";

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessageType, setAlertMessageType] = useState<AlertMessageType>(
    AlertMessageType.NEUTRAL
  );
  const [showAlert, setShowAlert] = useState(false);
  const [categorySectionVisibility, setCategorySectionVisibility] = useState(
    categorySection.visibility.toUpperCase()
  );
  const [visibilityStates, setVisibilityStates] = useState(
    categories.map((category) => category.visibility === PUBLISHED)
  );

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.storefront.name,
      overlayName: state.pages.storefront.overlays.categories.name,
      isOverlayVisible: state.pages.storefront.overlays.categories.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible || showAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      if (!isOverlayVisible && !showAlert) {
        document.body.style.overflow = "visible";
      }
    };
  }, [isOverlayVisible, showAlert]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const updatedCategories = categories.map((category, index) => ({
        id: category.id,
        visibility: visibilityStates[index] ? PUBLISHED : HIDDEN,
      }));

      const allCategoriesHidden = updatedCategories.every(
        (category) => category.visibility === HIDDEN
      );

      if (categorySectionVisibility === PUBLISHED && allCategoriesHidden) {
        setAlertMessageType(AlertMessageType.ERROR);
        setAlertMessage(
          "Cannot display category section on storefront, all categories are hidden."
        );
        setShowAlert(true);
        setLoading(false);
        return;
      }

      const result = await UpdateCategoriesAction({
        categorySectionVisibility: categorySectionVisibility,
        categories: updatedCategories,
      });
      setAlertMessageType(result.type);
      setAlertMessage(result.message);
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating categories:", error);
      setAlertMessageType(AlertMessageType.ERROR);
      setAlertMessage("Failed to update categories");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const onHideOverlay = () => {
    setLoading(false);
    hideOverlay({ pageName, overlayName });
    setCategorySectionVisibility(categorySection.visibility.toUpperCase());
    setVisibilityStates(
      categories.map((category) => category.visibility === PUBLISHED)
    );
  };

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
    setAlertMessageType(AlertMessageType.NEUTRAL);
  };

  const toggleVisibility = (index: number) => {
    setVisibilityStates((prev) => {
      const newVisibilityStates = [...prev];
      newVisibilityStates[index] = !newVisibilityStates[index];
      return newVisibilityStates;
    });
  };

  return (
    <>
      {isOverlayVisible && (
        <Overlay>
          <div className="absolute bottom-0 left-0 right-0 w-full h-[calc(100%-60px)] rounded-t-3xl bg-white md:w-[536px] md:rounded-2xl md:shadow-lg md:h-max md:mx-auto md:mt-20 md:mb-[50vh] md:relative md:bottom-auto md:left-auto md:right-auto md:top-auto md:-translate-x-0">
            <div className="w-full h-[calc(100vh-188px)] md:h-auto">
              <div className="md:hidden flex items-end justify-center pt-4 pb-2 absolute top-0 left-0 right-0 bg-white">
                <div className="relative flex justify-center items-center w-full h-7">
                  <h2 className="font-semibold text-lg">Setup categories</h2>
                  <button
                    onClick={onHideOverlay}
                    type="button"
                    className="w-7 h-7 rounded-full flex items-center justify-center absolute right-4 transition duration-300 ease-in-out bg-lightgray active:bg-lightgray-dimmed"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:justify-between py-2 pr-4 pl-2">
                <button
                  onClick={onHideOverlay}
                  type="button"
                  className="h-9 px-3 rounded-full flex items-center gap-1 transition duration-300 ease-in-out active:bg-lightgray"
                >
                  <ArrowLeftIcon
                    className="fill-custom-blue -ml-[2px]"
                    size={20}
                  />
                  <span className="font-semibold text-sm text-custom-blue">
                    Setup categories
                  </span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={clsx(
                    "relative h-9 w-max px-4 rounded-full overflow-hidden transition duration-300 ease-in-out text-white bg-custom-blue",
                    {
                      "bg-opacity-50": loading,
                      "active:bg-custom-blue-dimmed": !loading,
                    }
                  )}
                >
                  {loading ? (
                    <div className="flex gap-1 items-center justify-center w-full h-full">
                      <Spinner />
                      <span className="text-white">Saving</span>
                    </div>
                  ) : (
                    <span className="text-white">Save</span>
                  )}
                </button>
              </div>
              <div className="w-full h-full mt-[52px] md:mt-0 px-5 pt-5 pb-28 md:pb-10 flex flex-col gap-5 overflow-x-hidden overflow-y-visible invisible-scrollbar md:overflow-hidden">
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-sm">Visibility</h2>
                  <div className="px-[10px] py-2 w-full min-[425px]:w-max rounded-md flex gap-4 min-[425px]:gap-4 items-start justify-between bg-lightgray">
                    <div className="text-sm">
                      Display category section on storefront
                    </div>
                    <div
                      onClick={() =>
                        setCategorySectionVisibility((prevState) =>
                          prevState === PUBLISHED ? HIDDEN : PUBLISHED
                        )
                      }
                      className={clsx(
                        "min-w-10 w-10 h-5 rounded-full relative cursor-pointer ease-in-out duration-200",
                        {
                          "bg-white border":
                            categorySectionVisibility === HIDDEN,
                          "bg-custom-blue border border-custom-blue":
                            categorySectionVisibility === PUBLISHED,
                        }
                      )}
                    >
                      <div
                        className={clsx(
                          "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)]",
                          {
                            "left-[5px] bg-black":
                              categorySectionVisibility === HIDDEN,
                            "left-[23px] bg-white":
                              categorySectionVisibility === PUBLISHED,
                          }
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-sm">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(({ index, image, name }, mapIndex) => (
                      <div
                        key={mapIndex}
                        className="w-[calc(50%-4px)] min-[466px]:w-[calc(33.333333%-6px)] min-[608px]:w-[calc(25%-6px)] min-[768px]:w-40 border rounded-xl relative overflow-hidden"
                      >
                        <div className="w-full aspect-square mb-2 flex flex-col gap-1 items-center pt-5">
                          <div className="w-[calc(100%-56px)] max-w-[140px] aspect-square rounded-full overflow-hidden flex items-center justify-center shadow-[rgba(0,0,0,0.2)_0px_1px_3px_0px,_rgba(27,31,35,0.15)_0px_0px_0px_1px]">
                            <Image
                              src={`/images/categories/${image}`}
                              alt={name}
                              width={140}
                              height={140}
                              priority={true}
                            />
                          </div>
                          <span className="text-gray">{name}</span>
                        </div>
                        <div className="w-full py-2 px-5 flex items-center justify-between border-t">
                          <span className="text-sm font-semibold">{index}</span>
                          <div
                            onClick={() => toggleVisibility(mapIndex)}
                            className={clsx(
                              "w-10 h-5 rounded-full relative cursor-pointer ease-in-out duration-200",
                              {
                                "bg-white border": !visibilityStates[mapIndex],
                                "bg-custom-blue border border-custom-blue":
                                  visibilityStates[mapIndex],
                              }
                            )}
                          >
                            <div
                              className={clsx(
                                "w-[10px] h-[10px] rounded-full ease-in-out duration-300 absolute [top:50%] [transform:translateY(-50%)]",
                                {
                                  "left-[5px] bg-black":
                                    !visibilityStates[mapIndex],
                                  "left-[23px] bg-white":
                                    visibilityStates[mapIndex],
                                }
                              )}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:hidden w-full pb-5 pt-2 px-5 absolute bottom-0">
              <button
                onClick={handleSave}
                disabled={loading}
                className={clsx(
                  "relative h-12 w-full rounded-full overflow-hidden transition duration-300 ease-in-out text-white bg-custom-blue",
                  {
                    "bg-opacity-50": loading,
                    "active:bg-custom-blue-dimmed": !loading,
                  }
                )}
              >
                {loading ? (
                  <div className="flex gap-1 items-center justify-center w-full h-full">
                    <Spinner />
                    <span className="text-white">Saving</span>
                  </div>
                ) : (
                  <span className="text-white">Save</span>
                )}
              </button>
            </div>
          </div>
        </Overlay>
      )}
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
          type={alertMessageType}
        />
      )}
    </>
  );
}
