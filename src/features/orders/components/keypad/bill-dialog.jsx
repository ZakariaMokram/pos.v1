import React from "react";

import { instance as axios } from "@/app/axios";

import { useAtomValue } from "jotai";
import { orderAtom } from "@/app/store/atoms/orders";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export const BillDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const order = useAtomValue(orderAtom);

  const handleContinueButton = async () => {
    await axios
      .post("/print/receipt", null, { params: { id: order?.id } })
      .then(() => {
        markItemsPrinted();
        toast({
          title: "Receipt is Ready",
          description: "A copy of the receipt has been printed.",
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialogs.confirmationAlertTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("dialogs.billConfirmationDesc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("general.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueButton}>{t("general.continue")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
