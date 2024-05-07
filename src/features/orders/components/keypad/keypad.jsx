import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import {
  TbAffiliate,
  TbBackspace,
  TbDecimal,
  TbDivide,
  TbLetterQ,
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
  TbReceipt,
  TbSwitchVertical,
  TbTrash,
  TbUsersGroup,
} from "react-icons/tb";

import {
  orderAtom,
  deleteItemAtom,
  updateDiscountAtom,
  updateItemPriceAtom,
  updateItemQuantityAtom,
} from "@/app/store/atoms/orders";

import { Button } from "@/components/ui/button";
import { OrderDialog } from "@/features/orders/components/keypad/order-dialog";
import { PaymentDialog } from "@/features/orders/components/keypad/payment-dialog";
import { GuestsDialog } from "@/features/orders/components/keypad/guests-dialog";

import { ActionButton, NumericButton } from "./custom-buttons";
import { AgentsDialog } from "./agents-dialog";
import { BillDialog } from "./bill-dialog";
import { DiscountDialog } from "./dialog-discount";
import { authenticatedUserAtom } from "@/app/store/atoms/auth";
import { AdminAuthDialog } from "./admin-auth-dialog";
import { useTranslation } from "react-i18next";
import { selectedTableAtom } from "@/app/store/atoms/tables";
import { useNavigate } from "react-router-dom";

