const express = require('express');

const testApiController = require('../controllers/test_api')

const router = express.Router();

// GET api/posts
router.get('/posts', testApiController.getPosts);

module.exports = router;