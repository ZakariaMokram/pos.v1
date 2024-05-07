import React, { useState } from "react";

import { instance as axios } from "@/app/axios";

import {
  TbBackspace,
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
} from "react-icons/tb";

import { useAtom } from "jotai";
import { guestsAtom, orderAtom } from "@/app/store/atoms/orders";

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

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const GuestsDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();

  const [order] = useAtom(orderAtom);
  const [guests, setGuests] = useAtom(guestsAtom);
  const [inputValue, setInputValue] = useState(guests.toString());

  const handleNumericButton = (number) => setInputValue((prevValue) => prevValue + number);
  const handleBackspaceButton = () => setInputValue(inputValue.slice(0, -1));
  const handleConfirmButton = async () => {
    setGuests(Number(inputValue) || 0);
    if (order.id != null) {
      await axios.post("/orders/guests", null, {
        params: { id: order.id, guests: Number(inputValue) },
      });
    }
    onOpenChange(false);
  };

  const ActionButton = ({ onClick, className, icon: Icon, variant }) => (
    <Button
      className={cn("h-12 w-16 font-semibold text-base border-zinc-300", className)}
      variant={variant ? variant : "outline"}
      onClick={onClick}
      size="icon"
    >
      {Icon ? <Icon /> : ""}
    </Button>
  );

  const NumericButton = ({ number, className, icon: Icon }) => (
    <Button
      className={cn("h-12 w-16 font-semibold text-base border-zinc-300", className)}
      onClick={() => handleNumericButton(number)}
      variant={"outline"}
      size="icon"
    >
      {Icon ? <Icon /> : ""}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.guests.guests")}</DialogTitle>
          <DialogDescription>{t("orders.guests.guestsDialogDesc")}</DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col w-full gap-3 items-center justify-center p-2">
          <Input className="border-zinc-300 text-center w-48" value={inputValue} readOnly />

          <div className="flex">
            <div className="flex flex-col">
              <NumericButton number="1" icon={TbNumber1} className="rounded-b-none rounded-r-none" />
              <NumericButton number="4" icon={TbNumber4} className="rounded-none" />
              <NumericButton number="7" icon={TbNumber7} className="rounded-none" />
              <ActionButton
                icon={TbBackspace}
                className="bg-red-500 text-white hover:bg-red-500 hover:text-white border-none rounded-t-none rounded-r-none w-16"
                onClick={handleBackspaceButton}
              />
            </div>
            <div className="flex flex-col">
              <NumericButton number="2" icon={TbNumber2} className="rounded-none" />
              <NumericButton number="5" icon={TbNumber5} className="rounded-none" />
              <NumericButton number="8" icon={TbNumber8} className="rounded-none" />
              <NumericButton number="0" icon={TbNumber0} className="rounded-none" />
            </div>
            <div className="flex flex-col">
              <NumericButton number="3" icon={TbNumber3} className="rounded-b-none rounded-l-none" />
              <NumericButton number="6" icon={TbNumber6} className="rounded-none" />
              <NumericButton number="9" icon={TbNumber9} className="rounded-none" />
              <ActionButton className="rounded-t-none rounded-l-none" />
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
