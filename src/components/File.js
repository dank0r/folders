import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DragSource, DropTarget } from 'react-dnd';
import IconButton from 'material-ui/IconButton';
import flow from 'lodash/flow';
import Edit from './Edit';
import { addFile, toggleVisibility, removeFileForDnD, removeFile, newEditing, editFile as edit } from '../actions';
import { note, openFolder, closeFolder, emptyFolder, createFile, deleteFile, editFile } from '../images';

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

const children = (files, id) => (
  files.filter(f => f.parentID === id)
    .reduce((prev, curr) => {
      if (files.filter(f => f.parentID === curr.id).length === 0) {
        return prev.concat(curr.id);
      }
      return prev.concat(curr.id).concat(children(files, curr.id));
    }, [])
);

const isAllowed = (files, fromID, to) => {
  const from = files.find(i => i.id === fromID);
  if (from.kind === 'folder') {
    return (!children(files, fromID).some(item => item === to.id) && fromID !== to.id);
  }
  return true;
};

const fileSource = {
  beginDrag(props) {
    return props.f;
  },
  endDrag(props, monitor) {
    const dragItem = monitor.getItem();
    const dropResult = monitor.getDropResult();
    const { files, dispatch } = props;
    if (dropResult) {
      if (dropResult.kind === 'folder' && isAllowed(files, dragItem.id, dropResult)) {
        dispatch(removeFileForDnD(dragItem.id));
        dispatch(addFile(
          dropResult.id,
          dragItem.kind,
          dragItem.tags,
          dragItem.name,
          dragItem.contain,
          parseInt(dragItem.id, 10),
        ));
      }
    }
  },
};

const fileTarget = {
  canDrop(props, monitor) {
    return props.f.kind === 'folder' && isAllowed(props.files, monitor.getItem().id, props.f);
  },
  hover(props) {
    return props.f;
  },
  drop(props) {
    return props.f;
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver(),
    dragItem: monitor.getItem(),
  };
}

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

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
      opacity: '0',
    };
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.renderStyles = this.renderStyles.bind(this);
  }

  componentDidMount() {
    const img = new Image();
    img.src = this.props.f.kind === 'folder' ? '/empty_folder.png' : '/note.png';
    img.onload = () => this.props.connectDragPreview(img);
  }

  mouseOver() {
    this.setState({ isHover: true, opacity: '1' });
  }

  mouseOut() {
    this.setState({ isHover: false, opacity: '0' });
  }

  renderStyles(isOver, canDrop, dragItem, files, file) {
    if (isOver && canDrop) {
      if (files.filter(
            f => f.parentID === file.id)
          .find(f => f.name === dragItem.name
          && f.kind === dragItem.kind
          && f.id !== dragItem.id)) {
        return 'red';
      }
      return 'grey';
    }
    return 'white';
  }

  render() {
    const {
      f,
      files,
      space,
      dispatch,
      opened,
      editing,
      connectDragSource,
      connectDropTarget,
      isDragging,
      canDrop,
      isOver,
      dragItem,
      } = this.props;
    return connectDragSource(connectDropTarget(
      <div
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
        style={{
          transition: '0.1s',
          width: '100%',
          margin: '0px',
          display: 'flex',
          alignItems: 'center',
          opacity: isDragging ? 0 : 1,
          cursor: 'move',
          border: `1px dashed ${this.renderStyles(isOver, canDrop, dragItem, files, f)}`,
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span role="presentation" style={style} onClick={() => { dispatch(toggleVisibility(f.id)); }}>{space}
            <span style={{ cursor: 'pointer' }}>{icons(files, f)}</span>
          </span>
          {
            f.id !== editing ?
              <span style={{
                display: 'flex',
                alignItems: 'center',
              }}
              >
                <span style={style}>
                  {f.id !== opened ?
                    <Link to={f.kind === 'note' ? `/edit/${f.id}` : `/open/${f.id}`}>
                      {
                        strSize(f.name, 'Roboto', 20) > 142 ? cut(f.name) : f.name
                      }
                    </Link>
                  : strSize(f.name, 'Roboto', 20) > 142 ? cut(f.name) : f.name
                  }
                </span>

                <span
                  className="buttons"
                  onMouseOut={this.mouseOut}
                  style={{ opacity: this.state.opacity, transition: '0.2s' }}
                >
                  {f.kind === 'folder' ?
                    <span>
                      <IconButton
                        tooltip="Edit"
                        tooltipPosition="bottom-left"
                        style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                        onClick={() => { dispatch(newEditing(f.id)); }}
                      >
                        {editFile}
                      </IconButton>
                      <Link to={`/create/${f.id}`}>
                        <IconButton tooltip="Add File" tooltipPosition="bottom-left" style={{ width: '30px', height: '30px' }}>
                          {createFile}
                        </IconButton>
                      </Link>
                    </span>
                    : null
                  }
                  <IconButton
                    tooltip="Delete"
                    tooltipPosition="bottom-left"
                    onClick={() => { dispatch(removeFile(f.id)); }}
                    style={{ width: '30px', height: '30px' }}
                  >
                    {deleteFile}
                  </IconButton>
                </span>
              </span>
              :
              <Edit
                files={files}
                f={f}
                dispatch={dispatch}
                onSubmit={(data) => {
                  dispatch(edit(f.id, data.name, f.contain, f.tags));
                  dispatch(newEditing(null));
                }}
                initialValues={{ name: f.name }}
              />
          }
        </span>
      </div>,
    ));
  }
}

File.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    parentID: PropTypes.number,
    visible: PropTypes.bool,
    kind: PropTypes.string,
    contain: PropTypes.string,
    tags: PropTypes.array,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  space: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  dragItem: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    parentID: PropTypes.number,
    visible: PropTypes.bool,
    kind: PropTypes.string,
    contain: PropTypes.string,
    tags: PropTypes.array,
  }).isRequired,
};

export default flow(
  DragSource('dnd', fileSource, collectSource),
  DropTarget('dnd', fileTarget, collectTarget),
)(File);