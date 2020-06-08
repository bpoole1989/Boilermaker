const Sequelize = require("sequelize");
const db = require("./db");

const Puppy = db.define("puppies", {
  name: Sequelize.STRING,
});

module.exports = Puppy;
