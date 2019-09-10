import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setIisAction } from "../../actions/actions";
import { Input, Icon } from "antd";

const NoteControl = props => {
  const [note, setValue] = useState(props.org.note);
  const dispatch = useDispatch();
  const iconFill = !note || note.length === 0 ? null : "filled";

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      confirmNote();
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
  return (
    <Input
      className="tag-input clear-input"
      type="text"
      value={note}
      onPressEnter={confirmNote}
      onBlur={confirmNote}
      onChange={evt => setValue(evt.target.note)}
      onKeyDown={handleKeyPress}
      prefix={
        <Icon
          style={{ fontSize: "25px", marginLeft: "-10px" }}
          type="message"
          theme={iconFill}
        />
      }
    />
  );
};

export default NoteControl;
