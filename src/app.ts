import express from "express";
import coinRoutes from "./routes/coin.route";

const app = express();

app.use(express.json());
app.use("/api/coins", coinRoutes);

app.get("/", (_req, res) => {
  res.send("CoinView Backend is running 🚀");
});

export default app;
