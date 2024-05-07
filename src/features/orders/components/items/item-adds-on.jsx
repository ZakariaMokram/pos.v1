import React, { useEffect, useState } from "react";

import { useSetAtom } from "jotai";
import { addItemWithCustomizationAtom } from "@/app/store/atoms/orders";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import starIcon from "@/assets/images/star.png";
import { useTranslation } from "react-i18next";

export const ItemAddsOn = ({ open, onOpenChange, item }) => {
  const { t } = useTranslation();

  const [currentSelection, setCurrentSelection] = useState([]);
  const addItem = useSetAtom(addItemWithCustomizationAtom);

  const handleAppendItem = () => {
    addItem({ newItem: item, elements: currentSelection });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.addsOn.customize")}</DialogTitle>
          <DialogDescription>{t("orders.addsOn.customizeDesc")}</DialogDescription>
        </DialogHeader>

        <Separator className="bg-stone-200" />
        <DialogBody item={item} setCurrentSelection={setCurrentSelection} currentSelection={currentSelection} />
        <Separator className="bg-stone-200" />

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {t("general.cancel")}
          </Button>
          <Button onClick={handleAppendItem}>{t("general.continue")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DialogBody = ({ item, setCurrentSelection, currentSelection }) => {
  const { t } = useTranslation();

  const [hasSubItems] = useState(item?.compositions?.length > 0);
  const [checkboxesState, setCheckboxesState] = useState([]);
  const [addOnOptions, setAddOnOptions] = useState([]);

  useEffect(() => {
    setCheckboxesState(item.resources.map((res) => ({ id: res.id, state: true })));
  }, [item]);

  useEffect(() => {
    if (hasSubItems) setCurrentSelection(item?.compositions[0]);
    else setCurrentSelection(item);
  }, []);

  useEffect(() => {
    if (hasSubItems) setCurrentSelection(item?.compositions[0]);
    else setCurrentSelection(item);
  }, [hasSubItems]);

  useEffect(() => {
    const filteredAddOns = item?.addsOn?.filter((addOn) => addOn.type === "ITEM");

    const groupedList = filteredAddOns.reduce((acc, addon) => {
      const category = addon.item.category || {};
      acc.push({
        category,
        addsOns: (acc.find((item) => item.category.id === category.id)?.addsOns || []).concat(addon),
      });
      return acc;
    }, []);

    setAddOnOptions(groupedList);
  }, [item]);

  const handleCheckboxChange = (id) => {
    const currentState = !checkboxesState.find((cs) => cs.id === id)?.state;
    const element = item.resources.find((res) => res.id === id);

    setCheckboxesState((cb) => cb.map((e) => (e.id === id ? { ...e, state: !e.state } : e)));

    !currentState
      ? setCurrentSelection(
          currentSelection.length > 0
            ? currentSelection.some((item) => item.id === id)
              ? currentSelection.map((item) => (item.id === id ? { ...item, quantity: "0" } : item))
              : [...currentSelection, { id: id, quantity: "0", type: "ingredient", data: element }]
            : [{ id: id, quantity: "0", type: "ingredient", data: element }]
        )
      : setCurrentSelection(
          currentSelection.map((item) => (item.id === id ? { ...item, quantity: element?.amount?.toString() } : item))
        );
  };

  const addToCustomization = (id, quantity, type, element) =>
    setCurrentSelection((cs) =>
      currentSelection.length > 0
        ? cs.some((item) => item.id === id && item.type === type)
          ? cs.map((item) => (item.id === id ? { ...item, quantity } : item))
          : [...cs, { id, quantity, type, data: element }]
        : [{ id, quantity, type, data: element }]
    );

  return (
    <ScrollArea className="h-[50vh] w-full">
      <div className="flex flex-col gap-6 py-2">
        {addOnOptions.map((addOn) => (
          <React.Fragment key={`${addOn.id}-${addOn.category.id}`}>
            <div className="flex items-start gap-4">
              <div className="w-1/2 flex items-center gap-3">
                <img src={`${import.meta.env.VITE_SERVER_URL}/${addOn.category.iconPath}`} className="h-6" />
                <div className="">
                  <h4 className="font-semibold text-sm">{addOn.category.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("orders.addsOn.categoryDesc")}</p>
                </div>
              </div>

              <div className="w-1/2 flex flex-col gap-4">
                {addOn.addsOns.map((element) => (
                  <div className="w-full flex flex-col gap-2" key={element.id}>
                    <div className="w-full flex flex-col gap-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{element.item.name}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-500">{t("orders.addsOn.addOnHint", { num: element.max })}</p>
                      </div>
                    </div>

                    <Input onChange={(e) => addToCustomization(element.id, e.target.value, "addOn", element)} />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-stone-200" />
          </React.Fragment>
        ))}

        {item.resources.some((e) => !e.mandatory) && item.resources.length > 0 && (
          <React.Fragment>
            <div className="flex items-start gap-4">
              <div className="w-1/2 flex items-center gap-3">
                <img src={starIcon} className="h-6" />
                <div className="">
                  <h4 className="font-semibold text-sm">{t("orders.addsOn.ingredients")}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("orders.addsOn.ingredientsDesc")}</p>
                </div>
              </div>

              <div className="w-1/2 flex flex-col gap-4">
                {item?.resources?.map(
                  (element) =>
                    !element.mandatory && (
                      <div className="w-full flex flex-col gap-2" key={element.id}>
                        <div className="flex items-center justify-between">
                          <div className="w-full flex flex-col gap-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium leading-none">{element.name}</p>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs text-gray-500">
                                {t("orders.addsOn.ingredientsHint", {
                                  num: element.amount,
                                  unit: element.unitOfMeasure,
                                })}
                              </p>
                            </div>
                          </div>

                          <Checkbox
                            className="shadow-none"
                            checked={checkboxesState.find((e) => e.id === element.id)?.state}
                            onCheckedChange={() => handleCheckboxChange(element.id)}
                          />
                        </div>

                        <Input
                          defaultValue={element.amount}
                          onChange={(e) => addToCustomization(element.id, e.target.value, "ingredient", element)}
                          disabled={!checkboxesState.find((e) => e.id === element.id)?.state}
                        />
                      </div>
                    )
                )}
              </div>
            </div>

            <Separator className="bg-stone-200" />
          </React.Fragment>
        )}

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-sm">{t("orders.addsOn.specialInstructions")}</h4>
          <Textarea placeholder={t("orders.addsOn.specialInstructionsDesc")} />
        </div>
      </div>
    </ScrollArea>
  );
};
