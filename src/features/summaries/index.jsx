import * as React from "react";
import useSWR from "swr";

import {
  CheckCircledIcon,
  ChevronDownIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import datetime from "moment";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainHeader } from "@/components/composite/headers";
import { fetcher } from "@/app/axios";
import { ProtectedRoute } from "@/components/composite/protected-route";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

import { BiBox, BiSolidTruck, BiRestaurant, BiBuilding } from "react-icons/bi";

function SummariesTable() {
  const { t } = useTranslation();

  const columns = [
    {
      accessorKey: "id",
      header: t("summaries.reference"),
      cell: ({ row }) => <div className="uppercase font-medium">{`ORD-${row.getValue("id")}`}</div>,
    },
    {
      accessorKey: "orderStatus",
      header: t("summaries.status"),
      cell: ({ row }) => {
        const status = row.getValue("orderStatus");

        const statusColors = {
          PLACED: "text-green-500",
          COMPLETED: "text-orange-600",
          PROGRESS: "text-blue-500",
          CANCELLED: "text-red-500",
        };

        const color = statusColors[status];

        const statusIcons = {
          PLACED: CircleIcon,
          COMPLETED: CheckCircledIcon,
          PROGRESS: StopwatchIcon,
          CANCELLED: CrossCircledIcon,
        };

        const Icon = statusIcons[status];

        const orderStatusText = {
          PLACED: t("summaries.placed"),
          COMPLETED: t("summaries.completed"),
          PROGRESS: t("summaries.progress"),
          CANCELLED: t("summaries.cancelled"),
        };

        return (
          <span className="flex items-center text-sm gap-2">
            <Icon className={cn(color)} /> {orderStatusText[status]}
          </span>
        );
      },
    },
    {
      accessorKey: "guests",
      header: ({}) => <div className="text-center">{t("summaries.guests")}</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("guests") || "-"}</div>,
    },
    {
      accessorKey: "orderType",
      header: t("summaries.orderType"),
      cell: ({ row }) => {
        const type = row.getValue("orderType");

        const typeColors = {
          AT_THE_TABLE: "text-teal-500",
          IN_HOUSE: "text-pink-600",
          TAKEAWAY: "text-orange-500",
          DELIVERY: "text-purple-500",
        };

        const typeIcons = {
          AT_THE_TABLE: BiRestaurant,
          IN_HOUSE: BiBuilding,
          TAKEAWAY: BiBox,
          DELIVERY: BiSolidTruck,
        };

        const Icon = typeIcons[type];

        const typeText = {
          AT_THE_TABLE: t("orders.order.atTheTable"),
          IN_HOUSE: t("orders.order.onTheSpot"),
          TAKEAWAY: t("orders.order.takeaway"),
          DELIVERY: t("orders.order.delivery"),
        };

        const colorClass = typeColors[type];

        return (
          <span className="flex items-center text-sm gap-2">
            <Icon className={cn(colorClass)} /> {typeText[type]}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("summaries.date"),
      cell: ({ row }) => <div>{datetime(row.getValue("createdAt")).format("DD/MM/YYYY HH:mm")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Action Button</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState();
  const [columnFilters, setColumnFilters] = React.useState();
  const [columnVisibility, setColumnVisibility] = React.useState();
  const [rowSelection, setRowSelection] = React.useState({});

  const [data, setData] = React.useState([]);
  const { data: orders, isLoading } = useSWR("/orders", fetcher);

  React.useEffect(() => {
    if (!isLoading) setData(orders);
  }, [isLoading, orders]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("summaries.filterOrders")}
          value={table.getColumn("id")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("summaries.columns")} <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("summaries.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">

        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("summaries.previous")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {t("summaries.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Summaries() {
  const { t } = useTranslation();

  const headerLinks = [
    { id: 1, label: t("orders.menu.foodiesMenu"), path: "/orders" },
    { id: 2, label: t("orders.order.orderLine"), path: "/summaries" }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <MainHeader prevButtonIncluded links={headerLinks} />
        <div className="h-svh flex flex-col px-8">
          <div className="flex flex-col py-5">
            <div className="text-xl font-medium">{t("summaries.summaries")}</div>
            <div className="text-sm text-neutral-500">{t("summaries.summariesDesc")}</div>
          </div>
          <div className="pb-4">
            <SummariesTable />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
