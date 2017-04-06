'use strict';

let jwt = require('jsonwebtoken');

module.exports = (app, passport, models) => {

  app.post('/api/register', (req, res) => {

    if (!req.body.email || !req.body.password) {

      res.status(400).json({
        success: false,
        message: 'Please enter email and password.'
      });

    } else {

      let emailPattern = (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

      if (!emailPattern.test(req.body.email)) {
        res.status(400).json({
          success: false,
          message: 'Please valid email.'
        });
      }

      let newUser = new models.user({
        email: req.body.email,
        name: req.body.name
      });
      newUser.password = newUser.generateHash(req.body.password);

      // Attempt to save the user
      newUser.save()
        .then((dbRes) => {
          let token = jwt.sign(dbRes, process.env.SECRET, {
            expiresIn: process.env.EXPIRES_TIME
          });
          res.status(201).json({
            success: true,
            message: `Successfully created new user. ${dbRes.id}`,
            token: token
          });
        })
        .catch((err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: `That email address already exists. ${err}`
            });
          }
        });
    }
  });

  app.post('/api/login', (req, res) => {

    models.user.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) throw err;

      if (!user) {
        res.status(400).send({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else {
        let isMatch = user.validPassword(req.body.password);
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          let token = jwt.sign(user, process.env.SECRET, {
            expiresIn: process.env.EXPIRES_TIME
          });
          res.json({
            success: true,
            message: 'Authentication successfull',
            token
          });
        } else {
          res.status(400).send({
            success: false,
            message: 'Authentication failed. Passwords did not match.'
          });
        }
      }
    });

  });

  app.get('/api/profile', passport.authenticate(['jwt'], {
    session: false
  }), (req, res) => {
    res.status(200).json({
      email: req.user.email,
      name: req.user.name
    });
  });

};