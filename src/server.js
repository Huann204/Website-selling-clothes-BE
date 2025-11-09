const express = require("express");
const cors = require("cors");
const app = express();
const test = require("./routes/test.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const adminRouters = require("./routes/admin.routes");
const orderRoutes = require("./routes/order.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const statsRoutes = require("./routes/stats.routes");
const contact = require("./routes/contact.routes");
const social = require("./routes/social.routes");
const messagesRoutes = require("./routes/messages.routes");
require("dotenv").config();
const config = require("../config");
const connectDB = require("./config/db");
const payRoutes = require("./routes/pay.routes");
const shipRoutes = require("./routes/ship.routes");

// Middleware để đọc JSON
app.use(express.json());

connectDB();
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello Node.js Backend!");
});
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/products", productRoutes);
app.use("/api/test", test);
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/admins", adminRouters);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/info", contact);
app.use("/api/social", social);
app.use("/api/messages", messagesRoutes);
app.use("/api/pay", payRoutes);
app.use("/api/ship", shipRoutes);
const PORT = config.PORT;
// Server lắng nghe
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
