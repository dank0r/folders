import { connect } from 'react-redux';
import React from 'react';
import Files from '../components/Files';
import { updateStore } from '../actions';

const mapStateToProps = (state, ownProps) => ({
  files: state.files,
  opened: ownProps.opened,
  editing: state.editing,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateStore: dispatch(updateStore()),
  dispatch: dispatch,
});

const FileSystem = connect(mapStateToProps, mapDispatchToProps)(
  props => <Files {...props} key={props.opened} />,
);

export default FileSystem;