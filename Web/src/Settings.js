import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { setSettings } from "./actions/actions";
import { FieldArray } from "react-final-form-arrays";

import {
  Button,
  Input,
  Row,
  Col,
  Checkbox,
  InputNumber,
  PageHeader
} from "antd";

const renderField = ({ input, label, type }) => (
  <Input {...input} type={type} placeholder={label} />
);
const numberField = ({ input, label, type }) => (
  <InputNumber {...input} type={type} placeholder={label} />
);

const checkboxComponent = ({ input: { onChange, value }, meta, ...rest }) => (
  <Checkbox
    {...rest}
    checked={!!value}
    onChange={(e, isChkd) => onChange(isChkd)}
  >
    Use whitelist
  </Checkbox>
);
const ColField = ({ name, component, label, md }) => (
  <Col xs={24} sm={12} md={md}>
    <Field
      name={name}
      component={component ? component : renderField}
      label={label}
    />
  </Col>
);
const RemoveButton = ({ fields, index }) => (
  <Col xs={24} sm={12} md={2}>
    <Button
      icon="delete"
      onClick={() => fields.remove(index)}
      type="danger"
    ></Button>
  </Col>
);
const AddButton = ({ push, name, newItem = {} }) => (
  <Button icon="plus" onClick={() => push(name, newItem)}>
    Add
  </Button>
);

const linksSection = ({ fields }) =>
  fields.map((member, index) => (
    <Row key={index}>
      <ColField name={`${member}.name`} label="name" md={3} />
      <ColField name={`${member}.url`} label="url" md={9} />
      <ColField name={`${member}.type`} label="name" md={3} />
      <ColField name={`${member}.username`} label="username" md={3} />
      <ColField name={`${member}.password`} label="password" md={4} />
      <RemoveButton fields={fields} index={index} />
    </Row>
  ));
const hardwareSection = ({ fields }) =>
  fields.map((member, index) => (
    <Row key={index}>
      <ColField name={`${member}.name`} label="name" md={3} />
      <ColField name={`${member}.url`} label="url" md={9} />
      <RemoveButton fields={fields} index={index} />
    </Row>
  ));
const dirsSection = ({ fields }) =>
  fields.map((member, index) => (
    <Row key={index}>
      <ColField name={`${member}`} label="name" md={22} />
      <RemoveButton fields={fields} index={index} />
    </Row>
  ));

let Settings = props => {
  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const submita = values => dispatch(setSettings(values));
  return (
    <Form
      onSubmit={submita}
      mutators={{
        ...arrayMutators
      }}
      initialValues={settings}
      render={({
        form: {
          reset,
          mutators: { push }
        },
        handleSubmit,
        pristine,
        submitting,
        values
      }) => {
        const pathType =
          +values.cleaner.whitelistType === 0
            ? "cleaner.xmlWhitelistPath"
            : "cleaner.jsonWhitelistPath";
        return (
          <form onSubmit={handleSubmit}>
            <PageHeader title="Cleaner configuration">
              <Row>
                <label>Cleaner can remove builds older than (days): </label>
                <Field name={`cleaner.beforeDays`} component={numberField} />
              </Row>
              <Row>
                <label>
                  Exclude following number of latest builds from being cleaned:{" "}
                </label>
                <Field name={`cleaner.excludeNLast`} component={numberField} />
              </Row>
              <Field
                name={`cleaner.useWhiteList`}
                component={checkboxComponent}
              />
              <Row>
                <label>Whitelist type: </label>
                <Field name="cleaner.whitelistType" component="select">
                  <option value={0}>XML</option>
                  <option value={1}>JSON</option>
                </Field>
              </Row>
              <label>Path: </label>
              <Field name={pathType} component={renderField} type="text" />
            </PageHeader>
            <PageHeader
              title="Additional servers"
              subTitle="(this will add more tabs to Hardware section)"
              extra={<AddButton push={push} name="hardwareList" />}
            >
              <FieldArray name="hardwareList">{hardwareSection}</FieldArray>
            </PageHeader>
            <PageHeader
              title="Components to check"
              subTitle="(add data for services avaibility you want to check)"
              extra={<AddButton push={push} name="links" />}
            >
              <FieldArray name="links">{linksSection}</FieldArray>
            </PageHeader>
            <PageHeader
              title="Directories"
              subTitle="(will check size occupied)"
              extra={<AddButton push={push} name="links" />}
            >
              <FieldArray name="dirsToCheckSize">{dirsSection}</FieldArray>
            </PageHeader>
            <PageHeader
              title="Scheduled tasks"
              extra={
                <AddButton push={push} name="scheduledTasks" newItem={""} />
              }
            >
              <FieldArray name="scheduledTasks">{dirsSection}</FieldArray>
            </PageHeader>
            <PageHeader title="Additional Settings">
              <label>Group Apps by following name: </label>
              <Field name="commonAppName" component={renderField} type="text" />
            </PageHeader>
            <Row>
              <Col sm={24} md={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={submitting || pristine}
                >
                  Save settings
                </Button>
              </Col>
              <Col sm={24} md={12}>
                <Button
                  onClick={reset}
                  disabled={submitting || pristine}
                  type="danger"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </form>
        );
      }}
    />
  );
};

export default Settings;
