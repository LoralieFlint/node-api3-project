const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");
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
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const data = { ...req.body, user_id: req.params.id };
  Posts.insert(data)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log("Error adding new post.", err);
      res.status(500).json({ message: "Error adding new post for user." });
    });
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
  Users.getById(req.params.id).then(users => {
    if (users) {
      res.status(200).json(users);
    }
  });
});

// gets posts by user Id
router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      if (posts.length == 0) {
        res.status(400).json({
          message: "couldnt find any posts"
        });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "couldnt retrieve posts"
      });
    });
});

// deletes user by Id
router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  Users.remove(id)
    .then(res => {
      if (res.length == 0) {
        res.status(404).json({
          message: "there is no user with this id"
        });
      } else {
        res.status(200).json({
          message: "user was deleted"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "there was an error deleting the specified user"
      });
    });
});

// updates post by user Id
router.put("/:id", validateUserId, (req, res) => {
  const edits = req.body;
  const id = req.params.id;
  Users.update(id, edits)
    .then(() => {
      if (!edits.name) {
        res.status(400).json({ errorMessage: "Please provide user name." });
      } else {
        res.status(200).json({ user: `user ${id} was updated.` });
      }
    })
    .catch(err => {
      console.log("error editing user", err);
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
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
