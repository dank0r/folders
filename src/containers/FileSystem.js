import { connect } from 'react-redux';
import React from 'react';
import Files from '../components/Files';

const mapStateToProps = (state, ownProps) => ({
  files: state.files,
  opened: ownProps.opened,
  editing: state.editing,
});

const FileSystem = connect(mapStateToProps)(
  props => <Files {...props} key={props.opened} />,
);

export default FileSystem;