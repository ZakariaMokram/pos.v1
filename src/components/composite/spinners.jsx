import React from "react";
import { PulseLoader } from "react-spinners";

export const Loader = ({ state }) => (
  <div className="h-screen flex items-center justify-center">
    <PulseLoader color="#F97316" loading={state || true} size={10} />
  </div>
);
