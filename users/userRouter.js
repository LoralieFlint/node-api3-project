const express = require("express");
const Users = require("./userDb");
const Posts = require('../posts/postDb');
const router = express.Router();

// creates user
router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log("Error adding new user.", err);
      res.status(500).json({ message: "Error adding new user." });
    });
});

// creates new post by userId
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const data = {...req.body, user_id: req.params.id }; 
  Posts.insert(data)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    console.log('Error adding new post.', err);
    res.status(500).json({ message: 'Error adding new post for user.' });
  })
});


// gets all users in database
router.get("/", (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("Trouble retrieving users.", err);
      res.status(500).json({ message: "Error retrieving users." });
    });
});

// gets users by Id
router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(users => {
    if (users) {
      res.status(200).json(users);
    }
  });
});

// gets posts by user Id
router.get("/:id/posts", (req, res) => {
  // do your magic!
});

// deletes user by Id
router.delete("/:id", (req, res) => {
  // do your magic!
});

// updates post by user Id
router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  Users.getById(id).then(user => {
    if (user) {
      req.user = user;
    } else {
      res.status(400).json({ message: "invalid user ID." });
    }
  });
  next();
}

function validateUser(req, res, next) {
  const userData = req.body;

  if (Object.keys(userData).length === 0) {
    res.status(400).json({ message: "missing user data." });
  }
  if (!userData.name) {
    res.status(400).json({ message: "missing required name field." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const postData = { ...req.body, user_id: req.params.id };

  if (Object.keys(postData).length === 0) {
    res.status(400).json({ message: "missing post data." });
  }
  if (!postData.text) {
    res.status(400).json({ message: "missing required text field." });
  } else {
    next();
  }
}

module.exports = router;
