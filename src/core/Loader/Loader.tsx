import React from "react";
import { CircularProgress } from "@mui/material";

import s from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={s.Loader}>
      <CircularProgress color="primary" />
    </div>
  );
};
