////////////////////
// Global
////////////////////

const express = require("express");

////////////////////
// Components
////////////////////
const questionRouter = require("./app/question/router");
const subjectRouter = require("./app/subject/router");
const topicRouter = require('./app/topic/router');
const userRouter = require('./app/user/router');

const { globalErrorHandler } = require('./app/utils/globalErrorHandler');

////////////////////
// Body
////////////////////

const app = express();

app.use(express.json({ limit: '10kb' }));

// Middleware
app.use((req, res, next) => {
  req.select = '-__v';
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
