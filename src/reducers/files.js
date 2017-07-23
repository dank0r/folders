function removeFile(arr, id) {
  const files = arr
    .filter(f => f.id !== id);
  return files.reduce((prevValue, currValue) => (
    currValue.parentID === id ?
      removeFile(prevValue, currValue.id) :
      prevValue
  ), files);
}

const toggleVisibility = (arr, id) => (
  arr.map(f => (
    f.id === id ? {
      ...f,
      visible: !f.visible,
    } :
      f
  ))
);




const file = (state = {}, action = {}, isLoading = false, isError = false, error = null) => {
      return {
        id: action.id,
        parentID: action.parentID,
        kind: action.kind,
        contain: action.contain,
        tags: action.tags,
        visible: true,
        name: action.name,
        isLoading,
        isError,
        error,
      };
};



const setProps = (files, id, isLoading, error) => (
  files.map(f => (f.id === id ? {
    ...f,
    isLoading,
    isError: error !== undefined,
    error: error === undefined ? null : error,
  } : f))
);

const changeID = (files, prevID, currID) => (files.map(f => f.id === prevID ? { ...f, id: currID } : f));

const files = (state = [], action = {}) => {
  switch (action.type) {

    case 'FETCH_STORE_REQUEST':
      return state;
    case 'FETCH_STORE_SUCCESS':
      console.log('action.response: ', action.response);
      return action.response.sort((file1, file2) => (file2.id - file1.id));
      //return state;
    case 'FETCH_STORE_FAILURE':
      return [{
        name: `${action.error} Err!`,
        id: 1013,
        parentID: null,
        visible: true,
        kind: 'note',
        contain: 'Error!',
        tags: [],
      }];

    case 'ADD_FILE_REQUEST':
      console.log('action: ', action);
      return !state.some(f => f.id === action.body.id) ?
        [file(undefined, {...action.body, id: 1000}, true), ...state].sort((file1, file2) => (file2.id - file1.id))
        : state;
    case 'ADD_FILE_SUCCESS':
      console.log('action.response1: ', action.response);
      //return editFile(state, action.response.id, action.response.name, action.response.contain, action.response.tags, true, false);
      return setProps(changeID(state, 1000, action.response.id), action.response.id, false)
        .sort((file1, file2) => (file2.id - file1.id));
    //return state;
    case 'ADD_FILE_FAILURE':
      //return editFile(state, action.response.id, action.response.name, action.response.contain, action.response.tags, false, true);
      return setProps(state, action.body.id, false, { error: action.error, callAPI: action.callAPI });

    case 'EDIT_FILE_REQUEST':
      console.log('action: ', action);
      let { body } = action;
      return state.map(f => (f.id === action.body.id ? { ...f, ...body, isLoading: true, isError: false, error: null } : f))
        .sort((file1, file2) => (file2.id - file1.id));
    case 'EDIT_FILE_SUCCESS':
      console.log('action.response2: ', action.response);
      //return editFile(state, action.response.id, action.response.name, action.response.contain, action.response.tags, true, false);
      return setProps(state, action.response.id, false);    //return state;
    case 'EDIT_FILE_FAILURE':
      return setProps(state, action.body.id, false, action.error);

    case 'MOVE_FILE_REQUEST':
      console.log('action: ', action);
      let parentID = action.body.parentID;
      return state.map(f => (f.id === action.body.id ? { ...f, parentID, isLoading: true, isError: false, error: null } : f))
        .sort((file1, file2) => (file2.id - file1.id));
    case 'MOVE_FILE_SUCCESS':
      console.log('action.response2: ', action.response);
      //return editFile(state, action.response.id, action.response.name, action.response.contain, action.response.tags, true, false);
      return setProps(state, action.response.id, false);    //return state;
    case 'MOVE_FILE_FAILURE':
      return setProps(state, action.body.id, false, action.error);

    case 'REMOVE_FILE_REQUEST':
      return setProps(state, action.body.id, true);
    case 'REMOVE_FILE_SUCCESS':
      return removeFile(state, action.response.id);
    case 'REMOVE_FILE_FAILURE':
      return setProps(state, action.body.id, false, action.error);

    case 'TOGGLE_VISIBILITY_REQUEST':
      return toggleVisibility(state, action.body.id);
    case 'TOGGLE_VISIBILITY_SUCCESS':
      return state;
    case 'TOGGLE_VISIBILITY_FAILURE':
      return state;

    default:
      return state;
  }
};

export default files;