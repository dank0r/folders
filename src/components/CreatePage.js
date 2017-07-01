import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import { Link } from 'react-router-dom';
import { Field, reduxForm, submit, change, formValueSelector } from 'redux-form';
import { SelectField, TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import SyncTagsField from './SyncTagsField';

const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
};

const warn = (value) => {
  const warnings = {};
  if (value.tags.some(t => t === value.tagsField))
    warnings.tagsField = 'This tag already exists';
  return warnings;
};

const validate = (value, props) => {
  const errors = {};
  if (props.files.filter(f => f.parentID === props.id).some(f => f.name === value.name && f.kind === value.type))
    errors.name = `${value.type === 'folder' ? 'Folder' : 'Note'} with this name already exists`;
  return errors;
};

const renderTextField = ({ input, meta: { error, warning }, ...custom, hintText }) => {
  return (
    <TextField
      hintlText={hintText}
      errorText={error || warning}
      {...input}
      {...custom}
      />
  );
};

const renderSelectField = ({ input, value, label, meta: { touched, error }, children, ...custom }) => (
  <DropDownMenu
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    {...custom}
    value={value}
  >
    {children}
  </DropDownMenu>
);

class renderTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      tags: this.props.value
    };
  }

  render() {
    const { history, input, dispatch, clearField } = this.props;
    const { value, onChange } = input;
    return (
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
    return null;
  }
}

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: 2,
      tags: [],
      contain: '',
    };
  }
  // dispatch(addFile(id, 'note', tags, this.state.name, this.state.contain));
  render() {
    console.log('props.data: ', this.props.data);
    const { id, dispatch, history, files } = this.props;
      const { handleSubmit, pristine, invalid, reset, input, submitting, name } = this.props;
    console.log('name: ', name);
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
          { this.props.data.type === 'note' ?
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
  }
}

CreatePage.defaultProps = {
  id: null,
};

CreatePage.propTypes = {
  id: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  return { name };
})(Form)