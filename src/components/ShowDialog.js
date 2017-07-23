import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { moveFile, editFile } from '../actions';

const newName = (files, name) => {
  if (files.some(f => f.name === name)) {
    return newName(files, `${name}(new)`);
  }
  return name;
};
const folderStyle = {
  color: 'red',
};

class ShowDialog extends Component {
  render() {
    const { files, dialog, dispatch } = this.props;
    const dragItem = files.find(f => f.id === dialog.from);
    const dropResult = files.find(f => f.id === dialog.to);
    const children = files.filter(f => f.parentID === dialog.to);
    const actions = [
      <FlatButton
        label="No"
        secondary
        onTouchTap={() => {
          dispatch({ type: 'HIDE_DIALOG' });
        }}
        />,
      <FlatButton
        label="Yes"
        primary
        onTouchTap={() => {
          dispatch(moveFile(dialog.from, dialog.to));
          dispatch(editFile(dragItem.id, newName(children, `${dragItem.name}(new)`), dragItem.contain, dragItem.tags));
          dispatch({ type: 'HIDE_DIALOG' });
        }}
        />,
    ];
    return (
      <span>
        <Dialog
          title="Warning!"
          actions={actions}
          modal={true}
          open={dialog.opened}
        >
          {dialog.opened ?
            <span>
            You are trying to move {dragItem.kind} <span style={folderStyle}>{`${dragItem.name} `}</span>
              to folder <span style={folderStyle}>{`${dropResult.name}`}</span>.
            This folder already have the {dragItem.kind} with name <span style={folderStyle}>{`${dragItem.name}`}</span>.
            Would you like to move the {dragItem.kind} with new name <span style={folderStyle}>
              {newName(children, `${dragItem.name}(new)`)}
            </span>?
            </span>
            : null
          }
        </Dialog>
      </span>
    );
  }
}

export default ShowDialog;