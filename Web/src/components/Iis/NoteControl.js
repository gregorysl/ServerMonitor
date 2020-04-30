import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { setIisAction } from "../../actions/actions";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 44
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  }
}));

const NoteControl = ({ build, url, isEdit, setIsEdit }) => {
  const [note, setNote] = useState(build.note ?? "");
  const dispatch = useDispatch();
  const classes = useStyles();

  const confirm = () => {
    if (build.note !== note) {
      build.note = note;
      dispatch(setIisAction({ build, action: "Note" }, url));
    }
    setIsEdit(false);
  };

  const cancel = () => {
    setNote(build.note);
    setIsEdit(false);
  };

  const _handleKeyDown = e => {
    if (e.key === "Enter") {
      confirm();
      return;
    } else if (e.key === "Escape") {
      cancel();
      return;
    }
  };
  const handleChange = event => {
    setNote(event.target.value);
  };

  return (
    <Paper elevation={isEdit ? 1 : 0} className={classes.root}>
      <InputBase
        disabled={!isEdit}
        className={classes.input}
        placeholder="Build note"
        value={note}
        onKeyDown={_handleKeyDown}
        onChange={handleChange}
      />
      {isEdit && (
        <IconButton onClick={confirm} className={classes.iconButton}>
          <CheckIcon />
        </IconButton>
      )}
      {isEdit && (
        <IconButton onClick={cancel} className={classes.iconButton}>
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default NoteControl;
