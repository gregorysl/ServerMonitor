import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import ListInputField from './components/Settings/ListInputField';

let uuid = 0;
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productKeys: []
    };
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.productKeys.length === 0) {
      if (nextProps.settings != null) {
        const pk = Object.keys(nextProps.settings.dirsToCheckSize);
        uuid = pk ? +pk.sort()[pk.length - 1] + 1 : 0;
        return { productKeys: pk || [] };
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
    const { productKeys } = this.state;
    if (productKeys.length === 1) {
      return;
    }
    this.setState({
      productKeys: productKeys.filter(key => key !== k)
    });
  }

  add() {
    const { productKeys } = this.state;
    const nextKeys = productKeys.concat(uuid);
    uuid++;

    this.setState({
      productKeys: nextKeys
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const productKeys = this.state.productKeys;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItems = productKeys.map((k, i) => (
      <Form.Item
        colon={i === 0}
        {...formItemLayout}
        required={false}
        key={k}
      >
        {getFieldDecorator(`dirsToCheck[${k}]`, {})(
            <ListInputField  index={k}
            productKeys={productKeys.length}
            removeClick={this.remove}/>
        )}
      </Form.Item>
    ));
    return (
      <div style={{ background: "#fff", padding: 5, height: "100%" }}>
        <h1>Settings</h1>
        <span>{JSON.stringify(this.props.settings, null, 4)}</span>
        <Form onSubmit={this.handleSubmit} className="login-form">
          {formItems}
          <Form.Item label=" " colon={false} {...formItemLayout}>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Dodaj Składnik
            </Button>
          </Form.Item>
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
})(Settings);
