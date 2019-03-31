import React from "react";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

import { Button, Input, Row, Col, Card } from "antd";

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
const RemoveButton = ({ fields, index }) => (
  <Col sm={24} md={2}>
    <Button icon='delete' onClick={() => fields.remove(index)} type='danger'>
      Remove
    </Button>
  </Col>
);

const AddButton = ({ push, click }) => {
  return (
    <Button icon='plus' onClick={click}>
      Add
    </Button>
  );
};
const FullCard = ({ push, name, title, subtitle, section, newItem }) => (
  <Card
    title={
      <Row type='flex' style={{ alignItems: "center" }} gutter={16}>
        <Col sm={24} md={3}>
          <AddButton push={push} click={() => push(name, newItem)} />
        </Col>
        <Col>
          <h3 className='card-header-title'>{title}</h3>
          <h5>{subtitle}</h5>
        </Col>
      </Row>
    }
  >
    <FieldArray name={name}>{section}</FieldArray>
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
          <FullCard
            push={push}
            name='hardwareList'
            title='Additional servers'
            subtitle='(this will add more tabs to Hardware section)'
            section={hardwareSection}
            newItem={{}}
          />
          <FullCard
            push={push}
            name='links'
            title='Components to check'
            subtitle='(add data for services avaibility you want to check)'
            section={linksSection}
            newItem={{}}
          />
          <FullCard
            push={push}
            name='dirsToCheckSize'
            title='Directories'
            subtitle='(will check size occupied)'
            section={dirsSection}
            newItem={""}
          />
          <FullCard
            push={push}
            name='scheduledTasks'
            title='Scheduled tasks'
            subtitle='( )'
            section={dirsSection}
            newItem={""}
          />
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
