import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Row, Col } from "antd";

class ListInputField extends Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = { ...value };
    this.remove = this.remove.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  handleUrlChange = url => {
    this.triggerChange({ url });
  };
  handleTypeChange = type => {
    this.triggerChange({ type });
  };
  handleUsernameChange = username => {
    this.triggerChange({ username });
  };
  handlePasswordChange = password => {
    this.triggerChange({ password });
  };

  handleNameChange = name => {
    this.triggerChange({ name });
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  remove = () => {
    this.props.removeClick(this.props.index);
  };

  render() {
    const { state } = this;
    return (
      <Row>
        <Col sm={24} md={4}>
          <Input value={state.name} onChange={this.handleNameChange} />
        </Col>
        <Col sm={24} md={6}>
          <Input value={state.url} onChange={this.handleUrlChange} />
        </Col>
        <Col sm={24} md={3}>
          <Input value={state.type} onChange={this.handleTypeChange} />
        </Col>
        <Col sm={24} md={3}>
          <Input value={state.username} onChange={this.handleUsernameChange} />
        </Col>
        <Col sm={24} md={4}>
          <Input value={state.password} onChange={this.handlePasswordChange} />
        </Col>
        <Col sm={24} md={2}>
          <Button onClick={this.remove} type='danger'>
            Remove
          </Button>
        </Col>
      </Row>
    );
  }
}
ListInputField.defaultProps = {
  onChange: null,
  measurements: []
};

ListInputField.propTypes = {
  index: PropTypes.any.isRequired,
  removeClick: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired
};

export default ListInputField;
