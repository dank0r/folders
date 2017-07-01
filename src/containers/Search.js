import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Field, reduxForm, submit, formValueSelector } from 'redux-form';
import { SelectField } from 'redux-form-material-ui';

const validate = (value, props) => {
  const errors = {};
  if (value.query.indexOf('#') !== -1)
    errors.query = 'A-Z, a-z, 0-9';
  return errors;
};

const renderTextField = ({ input, meta: { error }, ...custom, hintText }) => {
  return (
    <TextField
      hintlText={hintText}
      errorText={error}
      {...input}
      {...custom}
      />
  );
};

class a extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.q,
      type: props.type,
    };
  }
  // history.push(`/search/${this.state.isDeep ? 'd/' : 'nd/'}${this.state.value}`);
  render() {
    const { history, query, type, pristine, invalid } = this.props;
    return (
      <form onSubmit={(e) => { e.preventDefault(); }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255, 0.5)',
      }}>
        <Field
          name="query"
          component={renderTextField}
          hintText="Search..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !invalid && !pristine && query !== '')
              history.push(`/search/${type}/${query}`);
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
  }
}

a.propTypes = {
  q: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const Form = reduxForm({
  form: 'searchField',
  validate,
})(withRouter(a));

const selector = formValueSelector('searchField');

export default connect((state) => {
  const query = selector(state, 'query');
  const type = selector(state, 'type');
  return { query, type };
})(Form)