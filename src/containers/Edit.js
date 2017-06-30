import { connect } from 'react-redux';
import React from 'react';
import EditPage from '../components/EditPage';

const a = (files, id) => (
  files.find(f => f.id === id) || {
    id: 0,
    name: '',
    tags: [],
    contain: '',
    kind: 'file',
  }
);

const mapStateToProps = (state, ownProps) => ({
  file: a(state.files, ownProps.id),
  files: state.files,
});

const Edit = connect(mapStateToProps)(
    props => <EditPage {...props} file={props.file} files={props.files} key={props.file.id} />,
);

export default Edit;