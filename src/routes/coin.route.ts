import express from "express";
import { fetchNewCoins } from "../services/coin.service";
import { fetchSingleCoin } from "../services/coin.service";
import { buildTokenSummaryPrompt } from "../services/openai.service";
import { getCoinSummary } from "../services/openai.service";
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
    return res.status(400).json({ error: 'coinAddress is required' });
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
   res.status(500).json({ error: 'Failed to generate summary' });
}
});
export default router;
