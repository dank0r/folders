import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
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
      f.kind === props.file.kind)) {
    errors.name = `${props.file.kind === 'folder' ? 'Folder' : 'Note'} with this name already exists`;
  } else if (value.name === '') {
    errors.name = 'Required';
  }
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, floatingLabelText }) => (
  <TextField
    floatingLabelText={floatingLabelText}
    errorText={error}
    {...input}
    {...custom}
  />
);

const SyncNameField = ({ handleSubmit, dispatch, file, files }) => (
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
                f.name === e.target.value
                && f.kind === file.kind)
                && e.target.value !== '') {
          dispatch(editFile(file.id, e.target.value, file.contain, file.tags));
        }
      }}
    />
  </form>
);

renderTextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
  }).isRequired,
  floatingLabelText: PropTypes.string.isRequired,
};

SyncNameField.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    parentID: PropTypes.number,
    visible: PropTypes.bool,
    kind: PropTypes.string,
    contain: PropTypes.string,
    tags: PropTypes.array,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Form = reduxForm({
  form: 'editField',
  validate,
})(SyncNameField);

const selector = formValueSelector('editField');

export default connect((state) => {
  const name = selector(state, 'name');
  return { name };
})(Form)