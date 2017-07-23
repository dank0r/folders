import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import { Field, reduxForm, submit, change, formValueSelector } from 'redux-form';
import { SelectField, TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';

const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
};

const warn = (value) => {
  const warnings = {};
  if (value.tags.some(t => t === value.tagsField)) {
    warnings.tagsField = 'This tag already exists';
  }
  return warnings;
};

const validate = (value, props) => {
  const errors = {};
  if (
    props.files.filter(f => f.parentID === props.id)
      .some(f => f.name === value.name && f.kind === value.type)) {
    errors.name = `${value.type === 'folder' ? 'Folder' : 'Note'} with this name already exists`;
  }
  return errors;
};

const renderTextField = ({ input, meta: { error, warning }, hintText, ...custom }) => (
  <TextField
    hintText={hintText}
    errorText={error || warning}
    {...input}
    {...custom}
  />
);

const renderTags = ({ history, input: { value, onChange }, clearField }) => (
  <span>
    <span style={wrapper}>
      {
        value.map(tag => (
          <Chip
            onRequestDelete={() => { onChange(value.filter(t => t !== tag)); }}
            onTouchTap={() => { history.push(`/search/tags/${tag}`); }}
            style={{ margin: 4 }}
          >
            {tag}
          </Chip>
        ))
      }
    </span>
    <Field
      name="tagsField"
      floatingLabelText="New tag..."
      component={renderTextField}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !value.some(t => t === e.target.value)) {
          onChange(value.concat(e.target.value));
          clearField();
        }
      }}
    />
    <br />
  </span>
);

const CreatePage = (
  { id, dispatch, history, files, handleSubmit, pristine, input, name, type }) => {
  if (files.filter(f => (f.id === id && f.kind === 'folder')).length > 0) {
    return (
      <div>
        <span style={{ fontSize: 30 }}>CREATE</span><br /><br /><br />
        <form onSubmit={handleSubmit}>
          <Field
            name="type"
            component={SelectField}
            floatingLabelText="Type"
            style={{ width: 200 }}
          >
            <MenuItem value="folder" primaryText="Folder" />
            <MenuItem value="note" primaryText="Note" />
          </Field>
          <br />
          <Field
            name="name"
            floatingLabelText="Name"
            component={renderTextField}
          />
          <br />
          { type === 'note' ?
            <span>
              <Field
                name="tags"
                component={renderTags}
                dispatch={dispatch}
                clearField={() => {
                  dispatch(change('createPage', 'tagsField', ''));
                }}
                {...input}
              />
              <Field
                name="text"
                floatingLabelText="Text"
                multiLine
                rows={1}
                fullWidth
                component={TextField}
              /><br />
            </span>
              : null
            }
          <FlatButton
            label="Save"
            primary
            disabled={pristine || name === ''}
            onTouchTap={() => {
              dispatch(submit('createPage'));
            }}
          />
          <FlatButton
            label="Cancel"
            secondary
            onTouchTap={() => { history.push('/'); }}
          />
        </form>
      </div>
    );
  }
  return (<div>Error! Wrong URL.</div>);
};

CreatePage.defaultProps = {
  id: null,
  input: undefined,
  name: undefined,
  type: undefined,
};


CreatePage.propTypes = {
  id: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  input: PropTypes.shape({}),
  name: PropTypes.string,
  type: PropTypes.string,
};

renderTags.defaultProps = {
  history: {},
};

renderTags.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  input: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
  }).isRequired,
  clearField: PropTypes.func.isRequired,
};

renderTextField.defaultProps = {
  hintText: undefined,
};

renderTextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
  hintText: PropTypes.string,
};

const Create = withRouter(CreatePage);

const Form = reduxForm({
  form: 'createPage',
  initialValues: {
    type: 'note',
    name: '',
    text: '',
    tags: [],
  },
  validate,
  warn,
})(Create);

const selector = formValueSelector('createPage');

export default connect((state) => {
  const name = selector(state, 'name');
  const type = selector(state, 'type');
  return { name, type };
})(Form)