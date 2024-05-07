import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAtomValue } from "jotai";
import { authStateAtom } from "@/app/store/atoms/auth";

export const ProtectedRoute = ({ children }) => {
  const authState = useAtomValue(authStateAtom);
  const navigate = useNavigate();

  React.useEffect(() => {
    !authState && navigate("/auth");
  }, [authState]);

  return authState ? children : <Navigate to="/auth" replace />;
};
