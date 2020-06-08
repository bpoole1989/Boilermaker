const db = require("./db");
const Puppy = require("./Puppy");
const User = require("./User");

Puppy.belongsTo(User);
User.hasMany(Puppy);

module.exports = {
  db,
  Puppy,
  User,
};
