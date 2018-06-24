import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Tag } from 'antd';

class NoteControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.note,
      isEditMode: false
    };
    this.confirmNote = this.confirmNote.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }


  setEditMode() {
    this.setState({ isEditMode: !this.state.isEditMode, value: this.props.note });
  }

  updateInputValue(evt) {
    this.setState({
      value: evt.target.value
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.confirmNote();
    } else if (event.keyCode === 27) {
      this.setEditMode();
    }
  }
  confirmNote() {
    this.setState({ isEditMode: !this.state.isEditMode });

    const data =
    {
      key: this.props.name,
      value: this.state.value
    };
    this.props.click(data);
  }

  render() {
    const icon = this.props.note === '' ? 'tag-o' : 'tag';
    return (
      this.state.isEditMode ?
        <React.Fragment>
          <Input
            placeholder="Note"
            type="text"
            value={this.state.value}
            onChange={evt => this.updateInputValue(evt)}
            onKeyDown={this.handleKeyPress}
            prefix={<Icon type="tag" />}
          />
          <Icon className="icon-hand" onClick={this.confirmNote} type="check" />
          <Icon className="icon-hand" onClick={this.setEditMode} type="close" />
        </React.Fragment>
        :
        <React.Fragment>
          <Icon className="icon-hand" onClick={this.setEditMode} type={icon} />
          {this.props.note && (<Tag>{this.props.note}</Tag>)}
        </React.Fragment>
    );
  }
}

NoteControl.propTypes = {
  note: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default NoteControl;

