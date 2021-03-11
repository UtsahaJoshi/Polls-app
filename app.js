const express = require("express");
const morgan = require("morgan");
const pollsRouter = require("./routes/pollsRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  console.log("hello from the middleware");
  next();
});
app.use("/api/v1/polls", pollsRouter);
app.use("/api/v1/users", userRouter);
module.exports = app;
