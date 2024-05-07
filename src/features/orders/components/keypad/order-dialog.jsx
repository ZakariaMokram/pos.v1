import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import { instance as axios } from "@/app/axios";
import { floorAndAreaByTableIdAtom, selectedTableAtom } from "@/app/store/atoms/tables";
import { chosenAgentAtom, markItemsPrintedAtom, orderAtom, updateOrderIdAtom } from "@/app/store/atoms/orders";
import { authenticatedUserAtom } from "@/app/store/atoms/auth";
import { useTranslation } from "react-i18next";

export const OrderDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [selectedTab, setSelectedTab] = useState("AT_THE_TABLE");
  const [tabTriggers] = useState([
    { id: 1, code: "AT_THE_TABLE", label: t("orders.order.atTheTable") },
    { id: 2, code: "IN_HOUSE", label: t("orders.order.onTheSpot") },
    { id: 3, code: "TAKEAWAY", label: t("orders.order.takeaway") },
    { id: 4, code: "DELIVERY", label: t("orders.order.delivery") },
  ]);

  const order = useAtomValue(orderAtom);
  const chosenAgent = useAtomValue(chosenAgentAtom);
  const selectedTable = useAtomValue(selectedTableAtom);
  const updateOrderId = useSetAtom(updateOrderIdAtom);
  const markItemsPrinted = useSetAtom(markItemsPrintedAtom);
  const authenticatedUser = useAtomValue(authenticatedUserAtom);

  const customizationType = (item) => {
    if (item.added && item.added.length > 0) {
      const items = item?.added?.filter((element) => element.type === "addOn" && element.quantity !== "");
      const resources = item?.added?.filter((element) => element.type === "ingredient");
      const cleanedResources = resources?.filter((e) => Number(e?.quantity) !== e?.data?.amount);

      return [
        ...items?.map((e) => ({
          id: e.data.id,
          customizationType: "ADDITION",
          itemType: e.data.type,
          quantity: Number(e.quantity),
          cost: e?.data?.item?.price || 0,
        })),
        ...cleanedResources?.map((e) => ({
          id: e.data.id,
          customizationType: Number(e?.quantity) > e?.data?.amount ? "ADDITION" : "REMOVAL",
          itemType: "INGREDIENT",
          quantity: Number(e.quantity),
          cost: e?.data?.price || 0,
        })),
      ];
    } else return [];
  };

  async function onSubmit() {
    try {
      const orderData = {
        items: order.items.flatMap((item) =>
          Array(item.quantity)?.fill({
            id: item.id,
            totalPrice: item.details.price,
            customizations: customizationType(item),
            specialInstructions: "",
          })
        ),
        discount: order.discount,
        discountType: "PERCENTAGE",
        orderType: selectedTab,
        diningTable: selectedTable?.id || undefined,
        tvaRate: chosenAgent?.tvaRate,
        guests: order?.guests,
        user: authenticatedUser?.id,
      };

      const response = await axios.post("/orders/create", orderData);
      updateOrderId(Number(response.data));

      await axios.post("/print/order", null, { params: { id: Number(response.data) } });
      markItemsPrinted();

      toast({
        title: "Order Confirmed",
        description: "Order received! We'll notify you when it's ready.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }

    onOpenChange(false);
  }

  useEffect(() => {
    if (selectedTab === "AT_THE_TABLE" && !selectedTable) setSubmitDisabled(true);
    else setSubmitDisabled(false);
  }, [selectedTab]);

  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-2xl no-select" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t("orders.order.confirmation")}</DialogTitle>
            <DialogDescription>{t("orders.order.orderDialogDesc")}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="AT_THE_TABLE" className="mt-2">
            <TabsList className="grid w-full grid-cols-4 bg-stone-200">
              {tabTriggers.map((e) => (
                <TabsTrigger
                  key={e.id}
                  value={e.code}
                  className="text-xs uppercase"
                  onClick={() => setSelectedTab(e.code)}
                  disabled={selectedTable !== null && e.label !== "AT_THE_TABLE"}
                >
                  {e.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="min-h-56">
              <TableType />
              <InHouseType />
              <TakeawayType />
              <DeliveryType />
            </div>
          </Tabs>

          <DialogFooter className="">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("general.discard")}
            </Button>
            <Button type="submit" onClick={onSubmit} disabled={submitDisabled}>
              {t("general.continue")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const TableType = () => {
  const { t } = useTranslation();

  const table = useAtomValue(selectedTableAtom);
  const floorWithArea = useAtomValue(floorAndAreaByTableIdAtom);

  return (
    <TabsContent value="AT_THE_TABLE" className="h-full">
      <div className="flex flex-col gap-3 w-full">
        {table && floorWithArea ? (
          <Table className="mt-3">
            <TableCaption>{t("orders.order.tableConfirmation")}</TableCaption>
            <TableHeader>
              <TableRow className="uppercase text-xs">
                <TableHead>{t("tables.floor")}</TableHead>
                <TableHead className="text-center">{t("tables.area")}</TableHead>
                <TableHead className="text-center">{t("tables.table")}</TableHead>
                <TableHead className="text-center">{t("tables.chairs")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{floorWithArea.floor.name}</TableCell>
                <TableCell className="text-center">{floorWithArea.area.name}</TableCell>
                <TableCell className="text-center">{table.number}</TableCell>
                <TableCell className="text-center">{table.chairs}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="text-sm text-center px-4 py-8 text-stone-600">{t("orders.order.atTheTableDesc")}</div>
        )}

        <div className="flex gap-1 w-full"></div>
      </div>
    </TabsContent>
  );
};

const InHouseType = () => {
  const { t } = useTranslation();

  return (
    <TabsContent value="IN_HOUSE" className="h-full">
      <div className="flex flex-col gap-3 w-full">
        <div className="text-sm text-center px-4 py-8 text-stone-600">{t("orders.order.onTheSpotDesc")}</div>
      </div>
    </TabsContent>
  );
};

const TakeawayType = () => {
  const { t } = useTranslation();

  return (
    <TabsContent value="TAKEAWAY" className="h-full">
      <div className="flex flex-col gap-3 w-full">
        <div className="text-sm text-center px-4 py-8 text-stone-600">{t("orders.order.takeawayDesc")}</div>
      </div>
    </TabsContent>
  );
};

const DeliveryType = () => {
  const { t } = useTranslation();

  return (
    <TabsContent value="DELIVERY" className="h-full">
      <div className="flex flex-col gap-3 w-full">
        <div className="text-sm text-center px-4 py-8 text-stone-600">{t("orders.order.deliveryDesc")}</div>
      </div>
    </TabsContent>
  );
};
