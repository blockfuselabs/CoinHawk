import express from "express";
import { fetchNewCoins, fetchTopGainers } from "../services/coin.service";

const router = express.Router();

router.get("/new", async (req, res) => {
  try {
    const coins = await fetchNewCoins();
    res.json({ success: true, data: coins });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch coins." });
  }
});

router.get("/top-gainers", async (req, res) => {
  try {
    const topCoinGainers = await fetchTopGainers();
    res.json({ success: true, data: topCoinGainers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch top gainer coins." });
  }
});

export default router;
