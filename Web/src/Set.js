import React from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

import { Button, Input, Row, Col } from "antd";

const renderField = ({ input, label, type }) => (
  <Input {...input} type={type} placeholder={label} />
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
const RemoveButton = ({fields,index})=>(<Col sm={24} md={2}>
  <Button onClick={() => fields.remove(index)} type='danger'>
    Remove
  </Button>
</Col>);

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
  window.alert(JSON.stringify(values, 0, 2));
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
          <Button onClick={() => push("hardwareList", {})}>Add Link</Button>
          <FieldArray name='hardwareList'>{hardwareSection}</FieldArray>
          <Button onClick={() => push("links", {})}>Add Link</Button>
          <FieldArray name='links'>{linksSection}</FieldArray>
          <Button onClick={() => push("dirsToCheckSize", "")}>Add Link</Button>
          <FieldArray name='dirsToCheckSize'>{dirsSection}</FieldArray>
          <Button onClick={() => push("scheduledTasks", "")}>Add Link</Button>
          <FieldArray name='scheduledTasks'>{dirsSection}</FieldArray>

          <div className='buttons'>
            <button type='submit' disabled={submitting || pristine}>
              Submit
            </button>
            <button
              type='button'
              onClick={reset}
              disabled={submitting || pristine}
            >
              Reset
            </button>
          </div>
        </form>
      );
    }}
  />
);

export default Sets;
