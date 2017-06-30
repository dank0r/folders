import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import { blue300, deepPurple400, white, black } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { removeFile, addFile } from '../actions';
import { note, folder } from '../images';
import Result from './Result';

const style = {
  margin: '4',
};

const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
};

const paper = {
  height: 40,
  width: 150,
  margin: '10px',
  textAlign: 'center',
  display: 'inline-block',
  position: 'relative',
  top: '0px',
  right: '0px',
  cursor: 'move',
};

const center = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'space-around',
};

function str_size(text, fontfamily, fontsize) {
  var str = document.createTextNode(text);
  var str_size = Array();
  var obj = document.createElement('A');
  obj.style.fontSize = fontsize + 'pt';
  obj.style.fontFamily = fontfamily;
  obj.style.margin = 0 + 'px';
  obj.style.padding = 0 + 'px';
  obj.appendChild(str);
  document.body.appendChild(obj);
  str_size[0] = obj.offsetWidth;
  str_size[1] = obj.offsetHeight;
  document.body.removeChild(obj);
  //alert(str_size[0] + "px");
  return str_size[0];
}

const cut = (value) => {
  return str_size(value, 'Roboto', 20) > 142 ? cut(value.substring(0, value.length-1)) : `${value}...`;
  //return 123;
};

const path = (files, parentID) => {
  const file = files.find(f => f.id === parentID);
  if (file !== undefined) {
    return path(files, file.parentID).concat({
      name: str_size(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name,
      id: file.id,
    });
  }
  return [];
};

const children = (files, id) => (
  (files.filter(f => f.parentID === id) || [])
    .map((curr) => {
      if (files.filter(f => f.parentID === curr.id).length > 0) {
        return children(files, curr.id).concat(curr.id);
      }
      return curr.id;
    })
);

const isAllowed = (files, fromID, to) => {
  const from = files.find(i => i.id === fromID);
  if (from.kind === 'folder') {
    console.log('children(files, fromID): ', children(files, fromID));
    return (!children(files, fromID).some(item => item === to.id) && fromID !== to.id);
  }
  return true;
};

const OpenFile = ({ file, files, dispatch, history }) => {
  if (file !== undefined) {
    if (file.kind === 'folder') {
      const children = files.filter(f => f.parentID === file.id);
      if (children.length > 0) {
        return (
          <div>
            <span style={{ fontSize: 30 }}>OPEN</span><br /><br /><br />
            Path: /<span>{path(files, file.parentID).map(item => (
              <span key={item.id}><Link to={`/open/${item.id}`}>{item.name}</Link>/</span>
          ))}
              {str_size(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name}
            </span><br />
            <span style={wrapper}>
              {
                children.map(item => (
                    <Result key={item.id} files={files} item={item} dispatch={dispatch} />
              ))
            }
            </span>
          </div>);
      }
      return (
        <div>
          <span style={{ fontSize: 30 }}>OPEN</span><br /><br /><br />
          Path: /<span>{path(files, file.parentID).map(item => (
            <span key={item.id}><Link to={`/open/${item.id}`}>{item.name}</Link>/</span>
        ))}
            {str_size(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name}
          </span><br />
          Nothing here. <Link to={`/create/${file.id}`}>Create?</Link>
        </div>
      );
    }

    return (
      <div>
        <h1>OPEN</h1><br />
        Path: /<span>{path(files, file.parentID).map(item => (
          <span key={item.id}><Link to={`/open/${item.id}`}>{item.name}</Link>/</span>
        ))}
          {str_size(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name}
        </span><br />
        Name: {file.name}<br />
        Tags: <span>{file.tags.length > 0 ? file.tags.join(', ') : null}</span><br />
        Text: {file.contain}<br />
      </div>
    );
  }
  return (<div>Error 404. File not found.</div>);
};

OpenFile.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    parentID: PropTypes.number,
    visible: PropTypes.bool,
    kind: PropTypes.string,
    contain: PropTypes.string,
    tags: PropTypes.array,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(OpenFile);