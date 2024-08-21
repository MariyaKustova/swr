import React from "react";
import { IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import s from "./PageTitle.module.scss";

interface PageTitleProps {
  title: string;
  onClick: () => void;
}

const PageTitle = ({ title, onClick }: PageTitleProps) => {
  return (
    <div className={s.PageTitle}>
      <Typography variant="h4" component="div" color={"primary"}>
        {title}
      </Typography>
      <IconButton className={s.PageTitle__button} onClick={onClick}>
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};

export default PageTitle;
