'use strict';

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (passport, models) => {

  let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: process.env.SECRET
  };

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    models.user.findOne({
      _id: jwt_payload._doc._id
    }, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));

};