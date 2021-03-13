const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");

const pollsRouter = require("./routes/pollsRoutes");
const userRouter = require("./routes/userRoutes");
const globalError = require("./controllers/errorController");
const app = express();

// 1) MIDDLEWARES
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 250,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this ip please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "30kb" }));
//app.use(express.static(`${__dirname}/public`));
app.use(mongoSanitize());

app.use(xss());
app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

// 3) ROUTES
app.use("/api/v1/polls", pollsRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalError);
module.exports = app;
