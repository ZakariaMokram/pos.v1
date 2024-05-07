import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { numericFormat } from "@/lib/helpers";
import { chosenAgentAtom, orderAtom, updateSelectedItemAtom } from "@/app/store/atoms/orders";
import { useTranslation } from "react-i18next";

export const OrderSummary = () => {
  const { t } = useTranslation();

  const order = useAtomValue(orderAtom);
  const agent = useAtomValue(chosenAgentAtom);
  const updateSelectedItem = useSetAtom(updateSelectedItemAtom);

  const [taxes, setTaxes] = useState({ tva: 0, ttc: 0 });

  useEffect(() => {
    const tvaRate = agent?.tvaRate || 0;
    const tva = (order.total * tvaRate) / 100;
    setTaxes({ tva: tva, ttc: order.total + tva });
  }, [agent, order]);

  const handleRowClick = (id) => {
    const selected = order.items.find((item) => item.id === id);
    updateSelectedItem(selected);
  };

  const renderItems = () => {
    const selectedItemStyle = (item) =>
      order.items.find((item) => item.selected === true)?.id === item.id ? "bg-orange-100 hover:bg-orange-100" : "";

    return order.items.map((item) => (
      <TableRow
        key={item.details.id}
        className={`cursor-pointer ${selectedItemStyle(item)}`}
        onClick={() => handleRowClick(item.id)}
      >
        <TableCell className="font-medium text-xs">{item.details.name}</TableCell>
        <TableCell className="text-xs text-right">{numericFormat(Number(item.details.price))}</TableCell>
        <TableCell className="text-xs text-center">{item.quantity}</TableCell>
        <TableCell className="text-xs text-right font-medium">
          {numericFormat(item.details.price * item.quantity)}
        </TableCell>
      </TableRow>
    ));
  };

  const renderEmpty = () => (
    <TableRow className="text-center">
      <TableCell colSpan={4} className="text-neutral-700 font-medium p-6">
        {t("orders.summaryTable.summaryDesc")}
      </TableCell>
    </TableRow>
  );

  const renderTotals = () => (
    <Table className="mt-4">
      <TableBody>
        <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
          <TableCell colSpan={3} className="text-neutral-900 font-semibold">
            {t("general.total")}
          </TableCell>
          <TableCell className="text-right font-semibold">{numericFormat(order.subTotal)}</TableCell>
        </TableRow>
        <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
          <TableCell colSpan={3} className="text-neutral-900 font-semibold">
            {t("orders.summaryTable.discount")}
          </TableCell>
          <TableCell className="text-right font-semibold">{numericFormat(order.discount) || "0.00"}</TableCell>
        </TableRow>
        <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
          <TableCell colSpan={3} className="text-neutral-900 font-semibold">
            {t("orders.summaryTable.totalAfterDiscount")}
          </TableCell>
          <TableCell className="text-right font-semibold">{numericFormat(order.total)}</TableCell>
        </TableRow>
        {agent !== undefined && agent !== null && (
          <React.Fragment>
            <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
              <TableCell colSpan={3} className="text-neutral-900 font-semibold">
                TVA
              </TableCell>
              <TableCell className="text-right font-semibold">{numericFormat(taxes.tva)}</TableCell>
            </TableRow>

            <TableRow className="text-xs font-medium border-t border-zinc-300 border-dashed">
              <TableCell colSpan={3} className="text-neutral-900 font-semibold">
                Total TTC
              </TableCell>
              <TableCell className="text-right font-semibold">{numericFormat(taxes.ttc)}</TableCell>
            </TableRow>
          </React.Fragment>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-wrap gap-3 mt-2 pb-8 max-h-[calc(100vh-380px)] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="uppercase text-xs">
            <TableHead className="min-w-[100px]">{t("orders.summaryTable.item")}</TableHead>
            <TableHead className="text-right min-w-[80px]">{t("orders.summaryTable.price")}</TableHead>
            <TableHead className="text-center">{t("orders.summaryTable.quantity")}</TableHead>
            <TableHead className="text-right min-w-[80px]">{t("general.total")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{order?.items.length > 0 ? renderItems() : renderEmpty()}</TableBody>
      </Table>
      {order && renderTotals()}
    </div>
  );
};
