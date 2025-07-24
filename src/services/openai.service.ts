import OpenAI from "openai";
import  dotenv from "dotenv"
dotenv.config()
const assistant  = new OpenAI()

export async  function getCoinSummary(coinDetails: any): Promise<string>{
    try {
         const response= await assistant.chat.completions.create({
        messages: [
            {
                role : "system",
                content: ` You are a crypto token analyst assistant. Your job is to provide clear, concise summaries of cryptocurrency tokens
                
                GUIDELINES:
                - Keep summaries between 3-5 sentences
                - Use simple, non-technical language
                - Focus on the most important details: what the token is, its market performance, and key metrics
                - Highlight any red flags or notable features
                - Be objective and informative, not promotional
                - If market cap or volume is very low, mention potential risks
                - If the token is very new, note this as important context`
            },
            {
            role: "user",
            content: coinDetails
            }
        ],
        model: "chatgpt-4o-latest",
        temperature: 0.3,
        max_tokens: 200 
    });
      return response.choices[0].message?.content ?? "No summary generated.";

        
    } catch (error) {
        
        return "Error: Failed to generate token details"
    }
   
}
    

export function buildTokenSummaryPrompt(data: any): string {
  const {
    name,
    symbol,
    description,
    totalSupply,
    createdAt,
    uniqueHolders,
    marketCap,
    volume24h,
    creatorAddress,
    creatorProfile,
    poolCurrencyToken,
    tokenPrice
  } = data;

  const readableDate = new Date(createdAt).toDateString();

  return `
Analyze this cryptocurrency token:

Name: ${name}
Symbol: ${symbol}
Description: ${description || "No description provided."}
Total Supply: ${totalSupply}
Token Price (in USDC): ${tokenPrice?.priceInUsdc || "Unknown"}
Market Cap: $${marketCap}
24h Volume: ${volume24h}
Created On: ${readableDate}
Chain ID: ${data.chainId} (${getChainName(data.chainId)})
Unique Holders: ${uniqueHolders}
Creator: ${creatorProfile?.handle || creatorAddress}
Pool Pair: ${symbol} / ${poolCurrencyToken?.name || "unknown"}

Provide a concise summary explaining what this token is, its current market status, and any important details beginners should know..
`;
}

function getChainName(chainId: number): string {
  switch (chainId) {
    case 1: return "Ethereum";
    case 8453: return "Base";
    case 137: return "Polygon";
    default: return "Unknown Chain";
  }
}