export const Keypad = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const controlButtons = [
    { id: 1, icon: TbLetterQ, className: "rounded-b-none" },
    { id: 2, icon: TbPercentage, className: "rounded-none" },
  ];

  const order = useAtomValue(orderAtom);
  const deleteItem = useSetAtom(deleteItemAtom);
  const updatePrice = useSetAtom(updateItemPriceAtom);
  const selectedTable = useAtomValue(selectedTableAtom);
  const updateDiscount = useSetAtom(updateDiscountAtom);
  const updateQuantity = useSetAtom(updateItemQuantityAtom);
  const authenticatedUser = useAtomValue(authenticatedUserAtom);

  const [selectedButton, setSelectedButton] = useState(controlButtons[0]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [openDialogPayment, setOpenDialogPayment] = useState(false);
  const [openGuestsDialog, setOpenGuestsDialog] = useState(false);
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [openAgentsDialog, setOpenAgentsDialog] = useState(false);
  const [openDiscountDialog, setOpenDiscountDialog] = useState(false);
  const [openAdminAuthDialog, setOpenAdminAuthDialog] = useState(false);
  const [transferAbility, setTransferAbility] = useState(false);

  const handleNumericButton = (number) => setInputValue((prevValue) => prevValue + number);
  const handleBackspaceButton = () => setInputValue(inputValue.slice(0, -1));
  const handleDeleteItem = () => deleteItem();
  const handlePlaceOrder = () => setIsOrderDialogOpen(true);
  const handleControlButton = (id) => {
    setSelectedButton(controlButtons.find((button) => button.id === id));
  };

  const handleOpenDiscountDialog = () => {
    if (authenticatedUser.role === "ADMIN") setOpenDiscountDialog(true);
    else setOpenAdminAuthDialog(true);
  };

  const handleTableTransfer = () => {
    const state = order?.id !== null ? { action: "TRANSFER", order } : { action: "TRANSFER", order: null };
    navigate("/tables", { state });
  };

  useEffect(() => {
    const updates = { 1: updateQuantity, 2: updateDiscount, 3: updatePrice };

    if (selectedButton.id === 2) {
      setOpenDiscountDialog(true);
    } else if (inputValue !== "") {
      updates[selectedButton.id]
        ? updates[selectedButton.id](Number(Math.floor(inputValue)))
        : updates[3](Number(inputValue).toFixed(2));
    }
  }, [inputValue]);

  useEffect(() => {
    const selected = order.items.find((element) => element.selected);
    if (selected && selectedItem && selected.id === selectedItem.id) return;
    else setSelectedItem(selected);
  }, [order]);

  useEffect(() => {
    setInputValue("");
  }, [selectedButton, selectedItem]);

  useEffect(() => {
    if ((order.id && order.orderType !== null && order.orderType === "AT_THE_TABLE") || selectedTable !== null)
      setTransferAbility(true);
    else setTransferAbility(false);
  }, [order, selectedTable]);

  return (
    <div className="flex flex-col mt-auto py-4 border-t border-neutral-200 border-dashed mb-16 min-h-[22rem]">
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <Button
          className="flex-grow h-10 font-semibold border-zinc-300"
          onClick={() => setOpenBillDialog(true)}
          disabled={!order?.id}
          variant="outline"
        >
          <TbReceipt className="me-2" />
          {t("orders.bill")}
        </Button>
        <Button
          className="flex-grow h-10 font-semibold border-zinc-300"
          onClick={() => setOpenAgentsDialog(true)}
          variant="outline"
        >
          <TbAffiliate className="me-2" />
          {t("orders.agents.agents")}
        </Button>
      </div>

      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <Button
          className="flex-grow h-10 font-semibold border-zinc-300"
          onClick={() => setOpenGuestsDialog(true)}
          variant="outline"
        >
          <TbUsersGroup className="me-2" />
          {t("orders.guests.guests")}
        </Button>
        <Button className="flex-grow h-10 font-semibold border-zinc-300" variant="outline">
          <TbDivide className="me-2" />
          {t("orders.split")}
        </Button>
        <Button
          className="flex-grow h-10 font-semibold border-zinc-300"
          onClick={handleTableTransfer}
          disabled={!transferAbility}
          variant="outline"
        >
          <TbSwitchVertical className="me-2" />
          {t("orders.transfer")}
        </Button>
      </div>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col">
          <ActionButton
            icon={controlButtons[0].icon}
            onClick={() => handleControlButton(controlButtons[0].id)}
            className={`${controlButtons[0].className} ${
              selectedButton && selectedButton.id === controlButtons[0].id
                ? "h-[5.25rem] bg-stone-300 hover:bg-stone-300"
                : "h-[5.25rem] bg-white"
            }`}
          />

          <ActionButton
            icon={controlButtons[1].icon}
            onClick={handleOpenDiscountDialog}
            className={`${controlButtons[1].className} ${
              selectedButton && selectedButton.id === controlButtons[1].id
                ? "h-[5.25rem] bg-stone-300 hover:bg-stone-300"
                : "h-[5.25rem] bg-white"
            }`}
          />

          <ActionButton icon={TbTrash} className="rounded-t-none" variant="destructive" onClick={handleDeleteItem} />
        </div>

        <div className="flex">
          <div className="flex flex-col">
            <NumericButton
              icon={TbNumber1}
              onClick={() => handleNumericButton("1")}
              className="rounded-b-none rounded-r-none"
            />
            <NumericButton icon={TbNumber4} onClick={() => handleNumericButton("4")} className="rounded-none" />
            <NumericButton icon={TbNumber7} onClick={() => handleNumericButton("7")} className="rounded-none" />
            <ActionButton
              icon={TbBackspace}
              className="rounded-t-none rounded-r-none"
              onClick={handleBackspaceButton}
            />
          </div>
          <div className="flex flex-col">
            <NumericButton icon={TbNumber2} onClick={() => handleNumericButton("2")} className="rounded-none" />
            <NumericButton icon={TbNumber5} onClick={() => handleNumericButton("5")} className="rounded-none" />
            <NumericButton icon={TbNumber8} onClick={() => handleNumericButton("8")} className="rounded-none" />
            <NumericButton icon={TbNumber0} onClick={() => handleNumericButton("0")} className="rounded-none" />
          </div>
          <div className="flex flex-col">
            <NumericButton
              icon={TbNumber3}
              onClick={() => handleNumericButton("3")}
              className="rounded-b-none rounded-l-none"
            />
            <NumericButton icon={TbNumber6} onClick={() => handleNumericButton("6")} className="rounded-none" />
            <NumericButton icon={TbNumber9} onClick={() => handleNumericButton("9")} className="rounded-none" />
            <ActionButton
              icon={TbDecimal}
              className="rounded-t-none rounded-l-none"
              onClick={() => handleNumericButton(".")}
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow gap-2">
          <Button
            variant="outline"
            className="h-20 font-semibold border-stone-300 bg-stone-300 hover:bg-stone-300"
            onClick={() => setOpenDialogPayment(true)}
            disabled={!order?.id}
          >
            {t("orders.payment.payment")}
          </Button>
          <Button className="flex-grow" onClick={handlePlaceOrder}>
            {t("orders.order.order")}
          </Button>
        </div>
      </div>

      <OrderDialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen} />
      <PaymentDialog open={openDialogPayment} onOpenChange={setOpenDialogPayment} />
      <DiscountDialog open={openDiscountDialog} onOpenChange={setOpenDiscountDialog} />
      <GuestsDialog open={openGuestsDialog} onOpenChange={setOpenGuestsDialog} />
      <AgentsDialog open={openAgentsDialog} onOpenChange={setOpenAgentsDialog} />
      <BillDialog open={openBillDialog} onOpenChange={setOpenBillDialog} />
      <AdminAuthDialog
        open={openAdminAuthDialog}
        onOpenChange={setOpenAdminAuthDialog}
        openDiscountDialog={() => setOpenDiscountDialog(true)}
      />
    </div>
  );
};
