import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { white, black } from 'material-ui/styles/colors';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import { note, folder } from '../images';
import { removeFileForDnD, removeFile, addFile } from '../actions';

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

const folderSource = {
  beginDrag(props, monitor) {
    return props.item;
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

const folderTarget = {
  canDrop(props, monitor) {
    return props.item.kind === 'folder' && isAllowed(props.files, monitor.getItem().id, props.item);
  },
  drop(props) {
    return props.item;
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
  };
}

class Result extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = this.props.item.kind === 'folder' ? '/folder.png' : '/note.png';
    img.onload = () => this.props.connectDragPreview(img);
  }
  renderStyles(isOver, canDrop) {
    return isOver && canDrop ? '1px dashed gray' : '1px dashed white';
  }
  render() {
    const { files, item, dispatch, connectDragSource, connectDropTarget, isDragging, canDrop, isOver } = this.props;
    if (item !== undefined) {
      return connectDragSource(connectDropTarget(
        <div>
        <Paper
          key={item.id}
          style={{
          ...paper,
          opacity: isDragging ? 0 : 1,
          border: this.renderStyles(isOver, canDrop),
          }}
          zDepth={1}
          >
                    <span
                      style={{
                        position: 'absolute',
                        textAlign: 'left',
                        top: '5px',
                        left: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      >
                    <Avatar
                      size={32}
                      backgroundColor={white}
                      >
                      <Link to={`/open/${item.id}`}>{item.kind === 'folder' ? folder : note}</Link>
                    </Avatar>
                    <Link to={item.kind === 'folder' ? `/open/${item.id}` : `/edit/${item.id}`}><span id={item.id}>{
                      str_size(item.name, 'Roboto', 20) > 142 ? cut(item.name) : item.name
                    }</span></Link>
                      </span>
          <Avatar
            tooltip="Remove"
            onClick={() => { dispatch(removeFile(item.id)); }}
            size={15}
            backgroundColor={black}
            style={{
                        position: 'absolute',
                        textAlign: 'right',
                        top: '-7px',
                        right: '-7px',
                        cursor: 'pointer',
                      }}
            >
            <ContentClear color={white}/>
          </Avatar>
        </Paper>
          </div>
      ));
    }
    return null;
  }
}

Result.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  parentID: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  kind: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default flow(
  DragSource('dnd', folderSource, collectSource),
  DropTarget('dnd', folderTarget, collectTarget)
)(Result);