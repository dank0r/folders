import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Field, reduxForm, submit } from 'redux-form';
import { addFile, toggleVisibility, removeFile, newEditing, editFile as edit } from '../actions';

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
  }
  else if (value.name === '') {
    errors.name = 'Required';
  }
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, hintText, onKeyPress, ref }) => {
  return (
    <TextField
      hintText={hintText}
      errorText={error}
      ref={ref}
      onChange={(e) => { input.onChange(e.target.value); }}
      onKeyPress={onKeyPress}
      {...input}
      {...custom}
      />
  );
};

class Edit extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { f, dispatch, pristine, invalid } = this.props;
    return (
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
  }
}
/*
export default props => {
  const Form = reduxForm({
    form: 'editBar' + props.f.name,
    validate,
    ...props
  })(Edit);
  return Form;
};
*/

export default reduxForm({
  form: 'editBar',
  validate,
})(Edit);