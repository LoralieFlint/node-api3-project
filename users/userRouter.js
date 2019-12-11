const express = require('express');
const Users = require('./userDb');
const router = express.Router();

// creates user
  router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log('Error adding new user.', err)
      res.status(500).json({ message: 'Error adding new user.' })
    })
  });

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
      } else {
        res
          .status(400)
          .json({ message: 'invalid user ID.' });
      }
    })
  next();
};

function validateUser(req, res, next) {
  const userData = req.body;

  if (Object.keys(userData).length === 0) {
    res.status(400).json({ message: 'missing user data.' });
  }
  if (!userData.name) {
    res.status(400).json({ message: 'missing required name field.' });
  } else {
    next();
  }
};

function validatePost(req, res, next) {
  const postData = {...req.body, user_id: req.params.id };

  if (Object.keys(postData).length === 0) {
    res.status(400).json({ message: 'missing post data.' });
  }
  if (!postData.text) {
    res.status(400).json({ message: 'missing required text field.' })
  } else {
    next();
  }
};

module.exports = router;
