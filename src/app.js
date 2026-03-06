const express = require("express");
const routes = require("./routes");
const { apiResponse } = require("./utils");
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173","http://localhost:5173/", "http://localhost:5173/register"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};
const app = express();
app.use(cors(corsOptions));
app.use(passport.initialize());
// app.use(passport.session());

app.use(express.json());
app.use(cookieParser()); 
// ← ADD THIS LINE before routes 
// testing route
app.get("/", (req, res) => {
  res.send("Hello artists!");
});

//routes
app.use("/api", routes);

module.exports = app;

//error handling
app.use((err, req, res, next) => {
  return apiResponse.failure(res, err.message, 500, err.stack);
});