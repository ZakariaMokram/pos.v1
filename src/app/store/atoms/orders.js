import { atom } from "jotai";

export const orderAtom = atom({ id: null, items: [], subTotal: 0, discount: 0, discountType: "PERCENTAGE", total: 0 });

export const guestsAtom = atom(1);

export const agentsAtom = atom([]);
export const chosenAgentAtom = atom();

export const updateItemsAtom = atom(null, (get, set, newItem) => {
  const currentOrder = get(orderAtom);
  const existingItem = currentOrder.items.find((item) => item.id === newItem.id && !item.customized);

  const updatedItems = existingItem
    ? currentOrder.items.map((item) =>
        item.id === existingItem.id && !item.customized ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...currentOrder.items, { ...newItem, quantity: 1, selected: false, customized: false }];

  const subTotal = updatedItems.reduce((acc, item) => acc + item.details.price * item.quantity, 0);

  const calculatedDiscount =
    currentOrder?.discountType === "PERCENTAGE"
      ? (currentOrder.subTotal * currentOrder?.discount) / 100
      : currentOrder?.discount;

  const updatedOrder = {
    ...currentOrder,
    items: updatedItems,
    subTotal: updatedItems.reduce((acc, item) => acc + item.details.price * item.quantity, 0),
    total: subTotal - calculatedDiscount,
  };

  set(orderAtom, updatedOrder);
});

export const deleteItemAtom = atom(null, (get, set) => {
  const currentOrder = get(orderAtom);
  const updatedItems = currentOrder.items.filter((item) => !item.selected);

  const subTotal = updatedItems.reduce((acc, item) => acc + item.details.price * item.quantity, 0);

  const calculatedDiscount =
    currentOrder?.discountType === "PERCENTAGE"
      ? (currentOrder.subTotal * currentOrder?.discount) / 100
      : currentOrder?.discount;

  const total = subTotal - calculatedDiscount;

  const updatedOrder = { ...currentOrder, items: updatedItems, subTotal, total };
  set(orderAtom, updatedOrder);
});

export const updateDiscountAtom = atom(null, (get, set, { discount, type }) => {
  const currentOrder = get(orderAtom);
  const calculatedDiscount = type === "PERCENTAGE" ? (currentOrder.subTotal * discount) / 100 : discount;

  const updatedOrder = {
    ...currentOrder,
    discountType: type,
    discount: discount,
    total: currentOrder.subTotal - calculatedDiscount,
  };

  set(orderAtom, updatedOrder);
});

export const updateSelectedItemAtom = atom(null, (get, set, itemToSelect) => {
  const currentOrder = get(orderAtom);

  const updatedItems = currentOrder.items.map((item) => {
    if (item.selected) return { ...item, selected: false };
    if (item.id === itemToSelect.id && item.selected) return { ...item, selected: false };
    if (item.id === itemToSelect.id) return { ...item, selected: true };
    return item;
  });

  const updatedOrder = { ...currentOrder, items: updatedItems };
  set(orderAtom, updatedOrder);
});

export const updateItemPriceAtom = atom(null, (get, set, newPrice) => {
  const currentOrder = get(orderAtom);
  const updatedItems = currentOrder.items.map((item) => {
    if (!item.selected) return item;
    return { ...item, details: { ...item.details, price: newPrice } };
  });

  const subTotal = updatedItems.reduce((acc, item) => acc + item.details.price * item.quantity, 0);

  const calculatedDiscount =
    currentOrder?.discountType === "PERCENTAGE"
      ? (currentOrder.subTotal * currentOrder?.discount) / 100
      : currentOrder?.discount;

  const total = subTotal - calculatedDiscount;

  const updatedOrder = { ...currentOrder, items: updatedItems, subTotal, total };
  set(orderAtom, updatedOrder);
});

export const updateItemQuantityAtom = atom(null, (get, set, newQuantity) => {
  const currentOrder = get(orderAtom);
  const updatedItems = currentOrder.items.map((item) => {
    if (!item.selected) return item;
    return { ...item, quantity: newQuantity };
  });

  const subTotal = updatedItems.reduce((acc, item) => acc + item.details.price * item.quantity, 0);

  const calculatedDiscount =
    currentOrder?.discountType === "PERCENTAGE"
      ? (currentOrder.subTotal * currentOrder?.discount) / 100
      : currentOrder?.discount;

  const total = subTotal - calculatedDiscount;

  const updatedOrder = { ...currentOrder, items: updatedItems, subTotal, total };
  set(orderAtom, updatedOrder);
});

export const updateOrderIdAtom = atom(null, (get, set, newId) => {
  const currentOrder = get(orderAtom);
  const updatedOrder = { ...currentOrder, id: newId };
  set(orderAtom, updatedOrder);
});

export const markItemsPrintedAtom = atom(null, (get, set) => {
  const currentOrder = get(orderAtom);
  const updatedItems = currentOrder.items.map((item) => ({ ...item, printed: true }));
  const updatedOrder = { ...currentOrder, items: updatedItems };
  set(orderAtom, updatedOrder);
});

export const addItemWithCustomizationAtom = atom(null, (get, set, { newItem, elements }) => {
  const currentOrder = get(orderAtom);
  const updatedItems = [
    ...currentOrder.items,
    {
      id: newItem.id,
      details: { ...newItem, name: `${newItem.name} (Personnalisé)` },
      quantity: 1,
      selected: false,
      added: elements,
      customized: true,
    },
  ];

  const subTotal = updatedItems.reduce((acc, item) => acc + (item.details.price || 0) * item.quantity, 0);

  const updatedOrder = {
    ...currentOrder,
    items: updatedItems,
    subTotal: updatedItems.reduce((acc, item) => acc + (item.details.price || 0) * item.quantity, 0),
    total: subTotal - (subTotal * currentOrder.discount) / 100,
  };

  set(orderAtom, updatedOrder);
});
