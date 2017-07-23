let consign = require('consign');

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');


let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

consign()
  .include('libs/config.js')
  .then('db.js')
  .then('routes')
  .then('libs/boot.js')
  .into(app);


/*
app.delete('/files/dnd', function(req, res) {
  console.log('req.body: ', req.body);
  state = state.filter(f => f.id !== req.body.id);
  res.send(req.body);
  res.sendStatus(200);
});

app.delete('/files', function(req, res) {
  console.log('req.body: ', req.body);
  state = removeFile(state, req.body.id);
  res.send(req.body);
  res.sendStatus(200);
});

app.get('/files', function(req, res) {
  res.send(state);
  res.sendStatus(200);
});

app.post('/files', function(req, res) {
  console.log('req.body: ', req.body);
  console.log('store: ', state);
    state = [req.body, ...state];
    res.send(req.body);
    res.sendStatus(404);
});

app.put('/files', function(req, res) {
  props = req.body;
  console.log('req.body: ', req.body);
  console.log('store: ', state);
  state = state.map(f => (f.id === req.body.id ? Object.assign({}, f, props ) : f));
  res.send(req.body);
  res.sendStatus(200);
});

app.put('/files/move', function(req, res) {
  console.log('req.body: ', req.body);
  console.log('store: ', state);
  state = state.map(f => (f.id === req.body.id ? Object.assign({}, f, { parentID: req.body.parentID }) : f));
  res.send(req.body);
  res.sendStatus(200);
});

app.put('/files/visibility', function(req, res) {
  console.log('req.body: ', req.body);
  console.log('store: ', state);
  state = state.map(f => (f.id === req.body.id ? Object.assign({}, f, { visible: !f.visible }) : f));
  res.send(req.body);
  res.sendStatus(200);
});
*/