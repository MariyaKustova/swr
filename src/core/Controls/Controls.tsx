import React from "react";
import { IconButton } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";

import s from "./Controls.module.scss";

interface ControlsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDisabled?: boolean;
}

const Controls = ({ onEdit, onDelete, isDisabled }: ControlsProps) => {
  return (
    <div className={s.Controls}>
      <IconButton
        className={s.Controls__button}
        onClick={onEdit}
        disabled={isDisabled}
      >
        <CreateIcon />
      </IconButton>
      <IconButton
        className={s.Controls__button}
        onClick={onDelete}
        disabled={isDisabled}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default Controls;
