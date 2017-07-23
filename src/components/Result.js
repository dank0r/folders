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
import { removeFile, moveFile } from '../actions';

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

const folderSource = {
  beginDrag(props) {
    return props.item;
  },
  endDrag(props, monitor) {
    const dragItem = monitor.getItem();
    const dropResult = monitor.getDropResult();
    const { files, dispatch } = props;
    if (dropResult) {
      if (dropResult.kind === 'folder' && isAllowed(files, dragItem.id, dropResult)) {
        dispatch(moveFile(dragItem.id, dropResult.id));
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
    const {
      item,
      dispatch,
      connectDragSource,
      connectDropTarget,
      isDragging,
      canDrop,
      isOver,
      } = this.props;
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
              <Link to={item.kind === 'folder' ? `/open/${item.id}` : `/edit/${item.id}`}>
                <span id={item.id}>
                  {strSize(item.name, 'Roboto', 20) > 142 ? cut(item.name) : item.name}
                </span></Link>
            </span>
            <Avatar
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
              <ContentClear color={white} />
            </Avatar>
          </Paper>
        </div>,
      ));
    }
    return null;
  }
}

Result.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    parentID: PropTypes.number,
    visible: PropTypes.bool,
    kind: PropTypes.string,
    contain: PropTypes.string,
    tags: PropTypes.array,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
};

export default flow(
  DragSource('dnd', folderSource, collectSource),
  DropTarget('dnd', folderTarget, collectTarget),
)(Result);