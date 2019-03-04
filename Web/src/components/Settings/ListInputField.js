import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Input, Row, Col } from "antd";


class ListInputField extends Component {
  constructor(props) {
    super(props);
    const value = props.value || "";
    this.state = { value };
    this.remove = this.remove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      const { value } = nextProps;
      this.setState({value});
    }
  }

  remove = () => {
    this.props.removeClick(this.props.index);
  };

  render() {
    const { state } = this;
    return (
      <Row>
        <Col sm={24} md={8}>
        <Input value={state.value} />
        </Col>
          <Col sm={2} md={2}>
            <Button onClick={this.remove} type="danger">
              Usuń
            </Button>
          </Col>
        }
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
  value: PropTypes.string.isRequired
};

export default ListInputField;
