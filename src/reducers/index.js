import { combineReducers } from 'redux';
import files from './files';
import editing from './editing';
import dialog from './dialog';
import { reducer as formReducer } from 'redux-form';

const reducers = combineReducers({
  files,
  editing,
  dialog,
  form: formReducer,
});

export default reducers;