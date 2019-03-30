import React from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

import { Button, Input, Row, Col } from "antd";

const renderField = ({ input, label, type }) => (
  <Input {...input} type={type} placeholder={label} />
);
const linksSection = ({ fields }) =>
fields.map((member, index) => (
  <Row key={index}>
    <Col sm={24} md={3}>
      <Field
        name={`${member}.name`}
        component={renderField}
        label='name'
      />
    </Col>
    <Col sm={24} md={9}>
      <Field
        name={`${member}.url`}
        component={renderField}
        label='url'
      />
    </Col>
    <Col sm={24} md={3}>
      <Field
        name={`${member}.type`}
        component={renderField}
        label='type'
      />
    </Col>
    <Col sm={24} md={3}>
      <Field
        name={`${member}.username`}
        component={renderField}
        label='username'
      />
    </Col>
    <Col sm={24} md={4}>
      <Field
        name={`${member}.password`}
        component={renderField}
        label='password'
      />
    </Col>
    <Col sm={24} md={2}>
      <Button onClick={() => fields.remove(index)} type='danger'>
        Remove
      </Button>
    </Col>
  </Row>
));
const hardwareSection = ({ fields }) =>
fields.map((member, index) => (
  <Row key={index}>
    <Col sm={24} md={3}>
      <Field
        name={`${member}.name`}
        component={renderField}
        label='name'
      />
    </Col>
    <Col sm={24} md={9}>
      <Field
        name={`${member}.url`}
        component={renderField}
        label='url'
      />
    </Col>
    <Col sm={24} md={2}>
      <Button onClick={() => fields.remove(index)} type='danger'>
        Remove
      </Button>
    </Col>
  </Row>
));
const dirsSection = ({ fields }) =>
fields.map((member, index) => (
  <Row key={index}>
    <Col sm={24} md={3}>
      <Field
        name={`${member}`}
        component={renderField}
        label='name'
      />
    </Col>
    <Col sm={24} md={2}>
      <Button onClick={() => fields.remove(index)} type='danger'>
        Remove
      </Button>
    </Col>
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
          <Button onClick={() => push("links", {})}>Add Link</Button>
          <FieldArray name='links'>
            {linksSection}
          </FieldArray>
          <Button onClick={() => push("hardwareList", {})}>Add Link</Button>
          <FieldArray name='hardwareList'>
            {hardwareSection}
          </FieldArray>
          <Button onClick={() => push("dirsToCheckSize", "")}>Add Link</Button>
          <FieldArray name='dirsToCheckSize'>
            {dirsSection}
          </FieldArray>
          <Button onClick={() => push("scheduledTasks", "")}>Add Link</Button>
          <FieldArray name='scheduledTasks'>
            {dirsSection}
          </FieldArray>

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
