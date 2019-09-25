import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setIisAction } from "../../actions/actions";
import { Input } from "antd";

const NoteControl = props => {
  const [note, setValue] = useState(props.org.note);
  const dispatch = useDispatch();

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      confirmNote();
      props.setEditing(false);
    } else if (event.keyCode === 27) {
      setValue(props.org.note);
    }
  };
  const confirmNote = () => {
    if (props.org.note !== note) {
      props.org.note = note;
      dispatch(setIisAction({ build: props.org, action: "Note" }, props.url));
    }
  };
  if (props.editing)
    return (
      <Input
        className="tag-input clear-input"
        type="text"
        size="small"
        value={note}
        onPressEnter={confirmNote}
        onBlur={confirmNote}
        onChange={evt => setValue(evt.target.value)}
        onKeyDown={handleKeyPress}
      />
    );
  else {
    const noteToShow =
      !note || note === "" ? "Click Edit to add description" : note;
    return <span className="build-note">{noteToShow}</span>;
  }
};

export default NoteControl;
