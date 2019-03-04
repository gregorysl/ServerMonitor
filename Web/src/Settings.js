import React from "react";
import { Form, Icon, Input,  Checkbox } from 'antd';

const Settings = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  const { getFieldDecorator } = props.form;
  return (
    <div style={{ background: "#fff", padding: 5, height: "100%" }}>
      <h1>Settings</h1>
      <span>{JSON.stringify(props.settings, null, 4)}</span>
      
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('commonAppName', {
            rules: [{ required: true }]
          })(
            <Input placeholder="commonAppName" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('cacheInSeconds', {
            rules: [{ required: true }]
          })(
            <Input placeholder="cacheInSeconds" />
          )}
        </Form.Item>
        <Form.Item label="Oracle Instance Manager Enabled">
          {getFieldDecorator('isOracleInstanceManagerEnabled', {
            valuePropName: "checked",
            rules: [{ required: true }]
          })(
            <Checkbox  />
          )}
        </Form.Item>
      </Form>
    </div>
  );
};


export default Form.create({
  mapPropsToFields(props) {
    const formData = {};

    if (props.settings != null) {
      Object.entries(props.settings).forEach(([k, v]) => {
        formData[k] = Form.createFormField({ value: v });
      });
    }
    return formData;
  }
})(Settings);
