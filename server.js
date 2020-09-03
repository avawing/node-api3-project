const express = require("express");
const userDb = require("./users/userDb");
const postDb = require("./posts/postDb");
const server = express();

server.use(logger);
server.use(express.json());
server.get("/", (req, res) => {
  res.send("Hi");
});

server.get("/api/users", (req, res) => {
  userDb
    .get()
    .then((users) =>
      users
        ? res.status(200).json(users)
        : res.status(500).json({ message: "Oops" })
    );
});

server.get("/api/users/:id", validateUserId, (req, res) => {
  userDb
    .getById(req.params.id)
    .then((user) =>
      user
        ? res.status(200).json(user).end()
        : res.status(500).json({ message: "nope" })
    );
});

server.get("/api/posts", (req, res) => {
  postDb
    .get()
    .then((posts) =>
      posts
        ? res.status(200).json(posts).end()
        : res.status(500).json({ message: "Nah" })
    );
});

server.post("/api/posts", validatePost, (req, res) => {
  postDb.insert(req.body).then((resource) => {
    resource
      ? res.status(201).json(resource).end()
      : res.status(500).json({ message: "Nope" });
  });
});

server.post("/api/users", validateUser, (req, res) => {
  userDb.insert(req.body).then((resource) => {
    resource
      ? res.status(201).json(resource).end()
      : res.status(500).json({ message: "Nope" });
  });
});

server.put("/api/users/:id", validateUserId, validateUser, (req, res) => {
  userDb.update(req.params.id, req.body).then((object) => {
    object
      ? res.status(200).json(object).end()
      : res.status(500).json({ message: "Nope" });
  });
});

server.delete("/api/users/:id", validateUserId, (req, res) => {
  userDb.remove(req.params.id).then((number) => {
    number === 1
      ? res.status(204).json({ message: "Success" })
      : res.status(500).json({ message: "You fail" });
  });
});
//custom middleware

function logger(req, res, next) {
  console.log(
    `a ${req.method} request was made to ${req.url} at ${Date.now()}`
  );
  next();
}

function validateUserId(req, res, next) {
  userDb
    .getById(req.params.id)

    .then((result) => {
      result
        ? next(req.user)
        : res.status(404).json({ message: "Not found" }).end();
    })
    .catch((e) =>
      res
        .status(500)
        .json({ message: `${e}` })
        .end()
    );
}
function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" }).end();
  }
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}
function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" }).end();
  }
  if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}
const port = process.env.PORT || 4000;
server.listen(port, () => console.log("Listening"));
