import { combineReducers } from 'redux';
import files from './files';
import editing from './editing';
import { reducer as formReducer } from 'redux-form';

const reducers = combineReducers({
  files,
  editing,
  form: formReducer,
});

export default reducers;