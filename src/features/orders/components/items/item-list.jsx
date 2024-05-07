import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { recipesAtom } from "@/app/store/atoms/recipes";
import { categoriesAtom } from "@/app/store/atoms/categories";
import { updateItemsAtom } from "@/app/store/atoms/orders";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MenuItem } from "@/features/orders/components/items/item-card";

import starIcon from "@/assets/images/star.png";
import { useTranslation } from "react-i18next";

export const MenuLayout = () => {
  const { t } = useTranslation();

  const recipes = useAtomValue(recipesAtom);
  const categories = useAtomValue(categoriesAtom);
  const updateItem = useSetAtom(updateItemsAtom);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const handleCategoryChange = (value) => setSelectedCategory(value || "all");
  const handleAddItem = (item) => updateItem({ id: item.id, details: item, quantity: 1 });

  useEffect(() => {
    recipes && recipes.length > 0 && setFilteredRecipes(recipes);
    setFilteredRecipes(
      selectedCategory === "all" ? recipes : recipes.filter((item) => item.category.reference === selectedCategory)
    );
  }, [selectedCategory, recipes]);

  return (
    <React.Fragment>
      <div className="flex flex-col py-5">
        <div className="text-xl font-medium">{t("orders.menu.foodiesMenu")}</div>
        <div className="text-sm text-neutral-500">{t("orders.menu.foodiesMenuDesc")}</div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pe-6">
        <div className="flex items-center w-max">
          <ToggleGroup
            type="single"
            variant="outline"
            defaultValue={selectedCategory}
            onValueChange={(value) => handleCategoryChange(value)}
          >
            <ToggleGroupItem value="all" className="flex flex-col gap-1 h-16 data-[state=on]:bg-orange-100">
              <img src={starIcon} className="h-8" />
              <span className="text-xs font-semibold text-stone-600">{t("orders.menu.all")}</span>
            </ToggleGroupItem>
            {categories && categories.map((category) => <CategoryToggle key={category.id} category={category} />)}
          </ToggleGroup>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 mt-6 pb-8 max-h-[calc(100vh-220px)] overflow-y-auto">
        {filteredRecipes &&
          filteredRecipes.map((item) => <MenuItem key={item.id} details={item} onClick={() => handleAddItem(item)} />)}
      </div>
    </React.Fragment>
  );
};

const CategoryToggle = ({ category }) => {
  return (
    <ToggleGroupItem
      value={category.reference}
      className="flex flex-col gap-1 h-16 min-w-28 data-[state=on]:bg-orange-100"
    >
      <img src={`${import.meta.env.VITE_SERVER_URL}/${category.iconPath}`} className="h-8" />
      <span className="text-xs font-semibold text-stone-600">{category.name}</span>
    </ToggleGroupItem>
  );
};
