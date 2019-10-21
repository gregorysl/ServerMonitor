import React from "react";
import { useDispatch } from "react-redux";
import { setIisAction } from "../../actions/actions";
import { Typography } from "antd";

const { Paragraph } = Typography;

const NoteControl = ({ org, url }) => {
  const dispatch = useDispatch();

  const confirmNote = value => {
    if (org.note !== value) {
      org.note = value;
      dispatch(setIisAction({ build: org, action: "Note" }, url));
    }
  };
  const noteToShow = !org.note || org.note === "" ? "No description" : org.note;

  return (
    <Paragraph className="build-note" editable={{ onChange: confirmNote }}>
      {noteToShow}
    </Paragraph>
  );
};

export default NoteControl;
