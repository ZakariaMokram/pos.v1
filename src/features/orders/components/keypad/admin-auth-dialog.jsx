import React, { useEffect, useState } from "react";
import { instance as axios } from "@/app/axios";

import {
  TbBackspace,
  TbNumber0,
  TbNumber1,
  TbNumber2,
  TbNumber3,
  TbNumber4,
  TbNumber5,
  TbNumber6,
  TbNumber7,
  TbNumber8,
  TbNumber9,
} from "react-icons/tb";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import { ActionButton, NumericButton } from "./custom-buttons";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export const AdminAuthDialog = ({ open, onOpenChange, openDiscountDialog }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleNumericButton = (number) => setPassword((prevValue) => prevValue + number);
  const handleBackspaceButton = () => setPassword(password.slice(0, -1));

  const getManagerName = (user) => {
    return user.firstname !== null && user.lastname !== null
      ? `${user.firstname} ${user.lastname}`
      : `@${user.username}`;
  };

  const handleAuthenticateButon = async () => {
    await axios
      .post("/auth/sign-in", { username, password })
      .then(() => {
        openDiscountDialog();
        setPassword("");
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your credentials.",
        })
      );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`);
      const fetchedData = await response.json();
      setUsers(fetchedData);
    };
    fetchUsers();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.managerAuth.authentication")}</DialogTitle>
          <DialogDescription>{t("orders.managerAuth.authenticationDesc")}</DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col w-full gap-3 items-center justify-center p-2">
          <div className="flex flex-col gap-1 w-48">
            <Select id="username" onValueChange={(value) => setUsername(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("orders.managerAuth.selectUsername")} />
              </SelectTrigger>
              <SelectContent className="mb-2">
                <SelectGroup>
                  {users.map(
                    (manager) =>
                      manager.role === "ADMIN" && (
                        <SelectItem key={manager.username} value={manager.username}>
                          {getManagerName(manager)}
                        </SelectItem>
                      )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input type="password" value={password || ""} readOnly />
          </div>

          <div className="flex">
            <div className="flex flex-col">
              <NumericButton
                icon={TbNumber1}
                onClick={() => handleNumericButton("1")}
                className="rounded-b-none rounded-r-none w-16"
              />
              <NumericButton icon={TbNumber4} onClick={() => handleNumericButton("4")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber7} onClick={() => handleNumericButton("7")} className="rounded-none w-16" />
              <ActionButton
                icon={TbBackspace}
                className="bg-red-500 text-white hover:bg-red-500 hover:text-white border-none rounded-t-none rounded-r-none w-16"
                onClick={handleBackspaceButton}
              />
            </div>
            <div className="flex flex-col">
              <NumericButton icon={TbNumber2} onClick={() => handleNumericButton("2")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber5} onClick={() => handleNumericButton("5")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber8} onClick={() => handleNumericButton("8")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber0} onClick={() => handleNumericButton("0")} className="rounded-none w-16" />
            </div>
            <div className="flex flex-col">
              <NumericButton
                icon={TbNumber3}
                onClick={() => handleNumericButton("3")}
                className="rounded-b-none rounded-l-none w-16"
              />
              <NumericButton icon={TbNumber6} onClick={() => handleNumericButton("6")} className="rounded-none w-16" />
              <NumericButton icon={TbNumber9} onClick={() => handleNumericButton("9")} className="rounded-none w-16" />
              <ActionButton className="rounded-t-none rounded-l-none w-16" onClick={() => {}} />
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("general.discard")}
          </Button>
          <Button type="button" onClick={handleAuthenticateButon}>
            {t("buttons.authenticate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
