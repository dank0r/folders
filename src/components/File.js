import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DragSource, DropTarget } from 'react-dnd';
import IconButton from 'material-ui/IconButton';
import flow from 'lodash/flow';
import Edit from './Edit';
import { addFile, toggleVisibility, removeFileForDnD, removeFile, newEditing, editFile as edit } from '../actions';
import { note, openFolder, closeFolder, emptyFolder, createFile, deleteFile, editFile } from '../images';

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

const children = (files, id) => (
  files.filter(f => f.parentID === id)
    .reduce((prev, curr) => {
      if(files.filter(f => f.parentID === curr.id).length === 0)
        return prev.concat(curr.id);
      else
        return prev.concat(curr.id).concat(children(files, curr.id));
    }, [])
);

const isAllowed = (files, fromID, to) => {
  const from = files.find(i => i.id === fromID);
  if (from.kind === 'folder') {
    console.log('children(files, fromID): ', children(files, fromID));
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
      console.log(`You dropped ${dragItem.id} into ${dropResult.id}`);
      console.log('isAllowed(files, from, item): ', isAllowed(files, dragItem.id, dropResult));
      if (dropResult.kind === 'folder' && isAllowed(files, dragItem.id, dropResult)) {
        console.log('files1: ', files);
        dispatch(removeFileForDnD(dragItem.id));
        dispatch(addFile(
          dropResult.id,
          dragItem.kind,
          dragItem.tags,
          dragItem.name,
          dragItem.contain,
          parseInt(dragItem.id, 10),
        ));
      } else {
        alert('It`s not allowed');
      }
    }
  },
};

const fileTarget = {
  canDrop(props, monitor) {
    return props.f.kind === 'folder' && isAllowed(props.files, monitor.getItem().id, props.f);
  },
  hover(props, monitor) {
    const { f } = props;
    return f;
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
  const isNull = monitor.getDropResult() === null;
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
    return isOver && canDrop ?
      files.filter(f => f.parentID === file.id).find(f => f.name === dragItem.name && f.kind === dragItem.kind && f.id !== dragItem.id) ?
        'red' : 'grey'
      : 'white';
  }

  render() {
    const { f, files, space, dispatch, opened, editing, connectDragSource, connectDropTarget, isDragging, canDrop, isOver, dragItem } = this.props;
    return connectDragSource(connectDropTarget(
      <div
        onMouseOver={this.mouseOver}
        onMouseLeave={this.mouseOut}
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
            <a href="#">{icons(files, f)}</a>
          </span>
          {
            f.id !== editing ?
              <span style={{
              display: 'flex',
              alignItems: 'center',
            }}>
          <span style={style}>
            {f.id !== opened ?
              <Link to={f.kind === 'note' ? `/edit/${f.id}` : `/open/${f.id}`}>{
                str_size(f.name, 'Roboto', 20) > 142 ? cut(f.name) : f.name
              }</Link>
              : str_size(f.name, 'Roboto', 20) > 142 ? cut(f.name) : f.name
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
                onSubmit={(data) => { dispatch(edit(f.id, data.name, f.contain, f.tags)); dispatch(newEditing(null)); }}
                initialValues={{ name: f.name }}
                />
          }
          </span>
      </div>
    ));
  }
}

export default flow(
  DragSource('dnd', fileSource, collectSource),
  DropTarget('dnd', fileTarget, collectTarget),
)(File);