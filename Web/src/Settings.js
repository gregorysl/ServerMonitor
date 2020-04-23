import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { setSettings } from "./actions/actions";
import { FieldArray } from "react-final-form-arrays";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddIcon from "@material-ui/icons/Add";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const fieldInput = ({ input, label, type }) => (
  <TextField {...input} label={label} />
);
const renderField = ({ input, label, type }) => (
  <Input fullWidth {...input} type={type} placeholder={label} />
);

const ColField = ({ name, component, label, md }) => (
  <Grid item xs={12} sm={6} md={md}>
    <Field
      name={name}
      component={component ? component : renderField}
      label={label}
    />
  </Grid>
);
const RemoveButton = ({ fields, index }) => (
  <Grid item xs={12} sm={6} md={1}>
    <IconButton aria-label="delete" onClick={() => fields.remove(index)}>
      <DeleteOutlineIcon />
    </IconButton>
  </Grid>
);
const AddButton = ({ push, name, newItem = {} }) => (
  <Button
    variant="contained"
    size="small"
    onClick={() => push(name, newItem)}
    startIcon={<AddIcon />}
  >
    Add
  </Button>
);

const linksSection = ({ fields }) =>
  fields.map((member, index) => (
    <Grid container spacing={3} key={index}>
      <ColField name={`${member}.name`} label="name" md={1} />
      <ColField name={`${member}.url`} label="url" md={6} />
      <ColField name={`${member}.username`} label="username" md={2} />
      <ColField name={`${member}.password`} label="password" md={2} />
      <RemoveButton fields={fields} index={index} />
    </Grid>
  ));
const hardwareSection = ({ fields }) =>
  fields.map((member, index) => (
    <Grid container spacing={3} key={index}>
      <ColField name={`${member}.name`} label="name" md={3} />
      <ColField name={`${member}.url`} label="url" md={8} />
      <RemoveButton fields={fields} index={index} />
    </Grid>
  ));
const dirsSection = ({ fields }) =>
  fields.map((member, index) => (
    <Grid container spacing={3} key={index}>
      <ColField name={`${member}`} label="name" md={11} />
      <RemoveButton fields={fields} index={index} />
    </Grid>
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
            <Grid container spacing={3}>
              <Grid item lg={12}>
                <Card>
                  <CardHeader
                    title="Additional servers"
                    subheader="(this will add more tabs to Hardware section)"
                    action={<AddButton push={push} name="hardwareList" />}
                  />
                  <CardContent>
                    <FieldArray name="hardwareList">
                      {hardwareSection}
                    </FieldArray>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card>
                  <CardHeader
                    title="Components to check"
                    subheader="(add data for services avaibility you want to check)"
                    action={<AddButton push={push} name="links" />}
                  />
                  <CardContent>
                    <FieldArray name="links">{linksSection}</FieldArray>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card>
                  <CardHeader
                    title="Directories"
                    subheader="(will check size occupied)"
                    action={
                      <AddButton
                        push={push}
                        name="dirsToCheckSize"
                        newItem={""}
                      />
                    }
                  />
                  <CardContent>
                    <FieldArray name="dirsToCheckSize">
                      {dirsSection}
                    </FieldArray>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card>
                  <CardHeader
                    action={
                      <AddButton
                        push={push}
                        name="scheduledTasks"
                        newItem={""}
                      />
                    }
                    title="Scheduled tasks"
                  />
                  <CardContent>
                    <FieldArray name="scheduledTasks">{dirsSection}</FieldArray>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card>
                  <CardHeader title="Additional Settings" />
                  <CardContent>
                    <Field
                      label="Group apps by"
                      name="commonAppName"
                      component={fieldInput}
                      type="text"
                    />
                    <label>Whitelist type: </label>
                    <Field name="cleaner.whitelistType" component="select">
                      <option value={0}>XML</option>
                      <option value={1}>JSON</option>
                    </Field>
                    <Field
                      label="Whitelist path"
                      name={pathType}
                      component={fieldInput}
                      type="text"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={submitting || pristine}
                >
                  Save settings
                </Button>
                <Button
                  variant="contained"
                  onClick={reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default Settings;
