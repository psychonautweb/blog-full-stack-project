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
  res.render('posts-list', { posts: posts });
});

router.get('/new-post', async function (req, res) {
  const [authors] = await db.query('SELECT * FROM authors'); // picks all data from authors table!
  res.render('create-post', { authors: authors });
});

router.post('/posts', async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    'INSERT INTO posts (title, summary, body, author_id) VALUES (?)',
    [data]
  ); // mysql2 package will insert title, summary, content and author instead of ? placeholder
  res.redirect('/posts');
});

router.get('/posts/:id', async function (req, res) {
  const query = `
  SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
  INNER JOIN authors ON posts.author_id = authors.id
  WHERE posts.id = ?
  `;

  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    // handles case where client manually types random non existent post id
    return res.status(404).render('404');
  }

  const postData = {
    ...posts[0], //all key values pairs are spread, copied over into this new object
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  res.render('post-detail', { post: postData });
});

router.get('/posts/:id/edit', async function (req, res) {
  const query = `
    SELECT * FROM posts WHERE id = ?
  `;
  const [posts] = await db.query(query, [req.params.id]);

  if (!posts || posts.length === 0) {
    // handles case where client manually types random non existent post id
    return res.status(404).render('404');
  }

  res.render('update-post', { post: posts[0] });
});

router.post('/posts/:id/edit', async function (req, res) {
  const query = `
  UPDATE posts SET title = ?, summary = ?, body = ?
  WHERE id = ?
  `;

  await db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);

  res.redirect('/posts');
});

router.post('/posts/:id/delete', async function (req, res) {
  await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.redirect('/posts');
});

module.exports = router;

/* this configured router will be picked up in app.js by blogRoutes
in app.js and will be used by app.use(blogRoutes) on every incoming request */
