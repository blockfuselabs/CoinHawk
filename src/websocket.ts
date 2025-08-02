import { Server } from "ws";
import { Server as HTTPServer } from "http";
import cache from "./utils/reusableCache";
import { getCoinSummary } from "./services/openai.service";
import {buildTokenSummaryPrompt} from "./services/openai.service"
import { fetchSingleCoin } from "./services/coin.service";
import { getAnswerFromSummary } from "./services/openai.service";
export const setUpWebSocket = (server: HTTPServer) => {
  const wss = new Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connected successfully");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { tokenAddress, userMessage } = message;

        if (!tokenAddress || !userMessage) {
          ws.send(
            JSON.stringify({
              success: false,
              error: "Token address or user message cannot be empty",
            })
          );
          return;
        }
        console.log("Message received:", message);
        let coinSummary = cache.get(tokenAddress);
       
        if (!coinSummary){
            let getCoinDetails = await fetchSingleCoin(tokenAddress);
            console.log(getCoinDetails)
            let buildSummary =buildTokenSummaryPrompt(getCoinDetails);
            // let summary = await getCoinSummary(buildSummary);
            cache.set(tokenAddress, buildSummary);
            coinSummary = buildSummary;
        
        }
        let answer = await getAnswerFromSummary(coinSummary as string, userMessage);
        ws.send(
          JSON.stringify({
            success: true,
            echo: answer,
          })
        );
      } catch (error) {
        console.error("Error parsing message:", error);
        ws.send(
          JSON.stringify({
            success: false,
            error: "Invalid message format",
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
