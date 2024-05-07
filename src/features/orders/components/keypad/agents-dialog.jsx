import React, { useEffect, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { useAtomValue, useSetAtom } from "jotai";
import { agentsAtom, chosenAgentAtom } from "@/app/store/atoms/orders";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export const AgentsDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();

  const [openCombobox, setOpenCombobox] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [chosenAgent, setChosenAgent] = useState();

  const addChosenAgent = useSetAtom(chosenAgentAtom);

  const handleSubmitButton = () => {
    if (chosenAgent !== undefined && chosenAgent !== null) {
      addChosenAgent({ ...chosenAgent, type: "EXISTING_AGENT" });
      onOpenChange(false);
    } else if (customValue && customValue !== null) {
      addChosenAgent({ tvaRate: Number(customValue), type: "CUSTOM_AGENT" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.agents.agents")}</DialogTitle>
          <DialogDescription>{t("orders.agents.agentsDesc")}</DialogDescription>
        </DialogHeader>

        <Separator className="bg-stone-200" />

        <div>
          <Tabs defaultValue="EXISTING_AGENT" className="my-1 flex flex-col gap-1">
            <TabsList className="grid w-full grid-cols-2 bg-stone-200">
              <TabsTrigger value="EXISTING_AGENT" className="text-xs uppercase">
                {t("orders.agents.existingAgent")}
              </TabsTrigger>
              <TabsTrigger value="CUSTOM_AGENT" className="text-xs uppercase">
                {t("orders.agents.custom")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="EXISTING_AGENT" className="h-full">
              <AvailableAgentsCombobox
                open={openCombobox}
                value={comboboxValue}
                setOpen={setOpenCombobox}
                setValue={setComboboxValue}
                setChosenAgent={setChosenAgent}
              />
            </TabsContent>

            <TabsContent value="CUSTOM_AGENT" className="h-full">
              <Input
                type="number"
                placeholder={t("orders.agents.customPlaceholder")}
                onChange={(e) => setCustomValue(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="bg-stone-200" />

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {t("general.cancel")}
          </Button>
          <Button type="submit" onClick={handleSubmitButton}>
            {t("general.continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AvailableAgentsCombobox = ({ open, setOpen, value, setValue, setChosenAgent }) => {
  const { t } = useTranslation();

  const agents = useAtomValue(agentsAtom);

  useEffect(() => {
    const [name, percentage] = value?.split("•").map((str) => str.trim()) || [];
    const number = Number(percentage?.replace(/[^0-9\-+\.]/g, ""));
    setChosenAgent(agents.find((agent) => agent.name.toLowerCase() === name && agent.tvaRate === number));
  }, [value, agents]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="capitalize w-full flex justify-between"
        >
          {value ? value : t("orders.agents.selectAgent")}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t("orders.agents.searchAgent")} className="h-9" />
          <CommandEmpty>{t("orders.agents.noAgentFound")}</CommandEmpty>
          <CommandGroup>
            {agents &&
              agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="agent-name">
                    {agent.name} • {agent.tvaRate}%
                  </span>
                  <CheckIcon className={cn("ml-auto h-4 w-4", value === agent.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
