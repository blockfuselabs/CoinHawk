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
                
               
                
                🔍 YOUR JOB:
            - Give a 3–5 sentence summary.
            - Use plain, beginner-friendly language.
            - Include major red flags (missing description, low volume, low holder count, etc.).
            - Do NOT invent facts — comment only on what's above.
            - If some data is missing (description, roadmap, team, utility, etc.), **say so clearly**.

            -Output only the summary.`
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
  
export async function getAnswerFromSummary(tokenSummary: string, userQuestion: string): Promise<string> {
  console.log("Chat APi", tokenSummary)
  console.log("userQuestion", userQuestion)
  try {
    const response = await assistant.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
        -You are a crypto assistant. You will receive a summary of a token and a user's question.
         -Never mention the word “summary” or refer to the existence of a summary. The user does not need to know about it. Write as if you’re directly analyzing raw data.

      ONLY answer using the provided summary. If information is missing, 
      clearly explain *which* details are missing (e.g., token utility, team info, roadmap) 
      instead of saying "not enough info".

      When possible, explain what could happen *based on the current facts*, 
      using logical reasoning and common industry knowledge — but don't speculate wildly.

      Respond in a helpful, direct tone.
`
        },
        {
          role: "user",
          content: `Here is the token summary:\n\n${tokenSummary}`
        },
        {
          role: "user",
          content: `User Question: ${userQuestion}`
        }
      ],
      model: "gpt-4o",
      temperature: 0.3,
      max_tokens: 300,
    });

    return response.choices[0].message?.content ?? "No answer generated.";
  } catch (error) {
    console.error("Error getting answer from summary:", error);
    return "Error: Failed to get an answer from the summary.";
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
    tokenPrice,
    tokenUri,
    mediaContent,
    creatorEarnings,
  } = data;
  const readableDate = new Date(createdAt).toDateString();
  const creator = creatorProfile?.handle || creatorAddress;
  const chainName = getChainName(data.chainId);
  const hasMedia = mediaContent?.originalUri ? "Yes" : "No";
  const tokenDesc = description?.trim() || "No description provided.";
  const earnings = creatorEarnings?.[0]?.amountUsd || "N/A";
  return `
TOKEN DETAILS:
- Name: ${name}
- Symbol: ${symbol}
- Description: ${tokenDesc}
- Total Supply: ${totalSupply}
- Token Price (in USDC): ${tokenPrice?.priceInUsdc || "Unknown"}
- Market Cap: $${marketCap}
- 24h Volume: ${volume24h}
- Created On: ${readableDate}
- Chain ID: ${data.chainId} (${chainName})
- Unique Holders: ${uniqueHolders}
- Creator: ${creator}
- Creator Earnings: $${earnings}
- Pool Pair: ${symbol} / ${poolCurrencyToken?.name || "unknown"}
- Token URI: ${tokenUri}
- Has Media Content: ${hasMedia}
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