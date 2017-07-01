import React, { Component } from 'react';
import { Field, reduxForm, submit, formValueSelector } from 'redux-form';
import TextField from 'material-ui/TextField';
import { editFile } from '../actions';

class SearchFieldForm extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>

      </form>
    );
  }
}