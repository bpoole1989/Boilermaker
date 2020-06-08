const router = require("express").Router();
const { User } = require("../db");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/users/google/callback",
};

router.get("/me", (req, res, next) => {
  res.json(req.user);
});

router.get("/google", passport.authenticate("google", { scope: "email" }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

const strategy = new GoogleStrategy(
  googleConfig,
  (token, refreshToken, profile, done) => {
    const googleId = profile.id;
    const name = profile.displayName;
    const email = profile.emails[0].value;

    User.findOne({ where: { googleId: googleId } })
      .then((user) => {
        if (!user) {
          return User.create({ name, email, googleId }).then((user) => {
            done(null, user);
          });
        } else {
          done(null, user);
        }
      })
      .catch(done);
  }
);

passport.use(strategy);

router.post("/signup", (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      req.login(user, (err) => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

router.put("/login", (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) res.status(401).send("User not found");
      else if (!user.hasMatchingPassword(req.body.password))
        res.status(401).send("Incorrect password");
      else {
        req.login(user, (err) => {
          if (err) next(err);
          else res.json(user);
        });
      }
    })
    .catch(next);
});

router.delete("/logout", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(204);
});

module.exports = router;
