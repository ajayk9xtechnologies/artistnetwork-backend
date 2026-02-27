const express = require("express");
const routes = require("./routes");
const { apiResponse } = require("./utils");

const app = express();
 
app.use(express.json());
 
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