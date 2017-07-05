import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import FileSystem from '../containers/FileSystem';
import Search from '../containers/Search';
import SearchResults from '../containers/SearchResults';
import Create from '../containers/Create';
import Edit from '../containers/Edit';
import Open from '../containers/Open';

const Welcome = () => (
  <div style={{ fontSize: 30 }}>
    WELCOME!
  </div>
);

const td1 = {
  border: '0px solid black',
  borderCollapse: 'collapse',
  margin: '0px',
  padding: '10px',
  verticalAlign: 'top',
  textAlign: 'left',
  position: 'relative',
  top: '0px',
  right: '0px',
  width: '30%',
  minWidth: 400,
  maxHeight: 800,
};

const td2 = {
  border: '0px solid black',
  borderCollapse: 'collapse',
  margin: '0px',
  padding: '10px',
  verticalAlign: 'top',
  textAlign: 'left',
  position: 'relative',
  top: '0px',
  right: '0px',
  width: '70%',
};

const style = {
  border: '0px solid black',
  borderCollapse: 'collapse',
  margin: '0px',
  padding: '10px',
  verticalAlign: 'top',
  textAlign: 'left',
  position: 'relative',
  top: '0px',
  right: '0px',
};

const table = {
  ...style,
  width: '99%',
  height: '100vh',
  align: 'top',
};

const container = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'space-around',
};


const App = () => (
  <div>
    <Router>
      <div style={container}>
        <table style={table}>
          <tr style={style}>
            <td style={td1}>
              <span>
                <Switch>
                  <Route
                    exact
                    path="/open/:id"
                    render={({ match }) => (<FileSystem opened={parseInt(match.params.id, 10)} />)}
                  />
                  <Route
                    exact
                    path="/edit/:id"
                    render={({ match }) => (<FileSystem opened={parseInt(match.params.id, 10)} />)}
                  />
                  <Route
                    path="/"
                    render={() => (<FileSystem opened={0} />)}
                  />
                </Switch>
              </span>
            </td>
            <td style={td2}>
              <Switch>
                <Route
                  exact
                  path="/search/:type/:q"
                  render={({ match }) => (
                    <Search
                      key={match.path.length}
                      initialValues={{ query: match.params.q, type: match.params.type }}
                    />
                  )
                  }
                />
                <Route
                  path="/"
                  render={({ match }) => (
                    <Search
                      key={match.path.length}
                      initialValues={{ query: '', type: 'names' }}
                    />
                  )}
                />
              </Switch>
              <Switch>
                <Route exact path="/create/:id" render={({ match }) => (<Create id={parseInt(match.params.id, 10)} />)} />
                <Route exact path="/edit/:id" render={({ match }) => (<Edit id={parseInt(match.params.id, 10)} />)} />
                <Route exact path="/open/:id" render={({ match }) => (<Open id={parseInt(match.params.id, 10)} />)} />
                <Route
                  exact
                  path="/search/:type/:q"
                  render={({ match }) => (
                    <SearchResults q={match.params.q} type={match.params.type} />
                  )}
                />
                <Route spath="/" render={() => (<Welcome />)} />
              </Switch>
            </td>
          </tr>
        </table>
      </div>
    </Router>
  </div>
);
export default DragDropContext(HTML5Backend)(App);
