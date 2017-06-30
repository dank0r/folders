import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import File from './File';
import AddBar from './AddBar';
import { addFile, toggleVisibility, removeFile, newEditing, editFile as edit } from '../actions';
import { note, openFolder, closeFolder, emptyFolder, createFile, deleteFile, editFile } from '../images';

const children = (files, id) => (
  (files.filter(f => f.parentID === id) || [])
    .map((curr) => {
      if (files.filter(f => f.parentID === curr.id).length > 0) {
        return children(files, curr.id).concat(curr.id);
      }
      return curr.id;
    })
);

const icons = (files, f) => {
  if (f.kind === 'folder') {
    if (files.find(f1 => f1.parentID === f.id)) {
      if (f.visible) {
        return openFolder;
      }
      return closeFolder;
    }
    return emptyFolder;
  }
  return note;
};

const style = {
  fontSize: '15',
  margin: '3px',
};

const buttons = {
  textAlign: 'right',
  color: 'red',
  position: 'relative',
  bottom: '10px',
};

function displayFiles(files, id, space, dispatch, opened, editing) {
  const file = files.find(f => f.id === id);
  const visible = file ? file.visible : true;
  return (<div>{
    files.map((f) => {
      if (f.parentID === id && visible === true) {
        return (
          <div key={f.id + f.name}>
            <File f={f} files={files} opened={opened} dispatch={dispatch} space={space} editing={editing} />
            <div>{displayFiles(files, f.id, `\u2000\u2000\u2000\u2000${space}`, dispatch, opened, editing)}</div>
          </div>
        );
      }
      return null;
    })
  }</div>);
}

class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      value: '',
      type: 1,
    };
    this.toggleClick = this.toggleClick.bind(this);
  }

  toggleClick() {
    this.setState({ isClicked: !this.state.isClicked });
  }

  render() {
    const { files, opened, editing, dispatch } = this.props;
    const label = {
      fontSize: 30,
    };
    // dispatch(addFile(null, 'folder', [], input.value, ''));
    return (
      <div>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'no-wrap',
        }}>
          <span style={label}>STORAGE</span>
          <FloatingActionButton
            style={{ marginLeft: 30 }}
            onClick={this.toggleClick}
            mini
          >
            <ContentAdd />
          </FloatingActionButton>
        </span>
        <br />
        {this.state.isClicked ?
          <AddBar
            files={files}
            dispatch={dispatch}
            toggleClick={this.toggleClick}
            onSubmit={(data) => { dispatch(addFile(null, data.type, [], data.name, '')); this.toggleClick(); }}
          />
          : null
        }
        <hr />
        <span style={{
        position: 'relative',
        top: 0,
        left: 0,
      }}>
        <div className="scrolling">
          {displayFiles(files, null, '', dispatch, opened, editing)}
          <br />
          <br />
        </div>
          </span>
      </div>
    );
  }
}
// \u21B3
Files.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  opened: PropTypes.number.isRequired,
};

export default Files;
