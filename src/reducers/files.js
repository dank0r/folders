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


const editFile = (arr, id, name, contain, tags) => (
  arr.map(f => (
    f.id === id ?
    {
      ...f,
      name,
      contain,
      tags,
    } :
      f
  ))
);

const file = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ADD_FILE':
      return {
        id: action.id,
        parentID: action.parentID,
        kind: action.kind,
        contain: action.contain,
        tags: action.tags,
        visible: true,
        name: action.name,
      };
    default:
      return state;

  }
};

const move = (files, from, to) => {

};

const files = (state = [], action = {}) => {
  switch (action.type) {
    case 'ADD_FILE':
      // return state.concat(file(undefined, action));
      return [file(undefined, action), ...state];
    case 'REMOVE_FILE':
      return removeFile(state, action.id);
    case 'REMOVE_FILE_DND':
      return state.filter(f => f.id !== action.id);
    case 'TOGGLE_VISIBILITY':
      return toggleVisibility(state, action.id);
    case 'EDIT_FILE':
      return editFile(state, action.id, action.name, action.contain, action.tags);
    case 'DND':
      return move(state, action.from, action.to);
    default:
      return state;
  }
};

export default files;