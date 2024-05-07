import React, { useEffect, useState } from "react";

import {
  TbBackspace,
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
} from "react-icons/tb";

import { useAtomValue } from "jotai";
import { orderAtom } from "@/app/store/atoms/orders";

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
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { numericFormat } from "@/lib/helpers";

import { instance as axios } from "@/app/axios";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export const PaymentDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const paymentButtons = [
    { id: 1, content: "Cash" },
    { id: 2, content: "TPE" },
  ];

  const [inputValue, setInputValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentButtons[0]);
  const [valueToShow, setValueToShow] = useState("");
  const [paymentValues, setPaymentValues] = useState({});
  const [toGiveBack, setToGiveBack] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const order = useAtomValue(orderAtom);

  const handleNumericButton = (number) => setInputValue((prevValue) => prevValue + number);
  const handleBackspaceButton = () => setInputValue(inputValue.slice(0, -1));
  const handlePaymentTypeButton = (id) => setPaymentMethod(paymentButtons.find((b) => b.id === id));

  const handlePaymentButton = async () => {
    const paymentData = Object.keys(paymentValues).map((key) => {
      return {
        orderId: order.id,
        amount: paymentValues[key].value,
        paymentType: key.toUpperCase(),
      };
    });

    await axios
      .post("/payments/order", paymentData)
      .then(async () => {
        await axios.post("/print/receipt", null, { params: { id: order.id } });

        toast({
          title: "Payment Confirmation",
          description: "Your payment has been successfully processed.",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your payment. Please try again.",
        })
      );
  };

  const handleAppendButton = () => {
    const lowerCaseMethod = paymentMethod.content.toLowerCase();
    setPaymentValues((prev) => ({
      ...prev,
      [lowerCaseMethod]: { value: Number(valueToShow), label: paymentMethod.content },
    }));
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

  useEffect(() => {
    setValueToShow(Number(inputValue).toFixed(2));
  }, [inputValue]);

  useEffect(() => {
    setInputValue("");
  }, [paymentMethod]);

  useEffect(() => {
    const values = Object.keys(paymentValues).map((key) => {
      return paymentValues[key].value;
    });

    const sum = values.reduce((a, b) => a + b, 0);

    if (order.total - sum >= 0) {
      setRemaining(order.total - sum);
      setToGiveBack(0);
    } else {
      setToGiveBack((order.total - sum) * -1);
      setRemaining(0);
    }
  }, [paymentValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[50%] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t("orders.payment.payment")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          <div className="min-w-[55%] flex flex-col p-2 gap-3">
            <div className="w-full flex items-center justify-between gap-2">
              {paymentButtons.map((e) => (
                <Button
                  onClick={() => handlePaymentTypeButton(e.id)}
                  className={`${
                    paymentMethod && paymentMethod.id === e.id
                      ? "flex-grow font-semibold border-zinc-300 bg-stone-200 hover:bg-stone300"
                      : "flex-grow font-semibold border-zinc-300 transparent"
                  }`}
                  variant="outline"
                  key={e.id}
                >
                  {e.content}
                </Button>
              ))}
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <Card className="w-full shadow-none min-h-24 border-zinc-300 p-2">
                <Table>
                  <TableBody>
                    {Object.keys(paymentValues).map((key) => {
                      return (
                        <TableRow className="text-xs font-medium" key={key}>
                          <TableCell colSpan={3} className="text-neutral-900 font-semibold">
                            {paymentValues[key].label}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {numericFormat(paymentValues[key].value)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {Object.keys(paymentValues).length !== 0 && <Separator className="my-4" />}

                <Table className="mt-4">
                  <TableBody>
                    <TableRow className="text-xs font-medium border-none">
                      <TableCell colSpan={3} className="text-neutral-900 font-semibold">
                        {t("general.total")}
                      </TableCell>
                      <TableCell className="text-right font-semibold">{numericFormat(order.total)}</TableCell>
                    </TableRow>
                    <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
                      <TableCell colSpan={3} className="text-neutral-900 font-semibold">
                        {t("orders.payment.remaining")}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-500">
                        {numericFormat(remaining)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
                      <TableCell colSpan={3} className="text-neutral-900 font-semibold">
                        {t("orders.payment.toGiveBack")}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-500">
                        {numericFormat(toGiveBack)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
          <div className="flex flex-col w-full gap-3 items-center justify-center p-2">
            <Input className="border-zinc-300 text-center w-48" value={valueToShow} readOnly />

            <div className="flex">
              <div className="flex flex-col">
                <NumericButton number="1" icon={TbNumber1} className="rounded-b-none rounded-r-none" />
                <NumericButton number="4" icon={TbNumber4} className="rounded-none" />
                <NumericButton number="7" icon={TbNumber7} className="rounded-none" />
                <ActionButton
                  icon={TbBackspace}
                  className="rounded-t-none rounded-r-none"
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
                <ActionButton
                  icon={TbDecimal}
                  className="rounded-t-none rounded-l-none"
                  onClick={() => handleNumericButton(".")}
                />
              </div>
            </div>

            <Button className="w-48" onClick={handleAppendButton}>
              {t("buttons.append")}
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-start px-2">
          <Button type="submit" onClick={handlePaymentButton}>
            {t("buttons.payNow")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="bg-zinc-200 hover:bg-zinc-300"
            onClick={() => onOpenChange(false)}
          >
            {t("general.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
