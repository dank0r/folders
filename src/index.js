import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components/App';
import reducers from './reducers';
import './index.css';

injectTapEventPlugin();

const store = createStore(reducers,
  {
    files: [
      {
        name: 'HTML',
        id: 1,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'CSS',
        id: 2,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 3,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Redux',
        id: 4,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Javascript',
        id: 5,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Angular',
        id: 6,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'PHP',
        id: 7,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Webpack',
        id: 8,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'About this app',
        id: 9,
        parentID: null,
        visible: true,
        kind: 'note',
        contain:
          'Hello!\n\n' +
          'This app is built using Javascript, HTML, CSS, React.js, Redux, React DnD, React Router v4, Material UI and Node.js by Daniil Korogodsky.\n\n' +
          'My Github profile: https://github.com/danya296',
        tags: ['about', 'author', 'app'],
      },
      {
        name: 'React',
        id: 23,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 24,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 25,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 26,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 27,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 28,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 29,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 30,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 31,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 32,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 33,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 34,
        parentID: null,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'f2',
        id: 2,
        parentID: 1,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: ['file#1', 'react'],
      },
      {
        name: 'f3',
        id: 3,
        parentID: 2,
        visible: true,
        kind: 'note',
        contain: 'lgxj;llllhxjhxlf',
        tags: ['file#2', 'redux'],
      },
      {
        name: 'f2',
        id: 4,
        parentID: 2,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: ['file#1', 'react'],
      },
      {
        name: 'f2',
        id: 5,
        parentID: 2,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: ['file#1', 'react'],
      },
      {
        name: 'f2',
        id: 6,
        parentID: 1,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: ['file#1', 'react'],
      },
      {
        name: 'f2',
        id: 7,
        parentID: 1,
        visible: true,
        kind: 'folder',
        contain: '',
        tags: ['file#1', 'react'],
      },
    ],
    editing: null,

  },
);

const style = {
  fontFamily: 'Impact',
};

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App style={style} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
