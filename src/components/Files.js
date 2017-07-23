import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import File from './File';
import AddBar from './AddBar';
import { addFile } from '../actions';

const children = (files, id) => (
  (files.filter(f => f.parentID === id) || [])
    .map((curr) => {
      if (files.filter(f => f.parentID === curr.id).length > 0) {
        return children(files, curr.id).concat(curr.id);
      }
      return curr.id;
    })
);

function displayFiles(files, id, space, dispatch, opened, editing) {
  const file = files.find(f => f.id === id);
  const visible = file ? file.visible : true;
  return (<div>{
    files.map((f) => {
      if (f.parentID === id && visible === true) {
        return (
          <div key={f.id + f.name}>
            <File
              f={f}
              files={files}
              opened={opened}
              dispatch={dispatch}
              space={space}
              editing={editing}
            />
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

  componentDidMount() {
    if(this.props.updateStore)
      this.props.updateStore();
  }

  toggleClick() {
    this.setState({ isClicked: !this.state.isClicked });
  }

  render() {
    const { files, opened, editing, dispatch } = this.props;
    console.log('files: ', files);
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
        }}
        >
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
        }}
        >
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

Files.defaultProps = {
  editing: null,
  opened: null,
};

Files.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  opened: PropTypes.number,
  editing: PropTypes.number,
};

export default Files;
