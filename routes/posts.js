const express = require("express");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/upload')
const PostController = require('../controllers/posts');

const router = express.Router();


// /api/posts - CREATE A POST
router.post("", checkAuth, extractFile, PostController.createPost);

// /api/posts/:id - EDITING A POST
router.put("/:id", checkAuth, extractFile, PostController.updatePost);


// /api/posts - GETTING ALL POSTS
router.get('', PostController.getPosts);

// /api/posts/:id - GETTING A SINGLE POST
router.get("/:id", PostController.getPost);

// /api/posts/id - DELETING A SINGLE POST
router.delete("/:id", checkAuth, PostController.deletePost);

// router.get("/download", (req, res, next) => {
//   filepath = path.join(__dirname, './backend/uploads') + '/' + req.file.filename;
// });
router.get("/download", PostController.downloadPost);

module.exports = router;
