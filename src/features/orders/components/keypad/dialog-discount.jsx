import React, { useState } from "react";

import {
  TbBackspace,
  TbCurrencyDollar,
  TbDecimal,
  TbNumber0,
  TbNumber1,
  TbNumber2,
  TbNumber3,
  TbNumber4,
  TbNumber5,
  TbNumber6,
  TbNumber7,
  TbNumber8,
  TbNumber9,
  TbPercentage,
} from "react-icons/tb";

import { useAtomValue, useSetAtom } from "jotai";
import { orderAtom, updateDiscountAtom } from "@/app/store/atoms/orders";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { ActionButton, NumericButton } from "./custom-buttons";
import { useTranslation } from "react-i18next";

export const DiscountDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();

  const order = useAtomValue(orderAtom);
  const updateDiscount = useSetAtom(updateDiscountAtom);

  const [inputValue, setInputValue] = useState(order?.discount?.toString());
  const [discountType, setDiscountType] = useState("PERCENTAGE");

  const handleNumericButton = (number) => setInputValue((prevValue) => Number(prevValue + number).toString());
  const handleBackspaceButton = () => setInputValue(inputValue.slice(0, -1));
  const handleConfirmButton = async () => {
    updateDiscount({ type: discountType, discount: Number(inputValue) || 0 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.discount.discount")}</DialogTitle>
          <DialogDescription>{t("orders.discount.discountDesc")}</DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col w-full gap-3 items-center justify-center p-2">
          <div className="flex gap-1 w-48">
            <Button
              variant={discountType === "PERCENTAGE" ? "default" : "outline"}
              onClick={() => setDiscountType("PERCENTAGE")}
              className="min-w-10"
              size="icon"
            >
              <TbPercentage />
            </Button>

            <Button
              variant={discountType === "FIXED_AMOUNT" ? "default" : "outline"}
              onClick={() => setDiscountType("FIXED_AMOUNT")}
              className="min-w-10"
              size="icon"
            >
              <TbCurrencyDollar />
            </Button>

            <Input className="border-zinc-300 text-center flex-grow" value={inputValue || "0"} readOnly />
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <NumericButton
                icon={TbNumber1}
                onClick={() => handleNumericButton("1")}
                className="rounded-b-none rounded-r-none w-16"
              />
              <NumericButton icon={TbNumber4} onClick={() => handleNumericButton("4")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber7} onClick={() => handleNumericButton("7")} className="rounded-none w-16" />
              <ActionButton
                icon={TbBackspace}
                className="bg-red-500 text-white hover:bg-red-500 hover:text-white border-none rounded-t-none rounded-r-none w-16"
                onClick={handleBackspaceButton}
              />
            </div>
            <div className="flex flex-col">
              <NumericButton icon={TbNumber2} onClick={() => handleNumericButton("2")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber5} onClick={() => handleNumericButton("5")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber8} onClick={() => handleNumericButton("8")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber0} onClick={() => handleNumericButton("0")} className="rounded-none w-16" />
            </div>
            <div className="flex flex-col">
              <NumericButton
                icon={TbNumber3}
                onClick={() => handleNumericButton("3")}
                className="rounded-b-none rounded-l-none w-16"
              />
              <NumericButton icon={TbNumber6} onClick={() => handleNumericButton("6")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber9} onClick={() => handleNumericButton("9")} className="rounded-none w-16" />
              <ActionButton
                icon={TbDecimal}
                className="rounded-t-none rounded-l-none w-16"
                onClick={() => handleNumericButton(".")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("general.discard")}
          </Button>
          <Button type="button" onClick={handleConfirmButton}>
            {t("general.continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
