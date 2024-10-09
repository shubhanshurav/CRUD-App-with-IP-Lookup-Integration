// backend/app.js
const express = require("express");
const database = require("./config/database");
const userRoutes = require("./routes/userRoutes");
// dotenv.config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;

database.connect();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use("/api/v1", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
