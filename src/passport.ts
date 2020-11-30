import passport from 'passport'
import passportLocal from 'passport-local'
import User, { IUser } from './models/user'
import bcrypt from 'bcrypt'

const LocalStratgey = passportLocal.Strategy

passport.serializeUser<IUser, string>((user, done) => {
  done(null, user._id)
})

passport.deserializeUser<IUser, string>((id, done) => {
  User.findById(id, (err, user) => {
      done(err, user ? user : undefined);
  });
})

passport.use(new LocalStratgey({ usernameField: 'email' }, async (email, password, done) => {
  await User.findOne({ email: email })
  .then(user => {
    if (!user) {
      console.log('no user found')
      const newUser = new User({
        email,
        password,
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
                .save()
                .then(user => {
                    return done(null, user)
                })
                .catch(err => {
                    return done(null, false, { message: err });
                });
        });
      })
    } else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Wrong password" });
        }
      })
    }
  })
  .catch(err => {
    return done(null, false, { message: err });
  })
}))

export default passport
