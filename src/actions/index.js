let newID = 100;
const createID = () => (newID += 1);

export const removeFile = id => ({
  type: 'REMOVE_FILE',
  id,
});

export const removeFileForDnD = id => ({
  type: 'REMOVE_FILE_DND',
  id,
});

export const addFile = (parentID, kind, tags, name, contain, id) => ({
  type: 'ADD_FILE',
  id: (id !== undefined ? id : createID()),
  parentID,
  kind,
  tags,
  name,
  contain,
});

export const editFile = (id, name, contain, tags) => ({
  type: 'EDIT_FILE',
  id,
  name,
  contain,
  tags,
});

export const toggleVisibility = id => ({
  type: 'TOGGLE_VISIBILITY',
  id,
});

export const changeDeep = deep => ({
  type: 'CHANGE_DEEP',
  deep,
});

export const searchQuery = q => ({
  type: 'SEARCH_QUERY',
  q,
});

export const newEditing = id => ({
  type: 'NEW_EDITING',
  id,
});