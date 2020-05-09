const Post = require('../models/post');

// CREATING A POST
exports.createPost = (req, res, next) => {

  // getting the server url
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    filePath: url + '/uploads/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    // console.log(createdPost);
    res.status(201).json({
      message: "Post was created successfully!!",
      post: {
        // using spread operate to copy the created object
        ...createdPost,
        id: createdPost._id
      }
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a Post Failed!'
      })
    })
};
// END OF CREATING A POST

// START OF UPDATING A POST
exports.updatePost = (req, res, next) => {
  // console.log(req.file)
  let filePath = req.body.filePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    filePath = url + '/uploads/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    filePath: filePath,
    creator: req.userData.userId
  })
  console.log(post)
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    // console.log(result);
    // nModified is equal 1 when the creator has auth and 0 when not
    if (result.n > 0) {
      res.status(200).json({
        message: 'update was successful'
      });
    } else {
      res.status(401).json({
        message: 'update not successful, Not Authorized!!'
      });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Could not Update Post!'
      });
    })
};
// END OF UPDATING A POST

// START OF GETTING A POSTS
exports.getPosts = (req, res, next) => {
  //http://localhost:3000/api/posts?pagesize=2&page=1&something=cool
  console.log(req.query);

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery.then(documents => {
    // console.log(documents);
    fetchedPosts = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Posts Failed!'
      });
    });
};
// END OF GETTING A POSTS

// START OF GETTING A SINGULAR POST
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post Not Fond!!! :/ '});
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Post Failed!'
      });
    });
};
// END OF GETTING A SINGLE POST

// START OF DELETING A POST
exports.deletePost = (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    // nModified is equal 1 when the creator has auth and 0 when not
    if (result.n > 0) {
      res.status(200).json({
        message: 'Delete was successful'
      });
    } else {
      res.status(401).json({
        message: 'update not successful, Not Authorized!!'
      });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Post Failed!'
      });
    });
}
// END OF DELETING A POST


// START OF DOWNLOAD POST

exports.downloadPost = (req, res, next) => {
  // filepath = path.join(__dirname, './backend/uploads') + '/' + req.file.filename;
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post Not Fond!!! :/ '});
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Downloading Post Failed!'
      });
    });
}


