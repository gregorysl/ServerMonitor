import React from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

import { Button, Input, Row, Col, Card, Checkbox, InputNumber } from "antd";

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
    onToggle={(event, isInputChecked) => onChange(isInputChecked)}
  >
    Use whitelist
  </Checkbox>
);
const ColField = ({ name, component, label, md }) => (
  <Col sm={24} md={md}>
    <Field
      name={name}
      component={component ? component : renderField}
      label={label}
    />
  </Col>
);
const RemoveButton = ({ fields, index }) => (
  <Col sm={24} md={2}>
    <Button icon='delete' onClick={() => fields.remove(index)} type='danger'>
    </Button>
  </Col>
);

const FullCard = ({
  push,
  name,
  title,
  subtitle,
  newItem = {},
  disableAdd,
  children
}) => (
  <Card
    title={
      <Row type='flex' style={{ alignItems: "center" }} gutter={16}>
        <Col sm={24} md={3}>
          {!disableAdd && (
            <Button icon='plus' onClick={() => push(name, newItem)}>
              Add
            </Button>
          )}
        </Col>
        <Col>
          <h3 className='card-header-title align-left'>{title}</h3>
          <h5 className='align-left'>{subtitle}</h5>
        </Col>
      </Row>
    }
  >
    {children}
  </Card>
);
const linksSection = ({ fields }) =>
  fields.map((member, index) => (
    <Row key={index}>
      <ColField name={`${member}.name`} label='name' md={3} />
      <ColField name={`${member}.url`} label='url' md={9} />
      <ColField name={`${member}.type`} label='name' md={3} />
      <ColField name={`${member}.username`} label='username' md={3} />
      <ColField name={`${member}.password`} label='password' md={4} />
      <RemoveButton fields={fields} index={index} />
    </Row>
  ));
const hardwareSection = ({ fields }) =>
  fields.map((member, index) => (
    <Row key={index}>
      <ColField name={`${member}.name`} label='name' md={3} />
      <ColField name={`${member}.url`} label='url' md={9} />
      <RemoveButton fields={fields} index={index} />
    </Row>
  ));
const dirsSection = ({ fields }) =>
  fields.map((member, index) => (
    <Row key={index}>
      <ColField name={`${member}`} label='name' md={22} />
      <RemoveButton fields={fields} index={index} />
    </Row>
  ));
const onSubmit = async values => {
  console.log(JSON.stringify(values, 0, 2));
};

let Sets = props => (
  <Form
    onSubmit={onSubmit}
    mutators={{
      ...arrayMutators
    }}
    initialValues={props.settings}
    render={({
      form: {
        mutators: { push, pop }
      },
      handleSubmit,
      pristine,
      reset,
      submitting,
      values
    }) => {
      return (
        <form onSubmit={handleSubmit}>
          <FullCard
            disableAdd
            title='Cleaner configuration'
            subtitle='(settings for ansible cleaner configuration)'
          >
            <Field
              name={`cleaner.useWhiteList`}
              component={checkboxComponent}
            />
            <Row>
              <label>Cleaner can remove builds older than (days)</label>
              <Field name={`cleaner.beforeDays`} component={numberField} />
            </Row>
            <Row>
              <label>
                Exclude following number of latest builds from being cleaned:{" "}
              </label>
              <Field name={`cleaner.excludeNLast`} component={numberField} />
            </Row>
          </FullCard>
          <FullCard
            push={push}
            name='hardwareList'
            title='Additional servers'
            subtitle='(this will add more tabs to Hardware section)'
          >
            <FieldArray name='hardwareList'>{hardwareSection}</FieldArray>
          </FullCard>
          <FullCard
            push={push}
            name='links'
            title='Components to check'
            subtitle='(add data for services avaibility you want to check)'
          >
            <FieldArray name='links'>{linksSection}</FieldArray>
          </FullCard>
          <FullCard
            push={push}
            name='dirsToCheckSize'
            title='Directories'
            subtitle='(will check size occupied)'
            newItem={""}
          >
            <FieldArray name='dirsToCheckSize'>{dirsSection}</FieldArray>
          </FullCard>
          <FullCard
            push={push}
            name='scheduledTasks'
            title='Scheduled tasks'
            subtitle='( )'
            section={dirsSection}
            newItem={""}
          >
            <FieldArray name='scheduledTasks'>{dirsSection}</FieldArray>
          </FullCard>
          <Row>
            <Col sm={24} md={12}>
              <Button
                type='primary'
                htmlType='submit'
                disabled={submitting || pristine}
              >
                Save settings
              </Button>
            </Col>
            <Col sm={24} md={12}>
              <Button onClick={reset} disabled={submitting || pristine}>
                Reset
              </Button>
            </Col>
          </Row>
        </form>
      );
    }}
  />
);

export default Sets;
