
require("dotenv").config();
const dbConnect = require("./src/config/db");
const app = require("./src/app");
const { connectRedis } = require("./src/config/redis");
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await dbConnect();
    await connectRedis();
    console.log("Redis and database connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();