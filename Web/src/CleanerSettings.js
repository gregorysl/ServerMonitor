import React, { Component } from "react";
import { Form, InputNumber, Button, Checkbox } from "antd";

class CleanerSettings extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.saveSettings(values);
      }
    });
  }
  
  saveSettings = (settings) => {
    this.props.save(settings);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 }
    };
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 }
    };
    return (
      <div style={{ background: "#fff", padding: 5, height: "100%" }}>
        <h1>Cleaner Settings</h1>
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
          className="login-form"
        >
          <Form.Item
            {...formItemLayout}
            label="Exclude following number of latest builds from being cleaned"
          >
            {getFieldDecorator("excludeNLast")(<InputNumber min={0} precision={0} extra />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Cleaner can remove builds older than (days)"
          >
            {getFieldDecorator("beforeDays")(<InputNumber min={0} precision={0} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="Exclude builds by Whitelist">
            {getFieldDecorator("useWhiteList", { valuePropName: "checked" })(
              <Checkbox />
            )}
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const formData = {};
    if (props.settings && props.settings.cleaner) {
      Object.entries(props.settings.cleaner).forEach(([k, v]) => {
        formData[k] = Form.createFormField({ value: v });
      });
    }
    return formData;
  }
})(CleanerSettings);
