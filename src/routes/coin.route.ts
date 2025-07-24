import express from "express";
import { fetchNewCoins, fetchTrendingCoins, fetchTopGainers} from "../services/coin.service";

const router = express.Router();

router.get("/new", async (req, res) => {
  try {
    const coins = await fetchNewCoins();
    res.json({ success: true, data: coins });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch coins." });
  }
});

//=== GET /api/trending-coins?count=20 ===//
router.get("/trending-coins", async (req, res) => {
  const count = parseInt(req.query.count as string) || 20;

  try {
    const coins = await fetchTrendingCoins(count);
    res.json({ success: true, data: coins });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
});

//=== GET /api/coins/top-gainers ===//
router.get("/top-gainers", async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 20;
    const coins = await fetchTopGainers(count);
    res.json({ success: true, data: coins });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to fetch top gainers." });
  }
});

export default router;
