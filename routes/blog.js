const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
}); //root route slash nothing, redirects user to /posts

router.get('/posts', function (req, res) {
  res.render('posts-list');
});

router.get('/new-post', async function (req, res) {
  const [authors] = await db.query('SELECT * FROM authors'); // picks all data from authors table!
  res.render('create-post', { authors: authors });
});

module.exports = router;

/* this configured router will be picked up in app.js by blogRoutes
in app.js and will be used by app.use(blogRoutes) on every incoming request */
