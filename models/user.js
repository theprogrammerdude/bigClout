const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// for comparing passwords
userSchema.methods.comparePassword = function(userPassword, checkPassword) {
  bcrypt.compare(userPassword, this.password, (err, isMatch) => {
    if (err) return checkPassword(err);
    checkPassword(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
