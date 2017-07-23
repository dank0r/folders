let newID = 1;
const createID = () => (newID += 1);

/*export const removeFile = id => ({
  type: 'REMOVE_FILE',
  id,
});*/

const request = (requestOptions, actionName, endpoint) => ({
  CALL_API: {
    types: [`${actionName}_REQUEST`, `${actionName}_SUCCESS`, `${actionName}_FAILURE`],
    endpoint,
    requestOptions,
  },
});

export const updateStore = id => dispatch => {
  dispatch(request({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }, 'FETCH_STORE', 'files'));
};

export const addFile = (parentID, kind, tags, name, contain, id) => dispatch => {
  dispatch(request({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: (id !== undefined ? id : createID()),
      parentID,
      kind,
      tags,
      name,
      contain,
    }),
  }, 'ADD_FILE', 'files'));
};

export const removeFile = id => dispatch => {
  dispatch(request({
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  }, 'REMOVE_FILE', 'files'));
};

export const editFile = (id, name, contain, tags) => dispatch => {
  dispatch(request({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, contain, tags }),
  }, 'EDIT_FILE', 'files'));
};

export const moveFile = (id, parentID) => dispatch => {
  dispatch(request({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, parentID }),
  }, 'MOVE_FILE', 'files'));
};

export const toggleVisibility = id => dispatch => {
  dispatch(request({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  }, 'TOGGLE_VISIBILITY', 'files/visibility'));
};

/*export const addFile = (parentID, kind, tags, name, contain, id) => ({
  type: 'ADD_FILE',
  id: (id !== undefined ? id : createID()),
  parentID,
  kind,
  tags,
  name,
  contain,
});*/

/*export const editFile = (id, name, contain, tags) => ({
  type: 'EDIT_FILE',
  id,
  name,
  contain,
  tags,
});*/

/*export const toggleVisibility = id => ({
  type: 'TOGGLE_VISIBILITY',
  id,
});*/


export const newEditing = id => ({
  type: 'NEW_EDITING',
  id,
});

export const showDialog = (from, to) => ({
  type: 'SHOW_DIALOG',
  from,
  to
});