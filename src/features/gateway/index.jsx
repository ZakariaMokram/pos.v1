import * as React from "react";
import { NavLink } from "react-router-dom";
import { TbCheese, TbLayoutGrid, TbReport, TbSettings } from "react-icons/tb";

import { MainHeader } from "@/components/composite/headers";
import { ProtectedRoute } from "@/components/composite/protected-route";
import { useTranslation } from "react-i18next";

function MenuItem({ path, label, icon: Icon }) {
  return (
    <NavLink to={path} className="flex flex-col items-center w-28 p-4 overflow-hidden">
      <div className="h-20 w-20 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
        <Icon className="text-2xl font-medium" />
      </div>
      <span className="mt-3 text-center text-sm font-medium text-gray-700">{label}</span>
    </NavLink>
  );
}

export default function Gateway() {
  const { t } = useTranslation();

  const menuLinks = [
    { id: 1, label: t("gateway.orderRequest"), icon: TbCheese, path: "/orders" },
    { id: 3, label: t("gateway.dailySummaries"), icon: TbReport, path: "/summaries" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <div className="flex flex-col gap-3">
          <MainHeader prevButtonIncluded={false} />
          <div className="min-w-screen flex items-center justify-center mt-6">
            {menuLinks.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center text-neutral-500 text-xs font-medium py-6">
          V0.3.0 PRODUCTION © JWAY SERVICES 2024
        </div>
      </div>
    </ProtectedRoute>
  );
}
