import React, { Component } from "react";
import { Input, Icon } from "antd";

class NoteControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.org.note
    };
    this.confirmNote = this.confirmNote.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  setEditMode() {
    this.setState({
      value: this.props.org.note
    });
  }

  updateInputValue(evt) {
    this.setState({
      value: evt.target.value
    });
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.confirmNote();
    } else if (event.keyCode === 27) {
      this.setEditMode();
    }
  }
  confirmNote() {
    if (this.props.org.note !== this.state.value) {
      this.props.org.note = this.state.value;
      this.props.click(
        this.props.org,
        this.props.url,
        this.props.refresh,
        "Note"
      );
    }
  }

  render() {
    const noteProp = this.props.org.note;
    const iconFill = !noteProp || noteProp.length === 0 ? null : "filled";
    return (
      <Input
        className="tag-input clear-input"
        type="text"
        value={this.state.value}
        onPressEnter={this.confirmNote}
        onBlur={this.confirmNote}
        onChange={evt => this.updateInputValue(evt)}
        onKeyDown={this.handleKeyPress}
        onClick={this.setEditMode}
        prefix={
          <Icon
            style={{ fontSize: "25px", marginLeft: "-10px" }}
            type="message"
            theme={iconFill}
          />
        }
      />
    );
  }
}

export default NoteControl;
