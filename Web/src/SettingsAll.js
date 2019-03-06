import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import ListInputField from "./components/SettingsAll/ListInputField";

let dirsId = 0;
class SettingsAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dirsKeys: []
    };
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.dirsKeys.length === 0) {
      if (nextProps.settings != null) {
        const pk = Object.keys(nextProps.settings.dirsToCheckSize);
        dirsId = pk ? +pk.sort()[pk.length - 1] + 1 : 0;
        return { dirsKeys: pk || [] };
      }
    }
    return prevState;
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  }

  remove(k) {
    debugger;
    const { dirsKeys } = this.state;
    if (dirsKeys.length === 1) {
      return;
    }
    this.setState({
      dirsKeys: dirsKeys.filter(key => key !== k)
    });
  }

  add() {
    const { dirsKeys } = this.state;
    const nextKeys = dirsKeys.concat(dirsId);
    dirsId++;

    this.setState({
      dirsKeys: nextKeys
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const dirsKeys = this.state.dirsKeys;
    const formItems = dirsKeys.map((k, i) => (
      <Form.Item required={false} key={k}>
        {getFieldDecorator(`dirsToCheck[${k}]`, {})(
          <ListInputField index={k} removeClick={this.remove} />
        )}
      </Form.Item>
    ));
    return (
      <div style={{ background: "#fff", padding: 5, height: "100%" }}>
        <h1>SettingsAll</h1>
        <span>{JSON.stringify(this.props.settings, null, 4)}</span>
        <Form onSubmit={this.handleSubmit} className="login-form">
          {formItems}
          <Button type="dashed" onClick={this.add}>
            <Icon type="plus" />
            Add
          </Button>
          <Form.Item>
            {getFieldDecorator("commonAppName", {
              rules: [{ required: true }]
            })(<Input placeholder="commonAppName" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("cacheInSeconds", {
              rules: [{ required: true }]
            })(<Input placeholder="cacheInSeconds" />)}
          </Form.Item>
          <Form.Item label="Oracle Instance Manager Enabled">
            {getFieldDecorator("isOracleInstanceManagerEnabled", {
              valuePropName: "checked",
              rules: [{ required: true }]
            })(<Checkbox />)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const formData = {};

    if (props.settings != null) {
      Object.entries(props.settings).forEach(([k, v]) => {
        formData[k] = Form.createFormField({ value: v });
      });
      props.settings.dirsToCheckSize.forEach((item, idx) => {
        formData[`dirsToCheck[${idx}]`] = Form.createFormField({
          value: item
        });
      });
    }
    return formData;
  }
})(SettingsAll);
