import { connect } from 'react-redux';
import Results from '../components/Results';

const a = (files, q, type) => {
  switch (type) {
    case 'names':
      return files.filter(f => f.name.indexOf(q) !== -1);
    case 'tags':
      return files.filter(f => f.tags.find(tag => tag.indexOf(q) !== -1));
    case 'text':
      return files.filter(f => f.contain.indexOf(q) !== -1);
    default:
      return files;
  }
};

const mapStateToProps = (state, ownProps) => ({
  files: state.files,
  results: {
    matchInNames: a(state.files, ownProps.q, 'names'),
    matchInTags: a(state.files, ownProps.q, 'tags'),
    matchInText: a(state.files, ownProps.q, 'text'),
  },
  type: ownProps.type,
});

const SearchResults = connect(mapStateToProps)(Results);

export default SearchResults;