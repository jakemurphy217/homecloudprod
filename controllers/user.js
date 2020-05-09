const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// CREATING AN ACCOUNT
exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
        // password: req.body.password -- not encrypted can see passwords in the database not secure
      });
      user.save().then(result => {
        res.status(201).json({
          message: 'user is created!',
          result: result
        });
      })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid Auth Credentials'
          });
        });
    });
}
// END OF CREATING AN ACCOUNT

// START OF USER LOGIN
exports.userLogin = (req, res, next) => {
  let fetchedUser;
  //trying to find if user exists
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'authentication denied',
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'authentication denied',
        });
      }
      //creating a web token
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        process.env.JWT_KEY,
        {expiresIn: "1h"}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid Auth Credentials',
      });
    });
}
// END OF USER LOGIN
