import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Field, reduxForm, submit } from 'redux-form';
import { newEditing } from '../actions';

const validate = (value, props) => {
  const errors = {};
  if (
  props.files.filter(f =>
      f.parentID === props.f.parentID &&
      f.id !== props.f.id)
    .some(
      f => f.name === value.name &&
      f.kind === props.f.kind)
  ) {
    errors.name = 'File with this name already exists';
  } else if (value.name === '') {
    errors.name = 'Required';
  }
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, hintText, onKeyPress }) => (
  <TextField
    hintText={hintText}
    errorText={error}
    onChange={(e) => { input.onChange(e.target.value); }}
    onKeyPress={onKeyPress}
    {...input}
    {...custom}
  />
);

const Edit = ({ dispatch, pristine, invalid }) => (
  <form onSubmit={(e) => { e.preventDefault(); }}>
    <Field
      name="name"
      autoFocus
      hintText="Name"
      style={{ width: 100 }}
      component={renderTextField}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !invalid) {
          dispatch(submit('editBar'));
        }
      }}
    />
    <span className="buttons">
      <FlatButton
        label="OK"
        primary
        disabled={pristine || invalid}
        onTouchTap={() => {
          dispatch(submit('editBar'));
        }}
      />
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={() => { dispatch(newEditing(null)); }}
      />
    </span>
  </form>
);

renderTextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string.isRequired,
  }).isRequired,
  hintText: PropTypes.string.isRequired,
  onKeyPress: PropTypes.func.isRequired,
};

Edit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'editBar',
  validate,
})(Edit);