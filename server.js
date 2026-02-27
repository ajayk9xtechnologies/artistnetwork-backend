
require("dotenv").config();
const dbConnect = require("./src/config/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

dbConnect();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});