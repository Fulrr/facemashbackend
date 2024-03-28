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
    next(err);
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


exports.updatePassword = async (req, res, next) => {
  const userId = req.body.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    // ค้นหาผู้ใช้ด้วย userId
    const user = await User.finduserId(userId);

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    if (user[0].length !== 1) {
      const error = new Error('A user with this ID could not be found.');
      error.statusCode = 404;
      throw error;
    }

    // เก็บข้อมูลผู้ใช้
    const storedUser = user[0][0];

    // ตรวจสอบว่ารหัสผ่านเดิมถูกต้องหรือไม่
    const isEqual = await bcrypt.compare(oldPassword, storedUser.password);

    // ถ้ารหัสผ่านไม่ตรงกับรหัสผ่านเดิม
    if (!isEqual) {
      const error = new Error('Old password is incorrect.');
      error.statusCode = 401;
      throw error;
    }

    // ถ้ารหัสผ่านเดิมถูกต้อง ให้เข้ารหัสรหัสผ่านใหม่
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
    await User.updatePassword(userId, hashedNewPassword);

    // ส่งคำตอบกลับ
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    // จัดการข้อผิดพลาด
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeName = async (req, res, next) => {
  const userId = req.body.userId;
  const newName = req.body.newName;

  try {
    // Update the user's name in the database
    await User.updateName(userId, newName);

    // Send success response
    res.status(200).json({ message: 'Name changed successfully.' });
  } catch (err) {
    // Handle errors
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeAvatar = async (req, res, next) => {
  const userId = req.body.userId;
  const newAvatarImg = req.body.newAvatarImg;

  try {
    // Update the user's avatar_img in the database
    await User.updateAvatar(userId, newAvatarImg);

    // Send success response
    res.status(200).json({ message: 'Avatar image changed successfully.' });
  } catch (err) {
    // Handle errors
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


