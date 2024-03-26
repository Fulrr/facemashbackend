const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.singup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return

  const avatar_img = req.body.avatar_img;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12)

    const userDetails = {
      avatar_img: avatar_img,
      name: name,
      email: email,
      password: hashedPassword
    }

    const result = await User.save(userDetails);

    res.status(201).json({ message: 'successfully registered' })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.find(email);

    if (user[0].length !== 1) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const storedUser = user[0][0];

    const isEqual = await bcrypt.compare(password, storedUser.password);

    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }



    const token = jwt.sign(
      {
        email: storedUser.email,
        userId: storedUser.aid,
        actype: storedUser.actype,
      },
      'secretfortoken',
      { expiresIn: '1h' }
    );
    // res.status(200).json({ token: token, userId: storedUser.aid });
    res.status(200).json({
      token: token,
      userId: storedUser.aid,
      actype: storedUser.actype,
      message: 'login successfully'
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    if (!err.message || err.message === 'Wrong password!') {
      res.status(401).json({ message: err.message || 'Wrong password!' });
    } else {
      next(err);
    }
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const [User] = await User.getCurrentUser();
    res.status(200).json(User);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkToken = async (req, res) => {
  return res.status(200).json({ message: "true" });
};


exports.getUsedetail = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.finduserId(userId);

    if (user[0].length !== 1) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const storedUser = user[0][0];


    res.status(200).json({
      aid: storedUser.aid,
      avatar_img: storedUser.avatar_img,
      name: storedUser.name,
      email: storedUser.email,
    });


  }catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    
  }
  
  
};


exports.getaccount = async (req, res, next) => {
  try {
      const allac = await User.getaccount(); 
      res.status(200).json(allac); 
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};
