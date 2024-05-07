import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ActionButton = ({ onClick, className, icon: Icon, variant }) => (
  <Button
    className={cn("h-14 w-14 font-semibold text-base border-zinc-300", className)}
    variant={variant ? variant : "outline"}
    onClick={onClick}
    size="icon"
  >
    {Icon ? <Icon /> : ""}
  </Button>
);

export const NumericButton = ({ number, className, icon: Icon, onClick }) => (
  <Button
    className={cn("h-14 w-14 font-semibold text-base border-zinc-300", className)}
    variant={"outline"}
    onClick={onClick}
    size="icon"
  >
    {Icon ? <Icon /> : ""}
  </Button>
);
