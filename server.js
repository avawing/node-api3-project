const express = require("express");
const userDb = require("./users/userDb");
const postDb = require("./posts/postDb");
const server = express();

server.use(express.json());
server.use(logger());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.get("/api/users", (req, res) => {
  const users = userDb.get();
  users
    ? res.status(200).json(users)
    : res.status(500).json({ message: "Oops" });
});

server.get("/api/users/:id", validateUserId, (req, res) => {
  res.status(200).json(req.users).end();
});

server.get("/api/posts", (req, res) => {
  const posts = postDb.get();
  posts
    ? res.status(200).json(posts).end()
    : res.status(500).json({ message: "Nah" });
});

server.post("/api/posts",validatePost,(req, res)=>{
  const resource = postDb.insert(req.body)
  resource ? res.status(200).json(resource).end() : res.status(500).json({message: 'Nope'})
})

server.post("/api/users", validateUser, (req, res)=>{
  
})
//custom middleware

function logger() {
  return function (req, res, next) {
    console.log(
      `a ${req.method} request was made to ${req.url} at ${Date.now()}`
    );
    next();
  };
}
function validateUserId() {
  return function (req, res, next) {
    req.user = userDb
      .getById(req.params.id)
      .then(
        req.user ? next() : res.status(404).json({ message: "Not found" }).end()
      )
      .catch((e) =>
        res
          .status(500)
          .json({ message: `${e}` })
          .end()
      );
  };
}
function validateUser() {
  return function (req, res, next) {
    if (!req.body) {
      res.status(400).json({ message: "missing user data" }).end();
    }
    if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      next();
    }
  };
}
function validatePost() {
  return function (req, res, next) {
    if (!req.body) {
      res.status(400).json({ message: "missing user data" }).end();
    }
    if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  };
}

module.exports = server;
