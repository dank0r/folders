import React from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

const wrapper = {
  display: 'flex',
  flexWrap: 'wrap',
};

const matches = (names, tags, text, type) => {
  switch (type) {
    case 'names':
      return (<div>Match in names:<br /><span style={wrapper}>{names}</span></div>);
    case 'tags':
      return (<div>Match in tags:<br /><span style={wrapper}>{tags}</span></div>);
    case 'text':
      return (<div>Match in text:<br /><span style={wrapper}>{text}</span></div>);
    case 'deep':
      return (
        <span>
          <div>Match in names:<br /><span style={wrapper}>{names}</span></div><br />
          <div>Match in tags:<br /><span style={wrapper}>{tags}</span></div><br />
          <div>Match in text:<br /><span style={wrapper}>{text}</span></div><br />
        </span>
      );
    default:
      return (<div>Match in names<br />{names}</div>);
  }
};

const Results = ({ files, results, type, dispatch }) => {
  console.log('results: ', results);
  const matchInNames = results.matchInNames.length > 0 ?
    results.matchInNames.map(result => <Result files={files} item={result} dispatch={dispatch} type="names" key={result.id} {...result} />) :
    ' No';

  const matchInTags = results.matchInTags.length > 0 ?
    results.matchInTags.map(result => <Result files={files} item={result} dispatch={dispatch} type="tags" key={result.id} {...result} />) :
    ' No';

  const matchInText = results.matchInText.length > 0 ?
    results.matchInText.map(result => <Result files={files} item={result} dispatch={dispatch} type="text" key={result.id} {...result} />) :
    ' No';
  return (
    <div>
      <span style={{ fontSize: 30 }}>RESULTS</span><br /><br /><br />
      {matches(matchInNames, matchInTags, matchInText, type)}
    </div>
  );
};

Results.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  results: PropTypes.shape({
    matchInNames: PropTypes.array,
    matchInTags: PropTypes.array,
    matchInText: PropTypes.array,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default Results;