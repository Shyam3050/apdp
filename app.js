const path = require("path");
const express = require("express");
const viewRouter = require("./routes/viewRouter");
const universityRouter = require("./routes/universityRouter");
const paperRouter = require("./routes/paperRouter");
const morgan = require("morgan");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");

const app = express();

// pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) MIDDLEWARES
app.use(morgan("dev"));

// cors
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://adminapdegreepapers.netlify.app",
      "https://apdegreepapers.in",
    ],
  })
);
app.options("*", cors());

// set security http header
app.use(helmet());
// Add CSP header with img-src directive allowing the specified domain
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "img-src 'self' data: storage.googleapis.com cdn.dribbble.com"
  );
  next();
});

// body parcer reading data from body into req.body
app.use(express.json());

// Data sanitization aginist  NoSql injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// serving Static files
app.use(express.static(path.join(__dirname, "public"), { root: "/" }));

// Routing
app.use("/", viewRouter);
app.use("/api/v1/university", universityRouter);
app.use("/api/v1/paper", paperRouter);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`this path ${req.originalUrl} is not found.`, 400));
});

// global error
app.use(globalErrorHandler);

module.exports = app;
