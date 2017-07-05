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
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'CSS',
        id: 2,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'React',
        id: 3,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Folder',
        id: 4,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Javascript',
        id: 5,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Angular',
        id: 6,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'PHP',
        id: 7,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Webpack',
        id: 8,
        parentID: null,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'About this app',
        id: 9,
        parentID: null,
        visible: false,
        kind: 'note',
        contain:
          'Hello!\n\n' +
          'This app is built using Javascript, HTML, CSS, React.js, Redux, React DnD, React Router v4, Material UI and Node.js \nby Daniil Korogodsky.\n\n' +
          'My Github profile: https://github.com/danya296',
        tags: ['about', 'author', 'app'],
      },
      {
        name: 'New folder',
        id: 10,
        parentID: 1,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Web',
        id: 11,
        parentID: 1,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'Note',
        id: 12,
        parentID: 1,
        visible: false,
        kind: 'note',
        contain: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['lorem', 'text', 'note'],
      },
      {
        name: 'CSS Note',
        id: 13,
        parentID: 2,
        visible: false,
        kind: 'note',
        contain: 'Some text',
        tags: ['css'],
      },
      {
        name: 'animals',
        id: 14,
        parentID: 4,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'cat',
        id: 15,
        parentID: 14,
        visible: false,
        kind: 'note',
        contain: 'The cat said meow...',
        tags: ['cat', 'animal'],
      },
      {
        name: 'dog',
        id: 16,
        parentID: 14,
        visible: false,
        kind: 'note',
        contain: 'The dog said woof...',
        tags: ['dog', 'animal'],
      },
      {
        name: 'birds',
        id: 17,
        parentID: 4,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'eagle',
        id: 18,
        parentID: 17,
        visible: false,
        kind: 'note',
        contain: 'The eagle flies at a speed greater than 300 km / h...',
        tags: ['eagle', 'birds'],
      },
      {
        name: 'owl',
        id: 19,
        parentID: 17,
        visible: false,
        kind: 'note',
        contain: 'Owls are very beautiful...',
        tags: ['owl', 'birds'],
      },
      {
        name: 'note about JS',
        id: 20,
        parentID: 5,
        visible: false,
        kind: 'note',
        contain: 'JS is awesome!',
        tags: ['js'],
      },
      {
        name: '2.0',
        id: 21,
        parentID: 6,
        visible: false,
        kind: 'folder',
        contain: '',
        tags: [],
      },
      {
        name: 'about webpack',
        id: 22,
        parentID: 8,
        visible: false,
        kind: 'note',
        contain: 'Webpack is an open-source JavaScript module bundler. Webpack takes modules with dependencies and generates static assets representing those modules.',
        tags: ['webpack'],
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
