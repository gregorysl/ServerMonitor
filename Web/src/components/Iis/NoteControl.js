import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';
import { setNote } from '../../actions/actions';

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
    this.setState({
      isEditMode: !this.state.isEditMode,
      value: this.props.note
    });
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

    const data = {
      key: this.props.name,
      value: this.state.value
    };
    this.props.saveNote(data);
  }

  render() {
    const icon = this.props.note === '' ? 'tag-o' : 'tag';
    const note =
      this.props.note &&
      this.props.note.split('\\n').map(item => (
        <span key={item}>
          {item}
          <br />
        </span>
      ));
    return this.state.isEditMode ? (
      <div>
        <Input
          className="tag-input"
          placeholder="Note"
          type="text"
          value={this.state.value}
          onPressEnter={this.confirmNote}
          onChange={evt => this.updateInputValue(evt)}
          onKeyDown={this.handleKeyPress}
          prefix={<Icon type="tag" />}
        />
        <Icon className="icon-hand" onClick={this.confirmNote} type="check" />
        <Icon className="icon-hand" onClick={this.setEditMode} type="close" />
      </div>
    ) : (
      <div>
        <Icon className="icon-hand" onClick={this.setEditMode} type={icon} />
        {note}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveNote: (data) => {
    dispatch(setNote(data));
  }
});
NoteControl.defaultProps = { note: '' };

NoteControl.propTypes = {
  note: PropTypes.string,
  name: PropTypes.string.isRequired,
  saveNote: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(NoteControl);
