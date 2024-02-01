const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../model")

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretsecretsecret';

exports.JwtStrategyPassports = (passport) => {  
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // console.log(jwt_payload,"jwt_payload")
        const user = await User.findOne({ email: jwt_payload.email });
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        console.error("Error during user lookup:", error);
        return done(error, false);
      }
    }));
  };
  
