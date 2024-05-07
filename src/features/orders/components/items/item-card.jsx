import React, { useState, useRef, memo } from "react";

import { numericFormat } from "@/lib/helpers";

import { Card } from "@/components/ui/card";
import { ItemAddsOn } from "@/features/orders/components/items/item-adds-on";

import noImage from "@/assets/images/no-image-available.png";
import LazyLoad from "react-lazy-load";
import { TbFidgetSpinner } from "react-icons/tb";
import { PuffLoader, PulseLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";

export const MenuItem = ({ details, onClick }) => {
  const [isCustomizeItemOpen, setIsCustomizeItemOpen] = useState(false);
  const cardRef = useRef(null);

  const onMouseDown = (e) => {
    const timer = setTimeout(() => setIsCustomizeItemOpen(true), 1000);
    cardRef.current.addEventListener("mouseup", () => clearTimeout(timer));
  };

  const onTouchStart = (e) => {
    // e.preventDefault(); // Prevent default touch behavior
    const timer = setTimeout(() => setIsCustomizeItemOpen(true), 1000);
    cardRef.current.addEventListener("touchend", () => clearTimeout(timer));
  };

  return (
    <React.Fragment>

      <Card
        ref={cardRef}
        className="relative w-40 h-52 sm:h-48 flex flex-col justify-between shadow-none cursor-pointer"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={onClick}
      >
        <React.Fragment>
          <div className="w-full h-20 sm:h-50">
            <LazyLoad>
              <img
                src={details.image !== "" ? "data:image/bmp;base64," + details.image : noImage}
                className="w-full h-20 object-cover"
                alt={details.name}
              />
            </LazyLoad>
            <div className="placeholder flex items-center justify-items-center h-20">
              <Skeleton className="w-full h-20" />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-1 px-2 py-2">
            <p className="text-[0.667em] font-semibold uppercase text-stone-500 ">{details.category.name}</p>
            <h3 className="text-sm text-center font-semibold text-neutral-800 leading-tight">{details.name}</h3>
            <PriceComponent price={details.price} />
          </div>
          </React.Fragment>
      </Card>

      <ItemAddsOn
        item={details}
        open={isCustomizeItemOpen}
        onOpenChange={() => setIsCustomizeItemOpen((prev) => !prev)}
      />
    </React.Fragment>
  );
};

const PriceComponent = ({ price }) => {
  const [wholePrice, decimalPart] = numericFormat(price).split(".");

  return (
    <p className="text-sm text-primary font-bold flex items-baseline">
      <span className="text-xl">{wholePrice}</span>.<span className="text-sm">{decimalPart}</span>
    </p>
  );
};
