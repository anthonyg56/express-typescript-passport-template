import express from 'express'
import passport from 'passport'

const AuthRouter = express.Router()

AuthRouter.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    console.log(info)
    if (err) {
      return res.status(400).json({ errors: err })
    }
    if (!user) {
      return res.status(400).json({ errors: "No user found" })
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(401).json({ errors: err });
      }
      return res.status(200).json({ success: `logged in ${user.id}` });
    })
  })(req, res, next)
})

export default AuthRouter
