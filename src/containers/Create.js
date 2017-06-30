import { connect } from 'react-redux';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CreatePage from '../components/CreatePage';
import { addFile } from '../actions';

const mapStateToProps = (state, ownProps) => (
  {
    id: ownProps.id,
    files: state.files,
    data: state.form.createPage ? state.form.createPage.values : {},
  }
);

const mapDispatchToProps = (dispatch, ownProps) => ({
  add: (data) => { dispatch(addFile(ownProps.id, data.type, data.tags, data.name, data.text)); },
});

const Create = connect(mapStateToProps, mapDispatchToProps)(props =>
  <CreatePage {...props} id={props.id} files={props.files} key={props.id} onSubmit={(data) => { props.add(data); props.history.push('/'); }} />,
);

export default withRouter(Create);