import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Result from './Result';

const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
};

function strSize(text, fontfamily, fontsize) {
  const str = document.createTextNode(text);
  const size = [];
  const obj = document.createElement('A');
  obj.style.fontSize = `${fontsize}pt`;
  obj.style.fontFamily = fontfamily;
  obj.style.margin = '0px';
  obj.style.padding = '0px';
  obj.appendChild(str);
  document.body.appendChild(obj);
  size[0] = obj.offsetWidth;
  size[1] = obj.offsetHeight;
  document.body.removeChild(obj);
  return size[0];
}

const cut = value => (strSize(value, 'Roboto', 20) > 142 ? cut(value.substring(0, value.length - 1)) : `${value}...`);

const path = (files, parentID) => {
  const file = files.find(f => f.id === parentID);
  if (file !== undefined) {
    return path(files, file.parentID).concat({
      name: strSize(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name,
      id: file.id,
    });
  }
  return [];
};

const OpenFile = ({ file, files, dispatch }) => {
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
              {strSize(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name}
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
            {strSize(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name}
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
          {strSize(file.name, 'Roboto', 20) > 142 ? cut(file.name) : file.name}
        </span><br />
        Name: {file.name}<br />
        Tags: <span>{file.tags.length > 0 ? file.tags.join(', ') : null}</span><br />
        Text: {file.contain}<br />
      </div>
    );
  }
  return (<div>Error 404. File not found.</div>);
};

OpenFile.defaultProps = {
  file: undefined,
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
  }),
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default OpenFile;