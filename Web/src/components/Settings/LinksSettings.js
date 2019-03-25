import React, { Component } from "react";
import { Form, Icon, Button, Checkbox } from "antd";
import ListInputField from "./ListInputField";

const FormItem = Form.Item;
let uuid = 0;

class LinksSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { linksKeys: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let pk = null;
    if (nextProps.settings && prevState.linksKeys.length === 0) {
      pk = Object.keys(nextProps.settings.links);
      uuid = nextProps.settings.links.length;
    } else {
      pk = prevState.linksKeys;
    }
    return { linksKeys: pk || [] };
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

  saveSettings = settings => {
    this.props.save(settings);
  };

  remove(k) {
    const { linksKeys } = this.state;
    if (linksKeys.length === 1) {
      return;
    }
    this.setState({
      linksKeys: linksKeys.filter(key => key !== k)
    });
  }

  add() {
    const { linksKeys } = this.state;
    const nextKeys = linksKeys.concat(uuid);
    uuid++;
    this.setState({
      linksKeys: nextKeys
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { linksKeys } = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 }
    };
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 }
    };

    const formItems = linksKeys.map((k, i) => (
      <FormItem required={false} key={k}>
        {getFieldDecorator(`links[${k}]`, {})(
          <ListInputField
            index={k}
            linksKeys={linksKeys.length}
            removeClick={this.remove}
          />
        )}
      </FormItem>
    ));
    return (
      <div style={{ background: "#fff", padding: 5, height: "100%" }}>
        {/* <ul>{data2}</ul> */}
        <h1>Links Settings</h1>

        <Form
          layout='horizontal'
          onSubmit={this.handleSubmit}
          className='login-form'
        >
          {" "}
          <FormItem label=' ' colon={false} {...formItemLayout}>
            <Button type='dashed' onClick={this.add}>
              <Icon type='plus' /> Dodaj Składnik
            </Button>
          </FormItem>
          {formItems}
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item {...buttonItemLayout}>
            <Button type='primary' htmlType='submit'>
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
    if (props.settings && props.settings.links) {
      props.settings.links.forEach((item, idx) => {
        formData[`links[${idx}]`] = Form.createFormField({ value: item });
      });
    }
    return formData;
  }
})(LinksSettings);
