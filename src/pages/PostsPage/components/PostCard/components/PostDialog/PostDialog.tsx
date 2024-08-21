import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

interface PostDialogProps {
  open: boolean;
  onClose: () => void;
  value?: string;
  onChange: (value: string) => void;
}

export const PostDialog = ({
  open,
  onClose,
  value = "",
  onChange,
}: PostDialogProps) => {
  const [postText, setPostText] = useState<string>(value);

  return (
    <Dialog maxWidth={"sm"} fullWidth open={open} onClose={onClose}>
      <DialogTitle>{"Edit title of post"} </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          label="Post title text"
          fullWidth
          variant="standard"
          value={postText}
          onChange={(value) => setPostText(value.currentTarget.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onChange(postText);
            setPostText("");
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
