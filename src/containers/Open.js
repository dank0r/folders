import { connect } from 'react-redux';
import OpenFile from '../components/OpenFile';

const a = (files, id) => files.find(f => f.id === id);

const mapStateToProps = (state, ownProps) => ({
  file: a(state.files, ownProps.id),
  files: state.files,
});

const Open = connect(mapStateToProps)(OpenFile);

export default Open;