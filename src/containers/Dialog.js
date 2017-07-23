import { connect } from 'react-redux';
import ShowDialog from '../components/ShowDialog';

const mapStateToProps = (state) => ({
  files: state.files,
  dialog: state.dialog,
});

export default connect(mapStateToProps)(ShowDialog);