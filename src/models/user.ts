import mongoose, { Schema, Document } from "mongoose"
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  password: string;
  comparePassword: (candidatePassword: string, cb: any) => void
}

const ThirdPartyProviderSchema = new mongoose.Schema<{
  provider_name: string;
  provider_id: string;
  provider_data: object;
}>({
  provider_name: {
      type: String,
      default: null
  },
  provider_id: {
      type: String,
      default: null
  },
  provider_data: {
      type: {},
      default: null
  }
})

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  username: {
    type: String,
    index: {
      unique: true,
    }
  },
  email: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
  },
  password: {
    type: String,
    required: true,
  },
  thirdPartyAuth: [ThirdPartyProviderSchema]
})

UserSchema.pre('save', function(next) {
  var user = this as IUser

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
}

const User = mongoose.model<IUser>('User', UserSchema)
export default User
