import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { instance as axios } from "@/app/axios";
import Cookies from "js-cookie";

import { useSetAtom } from "jotai";
import { authStateAtom, authTokenAtom, authenticatedUserAtom } from "@/app/store/atoms/auth";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const { t } = useTranslation();
  const { toast } = useToast();

  const setAuthState = useSetAtom(authStateAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setAuthenticatedUser = useSetAtom(authenticatedUserAtom);

  const fetchUsers = async () => {
    const api = `${import.meta.env.VITE_SERVER_URL}/auth/users`;
    const response = await fetch(api);
    const fetchedData = await response.json();
    setUsers(fetchedData);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    await axios
      .post("/auth/sign-in", { username, password })
      .then((response) => {
        const token = response.data.token;

        if (token) {
          Cookies.set("authToken", token);

          setAuthState(true);
          setAuthToken(token);
          setAuthenticatedUser({
            id: response.data.id,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            username: response.data.username,
            role: response.data.role,
          });

          navigate("/");
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your credentials.",
        });
      });
  };

  const selectLabelBuilder = (user) => {
    return user.firstname !== null && user.lastname !== null
      ? `${user.firstname} ${user.lastname}`
      : `@${user.username}`;
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Select id="username" onValueChange={(value) => setUsername(value)}>
              <SelectTrigger className="w-[14.5rem] shadow-none">
                <SelectValue placeholder={t("auth.selectUsername")} />
              </SelectTrigger>
              <SelectContent className="mb-2">
                <SelectGroup>
                  {users &&
                    users.length > 0 &&
                    users.map((user) => (
                      <SelectItem key={user.username} value={user.username}>
                        {selectLabelBuilder(user)}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              id="password"
              className="w-[14.5rem]"
              value={password || ""}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus // Le clavier s'affichera automatiquement
            />
          </div>

          <button onClick={handleLogin} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
