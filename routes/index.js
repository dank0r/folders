module.exports = function(app) {

  const Files = app.db.models.Files;
  const Users = app.db.models.Users;

  function removeFile(arr, id) {
    const files = arr
      .filter(f => f.id !== id);
    return files.reduce((prevValue, currValue) => (
      currValue.parentID === id ?
        removeFile(prevValue, currValue.id) :
        prevValue
    ), files);
  }

  const children = (files, id) => (
    files.filter(f => f.parentID === id)
      .reduce((prev, curr) => {
        if (files.filter(f => f.parentID === curr.id).length === 0) {
          return prev.concat(curr.id);
        }
        return prev.concat(curr.id).concat(children(files, curr.id));
      }, [])
  );

  let state = [
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
  ];

  app.route('/users')
    .get((req,res) => {
      Users.findAll({}).then((users) => {
        res.send(users);
        res.sendStatus(200);
      });
    })
    .post((req,res) => {
      Users.create({
        id: req.body.id,
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })
        .then(result => {
          console.log('result.dataValues: ', result.dataValues);
          res.send(Object.assign({}, result.dataValues, { prevID: req.body.id }));
          res.sendStatus(200);
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
  });

  app.route('/files')
  .delete(function(req, res) {
    console.log('req.body: ', req.body);
      Files.findAll({}).then(files => {
        Files.destroy({ where: { id: req.body.id } })
          .then(() => {
            children(files, req.body.id).forEach((id) => {
              Files.destroy({ where: { id } })
                .catch(error => {
                  res.status(412).json({msg: error.message});
                });
            });
          })
          .catch(error => {
            res.status(412).json({msg: error.message});
          });
      });
      res.send(req.body);
      res.sendStatus(200);
    //state = removeFile(state, req.body.id);
  })

  .get(function(req, res) {
      Files.findAll({}).then(files => {
        res.send(files);
        res.sendStatus(200);
      });
    //res.send(state);
    //res.sendStatus(200);
  })

  .post(function(req, res) {
    console.log('req.body: ', req.body);
    console.log('store: ', state);
    //state = [req.body, ...state];
      Files.create({
        parentID: req.body.parentID,
        kind: req.body.kind,
        tags: req.body.tags,
        name: req.body.name,
        contain: req.body.contain,
      })
        .then(result => {
          console.log('result.dataValues: ', result.dataValues);
          res.send(Object.assign({}, result.dataValues, { prevID: req.body.id }));
          res.sendStatus(200);
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
  })

  .put(function(req, res) {
    let props = req.body;
    console.log('req.body: ', req.body);
    console.log('store: ', state);
    //state = state.map(f => (f.id === req.body.id ? Object.assign({}, f, props) : f));
      Files.update(req.body, { where: { id: req.body.id } })
        .then(result => {
          res.send(req.body);
          res.sendStatus(200);
        })
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });
  });

  app.route('/files/visibility')
  .put(function(req, res) {
      Files.findOne({ where: { id: req.body.id } })
        .then(file => {
          if (file) {
            Files.update({
              visible: !file.visible,
            }, { where: { id: req.body.id } })
              .then(result => {
                res.send(req.body);
                res.sendStatus(200);
              })
              .catch(error => {
                res.status(412).json({ msg: error.message });
              });
          } else {
            res.sendStatus(404);
          }
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    console.log('req.body: ', req.body);
    console.log('store: ', state);
  });

};