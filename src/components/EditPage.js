import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import { editFile } from '../actions';
import SyncNameField from './SyncNameField';
import SyncTagsField from './SyncTagsField';

const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
};

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.file.name,
      tagsField: '123',
      tags: props.file.tags,
      contain: props.file.contain,
      tagField: '',
      errorText: undefined,
      node: undefined,
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.clearTagsField = this.clearTagsField.bind(this);
    this.updateTagsField = this.updateTagsField.bind(this);
  }

  handleRequestDelete(tag, file) {
    this.setState({ tags: this.state.tags.filter(t => t !== tag) });
    this.props.dispatch(editFile(
        file.id, this.state.name, this.state.contain, this.state.tags.filter(t => t !== tag),
      ));
  }

  handleTouchTap(tag) {
    this.props.history.push(`/search/tags/${tag}`);
  }

  clearTagsField() {
    this.setState({ tagsField: '' });
  }

  updateTagsField(value) {
    this.setState({ tagsField: value });
  }

  render() {
    const { file, dispatch, files } = this.props;
    if (files.filter(f => f === file).length > 0) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <div>
            <span style={{ fontSize: 30 }}>EDIT</span><br /><br /><br />
            ID: {file.id}<br />
            Type: {file.kind}<br />
            <SyncNameField
              onSubmit={(data) => {
                dispatch(editFile(file.id, data.name, this.state.contain, this.state.tags));
                this.setState({ name: data.name });
              }}
              dispatch={dispatch}
              initialValues={{ name: file.name }}
              files={files}
              file={file}
            /><br />
            { file.kind === 'note' ?
              <span>
                <span style={wrapper}>
                  {
                  file.tags.map(tag => (
                    <Chip
                      onRequestDelete={() => { this.handleRequestDelete(tag, file); }}
                      onTouchTap={() => { this.handleTouchTap(tag); }}
                      style={{ margin: 4 }}
                    >
                      {tag}
                    </Chip>
                  ))
                }
                </span>
                <SyncTagsField
                  files={files}
                  file={file}
                  dispatch={dispatch}
                  initialValues={{ tag: '' }}
                  onSubmit={(data) => {
                    dispatch(
                    editFile(file.id, file.name, file.contain, file.tags.concat(data.tag)),
                    );
                  }}
                />
                <br />
                <TextField
                  floatingLabelText="Text"
                  multiLine
                  rows={1}
                  fullWidth
                  defaultValue={this.state.contain}
                  onChange={(e) => {
                    this.setState({ contain: e.target.value });
                    dispatch(editFile(file.id, file.name, e.target.value, file.tags));
                  }}
                /><br />
              </span>
              : null
            }
          </div>
        </form>
      );
    }
    return (<div>Error! Wrong URL.</div>);
  }
}

EditPage.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    parentID: PropTypes.number,
    visible: PropTypes.bool,
    kind: PropTypes.string,
    contain: PropTypes.string,
    tags: PropTypes.array,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withRouter(EditPage);