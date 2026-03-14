const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:9000/api/auth/google/callback`
      // no passReqToCallback – identity only
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;

        let user = await User.findOne({ googleId });

        // if no user by googleId, but we have email, try linking existing account
        if (!user && email) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = googleId;
            await user.save();
          }
        }

        if (!user) {
          // new Google user, but don't create yet (role not known)
          // pass minimal identity info via authInfo
          return done(null, false, { googleId, email });
        }

        // existing user → login
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;