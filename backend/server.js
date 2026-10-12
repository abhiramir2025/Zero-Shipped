require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");
const analysisRoutes = require("./routes/analysis.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", analysisRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("[db] connection failed:", err.message);
    console.error("[db] start MongoDB (mongod) and try again.");
    process.exit(1);
  });
