const editing = (state = null, action = {}) => {
  switch (action.type) {
    case 'NEW_EDITING':
      return action.id;
    default:
      return state;
  }
};

export default editing;