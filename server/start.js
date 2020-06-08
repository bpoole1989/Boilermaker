const env = process.env.NODE_ENV || "development";
if (env === "development") require("../localSecrets");
const { db } = require("./db");
const app = require(".");

const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!

db.sync().then(() => {
  app.listen(port, () => {
    console.log("Knock, knock");
    console.log("Who's there?");
    console.log(`Your server, listening on port ${port}`);
  });
});
