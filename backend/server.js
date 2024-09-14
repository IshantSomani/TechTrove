const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const aiToolRoutes = require("./routes/aiTool");
const { searchAiTools } = require("./controller/aiTool");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/ai-tools", aiToolRoutes);
app.get('/search-ai-tools', searchAiTools);

connectDb();

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
  console.log("GET request received");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
