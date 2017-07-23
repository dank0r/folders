import React from 'react';
import noteImg from './note.png';
import openFolderImg from './open_folder.png';
import closeFolderImg from './close_folder.png';
import emptyFolderImg from './empty_folder.png';
import folderImg from './folder.png';
import deleteImg from './delete.png';
import editImg from './edit.png';
import createImg from './create.png';
import refreshImg from './refresh.png';

const style = {
  width: 30,
  height: 30,
};

export const note = (<img alt="note" style={style} src={noteImg} />);
export const openFolder = (<img alt="open_folder" style={style} src={openFolderImg} />);
export const closeFolder = (<img alt="close_folder" style={style} src={closeFolderImg} />);
export const emptyFolder = (<img alt="empty_folder" style={style} src={emptyFolderImg} />);
export const folder = (<img alt="folder" style={style} src={folderImg} />);

export const deleteFile = (<img alt="deleteFile" width="25" height="25" src={deleteImg} />);
export const editFile = (<img alt="editFile" width="25" height="25" src={editImg} />);
export const createFile = (<img alt="createFile" width="25" height="25" src={createImg} />);
export const refresh = (<img alt="refresh" width="25" height="25" src={refreshImg} />);