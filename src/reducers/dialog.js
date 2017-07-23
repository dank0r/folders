const dialog = (state = { opened: false, from: null, to: null }, action = {}) => {
  switch(action.type) {
    case 'SHOW_DIALOG':
      return {
        opened: true,
        from: action.from,
        to: action.to,
      };
    case 'HIDE_DIALOG':
      return {
        opened: false,
        from: null,
        to: null,
      };
    default:
      return state;
  }
};

export default dialog;