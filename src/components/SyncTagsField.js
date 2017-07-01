import React, { Component } from 'react';
import { Field, reduxForm, submit, formValueSelector, reset } from 'redux-form';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import { connect } from 'react-redux';
import { editFile } from '../actions';

const validate = (value, props) => {
  const errors = {};
  if (props.file.tags.some(t => t === value.tag))
    errors.tag = 'This tag already exists';
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, floatingLabelText, onKeyPress }) => {
  return (
    <TextField
      floatingLabelText={floatingLabelText}
      errorText={error}
      onKeyPress={onKeyPress}
      {...input}
      {...custom}
      />
  );
};

class SyncTagsField extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleRequestDelete(tag, file) {
    this.setState({ tags: this.state.tags.filter(t => t!==tag) });
    this.props.dispatch(editFile(
      file.id, this.state.name, this.state.contain, this.state.tags.filter(t => t !== tag)
    ));
  }

  handleTouchTap(tag) {
    this.props.history.push(`/search/tags/${tag}`);
  }
  render() {
    const { file, dispatch, handleSubmit, invalid, pristine, resetForm } = this.props;
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

export default reduxForm({
  form: 'tagsField',
  validate,
})(SyncTagsField);
