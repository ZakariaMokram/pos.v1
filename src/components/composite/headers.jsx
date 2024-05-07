import * as React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { TbChevronLeft, TbLogout2, TbUser, TbMenu } from "react-icons/tb"; // Ajout de l'icône de menu hamburger
import { twMerge } from "tailwind-merge";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authStateAtom, authTokenAtom, authenticatedUserAtom } from "@/app/store/atoms/auth";

import { useAtomValue, useSetAtom } from "jotai";
import { Badge } from "../ui/badge";
import { useTranslation } from "react-i18next";

export const MainHeader = ({ links, prevButtonIncluded, action, ...props }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const prev = () => {
    navigate(-1);
    action && action();
  };

  const authenticatedUser = useAtomValue(authenticatedUserAtom);

  const setAuthState = useSetAtom(authStateAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setAuthenticatedUser = useSetAtom(authenticatedUserAtom);

  const handleLogoutTrigger = () => {
    setAuthState(false);
    setAuthToken(null);
    setAuthenticatedUser({});
  };

  const usernameBuilder = (user) => {
    return user.firstname !== null && user.lastname !== null
      ? `${user.firstname} ${user.lastname}`
      : `@${user.username}`;
  };

  
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header
      className="h-16 w-full flex items-center justify-between px-8 border-b bg-white border-neutral-200 overflow-wrap-break-word"
      {...props}
    >
      <div className="flex items-center justify-between gap-10">
        {/* Bouton de retour en arrière */}
        {prevButtonIncluded && (
          <Button onClick={prev} variant="outline" size="icon">
            <TbChevronLeft className="text-lg" />
          </Button>
        )}

        {/* Bouton de menu hamburger */}
        <Button onClick={() => setShowMenu(!showMenu)} variant="outline" size="icon">
          <TbMenu className="text-lg" />
        </Button>

        {/* Affichage des liens de navigation ou du menu hamburger en fonction de l'état du toggle */}
        {showMenu ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                {links.map((link) => (
                  <RouterLink
                    key={link.id}
                    to={link.path}
                    className={twMerge(
                      navigationMenuTriggerStyle(),
                      isActive(link.path) && "text-primary hover:text-primary font-semibold"
                    )}
                  >
                    {link.label}
                  </RouterLink>
                ))}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <TbUser className="text-base" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <Avatar className="w-16 h-16 text-xl">
                <AvatarImage src="" alt={authenticatedUser.username} />
                <AvatarFallback className="bg-orange-100">
                  <TbUser />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{usernameBuilder(authenticatedUser)}</span>
                </div>

                <Badge className="bg-green-500 hover:bg-green-500 text-[10px] font-bold py-0">
                  {authenticatedUser.role}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogoutTrigger} className="text-red-500 text-xs items-center gap-2">
            <TbLogout2 />
            {t("auth.logOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
