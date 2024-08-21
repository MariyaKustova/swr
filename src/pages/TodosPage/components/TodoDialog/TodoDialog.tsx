import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

interface TodoDialogProps {
  open: boolean;
  onClose: () => void;
  value?: string;
  isEdit?: boolean;
  onChange: (value: string) => void;
}

export const TodoDialog = ({
  open,
  onClose,
  value = "",
  isEdit = false,
  onChange,
}: TodoDialogProps) => {
  const [todoText, setTodoText] = useState<string>(value);

  const actionName = isEdit ? "Edit" : "Create";

  return (
    <Dialog maxWidth={"sm"} fullWidth open={open} onClose={onClose}>
      <DialogTitle>{`${actionName} todo`} </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Todo text"
          fullWidth
          variant="standard"
          value={todoText}
          onChange={(value) => setTodoText(value.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onChange(todoText);
            setTodoText("");
            onClose();
          }}
        >
          {actionName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
