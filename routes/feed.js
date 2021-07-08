const express = require('express');

const feedController = require('../controllers/feed')

const router = express.Router();

// GET api/posts
router.get('/posts', feedController.getPosts);


// POST api/post
router.post('/post', feedController.createPost);

module.exports = router;