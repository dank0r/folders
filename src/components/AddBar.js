import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, submit, formValueSelector } from 'redux-form';
import { SelectField } from 'redux-form-material-ui';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';

const validate = (value, props) => {
  const errors = {};
  if (props.files.filter(f => f.parentID === null)
      .some(f => f.name === value.name && f.kind === value.type)) {
    errors.name = `${value.type === 'folder' ? 'Folder' : 'Note'} with this name already exists`;
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

const AddBar = ({ dispatch, toggleClick, invalid, pristine, name }) => (
  <form>
    <span style={{
      display: 'flex',
      alignItems: 'center',
    }}
    >
      <Field
        autoFocus
        name="name"
        hintText="Name..."
        component={renderTextField}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !invalid) {
            dispatch(submit('addBar'));
          }
        }}
        style={{ width: 100, margin: 5 }}
      />
      <Field
        name="type"
        component={SelectField}
        style={{ width: 110, margin: 5 }}
        validate={value => (value === null ? 'Required' : undefined)}
      >
        <MenuItem value="folder" primaryText="Folder" />
        <MenuItem value="note" primaryText="Note" />
      </Field>
      <span className="buttons">
        <FlatButton
          className="button"
          onTouchTap={() => { dispatch(submit('addBar')); }}
          label="OK"
          disabled={invalid || pristine || name === ''}
          primary
        />
        <FlatButton
          overlayStyle={{ width: 300 }}
          label="Cancel"
          secondary
          onTouchTap={toggleClick}
        />
      </span>
    </span>
    <br />
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

AddBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  toggleClick: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

const Form = reduxForm({
  form: 'addBar',
  initialValues: {
    type: 'folder',
    name: '',
  },
  validate,
})(AddBar);

const selector = formValueSelector('addBar');

export default connect((state) => {
  const name = selector(state, 'name');
  return { name };
})(Form)