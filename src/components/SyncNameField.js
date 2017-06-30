import React, { Component } from 'react';
import { Field, reduxForm, submit, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { editFile } from '../actions';

const validate = (value, props) => {
  const errors = {};
  if (props.files.filter(
        f => f.parentID === props.file.parentID &&
      f.id !== props.file.id)
      .some(
        f => f.name === value.name &&
      f.kind === props.file.kind))
    errors.name = `${props.file.kind === 'folder' ? 'Folder' : 'Note'} with this name already exists`;
  else if (value.name === '')
    errors.name = 'Required';
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, floatingLabelText }) => {
  return (
    <TextField
      floatingLabelText={floatingLabelText}
      errorText={error}
      {...input}
      {...custom}
      />
  );
};

const SyncNameField = ({ handleSubmit, invalid, dispatch, name, onUpdate, file, files }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="name"
      component={renderTextField}
      floatingLabelText="Name"
      onChange={(e) => {
                if (!files.filter(f =>
                  f.parentID === file.parentID &&
                  f.id !== file.id)
                .some(f =>
                  f.name === e.target.value &&
                  f.kind === file.kind) &&
                  e.target.value !== '') {
                  //dispatch(submit('editField'));
                  dispatch(editFile(file.id, e.target.value, file.contain, file.tags));
                  }
              }}
      />
    </form>
);

/*export default reduxForm({
  form: 'editField',
  validate,
})(SyncEditField);*/

const Form = reduxForm({
  form: 'editField',
  validate,
})(SyncNameField);

const selector = formValueSelector('editField');

export default connect((state) => {
  const name = selector(state, 'name');
  return { name };
})(Form)