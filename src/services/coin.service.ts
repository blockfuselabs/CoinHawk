import { getCoinsNew,getCoinsTopVolume24h, getCoinsTopGainers, getCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

const BASEAPP_REFERRER_ADDRESS = process.env.BASEAPP_REFERRER_ADDRESS?.toLowerCase();

export async function fetchNewCoins(count: number = 10) {
  const response = await getCoinsNew({ count });

  console.log("Fetched new coins:", response.data?.exploreList?.edges?.length);

  const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
  if (!tokens?.length) return [];

  const detailedCoins = await Promise.all(tokens.map(async (coin: any) => {
    const details = await fetchSingleCoin(coin.address);

    const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

    return {
      ...coin,
      details,
      isFromBaseApp,
    };
    
  }));

  return detailedCoins;
} 

//=== Fetches the top trending ===//
export async function fetchTrendingCoins(count: number = 20) {
  try {
    const response = await getCoinsTopVolume24h({ count });

    const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!tokens?.length) return [];

    const detailedCoins = await Promise.all(tokens.map(async (coin: any) => {
      const details = await fetchSingleCoin(coin.address);
      const isFromBaseApp = details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

      return {
        ...coin,
        details,
        isFromBaseApp,
      };
    }));
    return detailedCoins;

  } catch (error) {
    console.error("Error fetching trending coins:", error);
    throw new Error("Failed to fetch trending coins");
  }
}

//=== Fetches coins with the highest market cap ===//

export async function fetchTopMarketCapCoins(count: number = 20) {
  try {
    const response = await getCoinsNew({ count });

    const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node);
    if (!tokens?.length) return [];

    const detailedCoins = await Promise.all(
      tokens.map(async (coin: any) => {
        const details = await fetchSingleCoin(coin.address);
        const isFromBaseApp =
          details?.platformReferrerAddress?.toLowerCase() === BASEAPP_REFERRER_ADDRESS;

        return {
          ...coin,
          details,
          isFromBaseApp,
        };
      })
    );

    return detailedCoins;
  } catch (error) {
    console.error("Error fetching top market cap coins:", error);
    throw new Error("Failed to fetch top market cap coins");
  }
}

export async function fetchSingleCoin(address: string) {
  const response = await getCoin({ address, chain: base.id });
  return response.data?.zora20Token;
}
