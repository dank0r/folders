import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { SelectField } from 'redux-form-material-ui';

const validate = (value) => {
  const errors = {};
  if (value.query.indexOf('#') !== -1) {
    errors.query = 'A-Z, a-z, 0-9';
  }
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, hintText }) => (
  <TextField
    hintlText={hintText}
    errorText={error}
    {...input}
    {...custom}
  />
);

const Search = ({ history, query, type, pristine, invalid }) => (
  <form onSubmit={(e) => { e.preventDefault(); }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255, 0.5)',
    }}
    >
      <Field
        name="query"
        component={renderTextField}
        hintText="Search..."
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !invalid && !pristine && query !== '') {
            history.push(`/search/${type}/${query}`);
          }
        }}
      />
      <Field
        name="type"
        style={{ width: 200, margin: 5 }}
        component={SelectField}
      >
        <MenuItem value="names" primaryText="by names" />
        <MenuItem value="tags" primaryText="by tags" />
        <MenuItem value="text" primaryText="by text" />
        <MenuItem value="deep" primaryText="Deep search" />
      </Field>
      <FloatingActionButton
        style={{ marginLeft: 0 }}
        mini
        disabled={pristine || invalid || query === ''}
        onTouchTap={() => {
          history.push(`/search/${type}/${query}`);
        }}
      >
        <ActionSearch />
      </FloatingActionButton>
    </div>
  </form>
);

renderTextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string.isRequired,
  }).isRequired,
  hintText: PropTypes.string.isRequired,
};


Search.propTypes = {
  query: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
};

const Form = reduxForm({
  form: 'searchField',
  validate,
})(withRouter(Search));

const selector = formValueSelector('searchField');

export default connect((state) => {
  const query = selector(state, 'query');
  const type = selector(state, 'type');
  return { query, type };
})(Form)