const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/posts');
}); //root route slash nothing, redirects user to /posts

router.get('/posts', async function (req, res) {
  const query = `
  SELECT posts.*, authors.name AS author_name FROM posts INNER JOIN authors ON posts.author_id = authors.id
  `;
  const [posts] = await db.query(query); //for readability purpose it was set in const query in ``
  res.render('posts-list', { posts: posts});
});

router.get('/new-post', async function (req, res) {
  const [authors] = await db.query('SELECT * FROM authors'); // picks all data from authors table!
  res.render('create-post', { authors: authors });
});

router.post('/posts', async function(req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ];
    await db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [data]); // mysql2 package will insert title, summary, content and author instead of ? placeholder
    res.redirect('/posts');
});

module.exports = router;

/* this configured router will be picked up in app.js by blogRoutes
in app.js and will be used by app.use(blogRoutes) on every incoming request */
