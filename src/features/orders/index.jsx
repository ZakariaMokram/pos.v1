import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";

import { useAtomValue, useSetAtom } from "jotai";

import useSWR from "swr";
import { fetcher } from "@/app/axios";

import { agentsAtom, chosenAgentAtom, orderAtom } from "@/app/store/atoms/orders";
import { categoriesAtom } from "@/app/store/atoms/categories";
import { selectedTableAtom } from "@/app/store/atoms/tables";
import { recipesAtom } from "@/app/store/atoms/recipes";

import { Loader } from "@/components/composite/spinners";
import { MainHeader } from "@/components/composite/headers";
import { OrderSummary, Keypad, MenuLayout } from "@/features/orders/components";
import { ProtectedRoute } from "@/components/composite/protected-route";
import { useTranslation } from "react-i18next";


export default function Orders() {
  const { t } = useTranslation();
  const [isSectionVisible, setIsSectionVisible] = useState(false); // État pour gérer la visibilité de la rubrique
  const [selectedItemCount, setSelectedItemCount] = useState(0); // État pour stocker le nombre d'éléments sélectionnés

  const headerLinks = [
    { id: 1, label: t("orders.menu.foodiesMenu"), path: "/orders" },
    { id: 2, label: t("orders.order.orderLine"), path: "/summaries" },
  ];

  const { data: categories, isLoading: categoriesLoading } = useSWR("/categories", fetcher);
  const { data: recipes, isLoading: recipesLoading } = useSWR("/items", fetcher);
  const { data: agents, isLoading: agentsLoading } = useSWR("/agents", fetcher);

  const order = useAtomValue(orderAtom);
  const addAgents = useSetAtom(agentsAtom);
  const addRecipes = useSetAtom(recipesAtom);
  const addCategories = useSetAtom(categoriesAtom);

  const updateTable = useSetAtom(selectedTableAtom);
  const updateOrder = useSetAtom(orderAtom);
  const updateAgent = useSetAtom(chosenAgentAtom);

  const navigate = useNavigate();

  const toggleSectionVisibility = () => {
    setIsSectionVisible(!isSectionVisible); // Inverser la visibilité de la rubrique
  };

  const handleEmptySelectedTable = () => {
    updateTable(null);
    updateAgent(null);
    updateOrder({ id: null, items: [], subTotal: 0, discount: 0, total: 0 });
  };

  useEffect(() => {
    !recipesLoading && recipes ? addRecipes([...recipes]) : addRecipes([]);
  }, [recipesLoading]);

  useEffect(() => {
    console.log(order)
    const quantity=order.items.reduce((acc,e) => acc + e.quantity,0);
    setSelectedItemCount(quantity)
  }, [order]);

  useEffect(() => {
    !categoriesLoading && categories ? addCategories([...categories]) : addCategories([]);
  }, [categoriesLoading]);

  useEffect(() => {
    !agentsLoading && agents ? addAgents([...agents]) : addAgents([]);
  }, [agentsLoading]);

  // Mettre à jour le compteur lorsque des éléments sont ajoutés à la rubrique OrderSummary et Keypad
  const handleItemAddition = () => {
    setSelectedItemCount(selectedItemCount + 1);
  };

  return (
    <ProtectedRoute>
      {!categoriesLoading && !recipesLoading ? (
        <div className="min-h-screen">
          <MainHeader prevButtonIncluded links={headerLinks} action={handleEmptySelectedTable} />
          <div className="h-svh flex px-8">
            <div className={`w-full flex flex-col ${isSectionVisible ? '' : 'flex-grow'}`}>{!recipesLoading && <MenuLayout handleItemAddition={handleItemAddition} />}</div>
            <div className="">
              {/* Bouton pour afficher/cacher la rubrique */}
              <button onClick={toggleSectionVisibility} className="absolute top-0 right-20 m-4 p-2 bg-white-300 rounded-full focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                { (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -top-1 -right-1">
                    {selectedItemCount}
                  </span>
                )}
              </button>
              
              {/* Contenu de la rubrique OrderSummary et Keypad */}
              {isSectionVisible && (
                <div className="flex flex-col flex-grow max-w-[32rem]">
                  <OrderSummary />
                  <Keypad />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Loader />
        </div>
      )}
    </ProtectedRoute>
  );
}
