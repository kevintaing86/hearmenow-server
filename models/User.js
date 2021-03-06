const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  google: String,
  tokens: Array,
  twilio: String,

  admin: { type: Boolean, default: false },
  online: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now },
  login_ip: String,
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },

  profile: {
    name: {
      first: String,
      middle: String,
      last: String
    },
    phone_ext:String,
    gender: String,
    location: String,
    phone: {
      type: String,
      match: /\d{3}-\d{3}-\d{4}/,
    },
    bio: String,
    website: String,
    picture: String,
    date_of_birth: Date,
    address: {
      street: String,
      city: String,
      zip: { type: Number, match: /\d{5}/ },
      state: { type: String },
      country: { type: String }
    }
  },
  contacts: Array,
  call_log: Array
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
