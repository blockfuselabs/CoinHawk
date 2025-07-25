import express from "express";
import { fetchSingleCoin } from "../services/coin.service";
import { buildTokenSummaryPrompt } from "../services/openai.service";
import { getCoinSummary } from "../services/openai.service";
import { fetchNewCoins, fetchTopGainers, fetchTrendingCoins, fetchMostValuableCoins } from "../services/coin.service";
const router = express.Router();

router.get("/new", async (req, res) => {
  try {
    const coins = await fetchNewCoins();
    res.json({ success: true, data: coins });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch coins." });
  }
});

router.get("/summary", async (req, res) => {
  const {coinAddress} =  req.query;
  
  if (!coinAddress || typeof coinAddress !== 'string') {
    return res.status(400).json({ success: false, message: "Coin address is required" });
  }

  try{
    const coinsDetails = await fetchSingleCoin(coinAddress);
    const extractCoinDetails = buildTokenSummaryPrompt(coinsDetails);
    const coinSummary = await getCoinSummary(extractCoinDetails);
    res.status(200).json({
      success: true,
      data: coinSummary
    });
  }
  catch(error) {
    res.status(500).json({ success: false, message: "Failed to generate summary" });
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

router.get("/most-valuable", async (req, res) => {
  const count = parseInt(req.query.count as string) || 100;
  
  try {
    const coins = await fetchMostValuableCoins(count);
    res.json({ success: true, data: coins });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
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

router.get("/:address", async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) {
      return res.status(400).json({ success: false, message: "Coin address is required" });
    }
    const coinDetails = await fetchSingleCoin(address);
    if (!coinDetails) {
      return res.status(404).json({ success: false, message: "Coin not found" });
    }
    res.json({ success: true, data: coinDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch coins." });
  }
});

export default router;
