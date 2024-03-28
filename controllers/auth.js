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


exports.updateUserDetails = async (req, res, next) => {
  const userId = req.body.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const newName = req.body.newName;
  const newAvatarImg = req.body.newAvatarImg;
  const updateField = req.body.updateField; // Field to update: password, name, or avatar_img

  try {
    // Find the user by userId
    const user = await User.finduserId(userId);

    // Check if the user exists
    if (user[0].length !== 1) {
      const error = new Error('A user with this ID could not be found.');
      error.statusCode = 404;
      throw error;
    }

    // Store user data
    const storedUser = user[0][0];

    // Check if the old password is correct if updating password
    if (updateField === 'password') {
      const isEqual = await bcrypt.compare(oldPassword, storedUser.password);

      // If the old password is incorrect
      if (!isEqual) {
        const error = new Error('Old password is incorrect.');
        error.statusCode = 401;
        throw error;
      }

      // If the old password is correct, hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update the password in the database
      await User.updatePassword(userId, hashedNewPassword);

      // Send response
      return res.status(200).json({ message: 'Password changed successfully.' });
    }

    // Prepare an object to store updated user details
    const updatedUserDetails = {};

    // If there's a new name and updating name
    if (newName && updateField === 'name') {
      updatedUserDetails.name = newName;
    }

    // If there's a new avatar image and updating avatar_img
    if (newAvatarImg && updateField === 'avatar_img') {
      updatedUserDetails.avatar_img = newAvatarImg;
    }

    // Update the user details in the database
    await User.updateUserDetails(userId, updatedUserDetails);

    // Send response
    res.status(200).json({ message: 'User details changed successfully.' });
  } catch (err) {
    // Handle errors
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
