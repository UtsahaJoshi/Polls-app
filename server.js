const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Handling uncaught exception error
// process.on("uncaughtException", (err) => {
//   console.log("Unhandler exception Shutting Down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

//dot env file config
dotenv.config({ path: "./config.env" });
//main app.js file
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connection successful"));

let port = 3000 || process.env.PORT;
let server = app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});

process.on("unhandledRejection", (err) => {
  //console.log("Unhandler rejection! Shutting Down...");
  console.log(err); //.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
