import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, submit, reset } from 'redux-form';
import TextField from 'material-ui/TextField';

const validate = (value, props) => {
  const errors = {};
  if (props.file.tags.some(t => t === value.tag)) {
    errors.tag = 'This tag already exists';
  }
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, floatingLabelText, onKeyPress }) => (
  <TextField
    floatingLabelText={floatingLabelText}
    errorText={error}
    onKeyPress={onKeyPress}
    {...input}
    {...custom}
  />
);

class SyncTagsField extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { dispatch, invalid, pristine } = this.props;
    return (
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <Field
          name="tag"
          component={renderTextField}
          floatingLabelText="New tag..."
          dispatch={dispatch}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !invalid && !pristine) {
              dispatch(reset('tagsField'));
              dispatch(submit('tagsField'));
            }
          }}
        />
      </form>
    );
  }
}

renderTextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string.isRequired,
  }).isRequired,
  floatingLabelText: PropTypes.string.isRequired,
  onKeyPress: PropTypes.func.isRequired,
};

SyncTagsField.propTypes = {
  dispatch: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'tagsField',
  validate,
})(SyncTagsField);
