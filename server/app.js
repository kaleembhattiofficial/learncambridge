////////////////////
// Global
////////////////////

const express = require("express");

const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

////////////////////
// Components
////////////////////
const questionRouter = require('./app/question/router');
const subjectRouter = require('./app/subject/router');
const topicRouter = require('./app/topic/router');
const userRouter = require('./app/user/router');

const { globalErrorHandler } = require('./app/utils/globalErrorHandler');

////////////////////
// Body
////////////////////

const app = express();

// Implement CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api/v1', limiter);

app.use(express.json({ limit: '10kb' }));

// Middleware
app.use((req, res, next) => {
  // Pagination
  req.perPage = 10;

  if (Number(req.query.page) > 0) {
    req.getPage = Number(req.query.page) - 1;
  } else {
    req.getPage = 0;
  }
  next();
});

// Routes
app.use('/api/v1/question', questionRouter);
app.use('/api/v1/subject', subjectRouter);
app.use('/api/v1/topic', topicRouter);
app.use("/api/v1/user", userRouter);

// Global error handler
app.use("*", globalErrorHandler);

module.exports = app;
